<?php
header('Content-Type: application/json');
require_once '../config/db_config.php';
require_once '../includes/auth.php';

// Submit application
function submitApplication($data, $files) {
    global $conn;
    try {
        // Handle resume upload
        $resumePath = handleFileUpload($files['resume']);
        
        $stmt = $conn->prepare("INSERT INTO applications (
            vacancy_id, user_id, full_name, email, phone,
            developer_level, education, experience,
            resume_path, portfolio_url, cover_letter
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['vacancy_id'],
            $_SESSION['user_id'],
            $data['full_name'],
            $data['email'],
            $data['phone'],
            $data['developer_level'],
            $data['education'],
            $data['experience'],
            $resumePath,
            $data['portfolio_url'] ?? null,
            $data['cover_letter']
        ]);
        
        return ["success" => true, "id" => $conn->lastInsertId()];
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Handle file upload
function handleFileUpload($file) {
    $targetDir = "../uploads/resumes/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    
    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $targetDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return $fileName;
    }
    throw new Exception("Error uploading file");
}

// Get applications (admin only)
function getApplications($filters = []) {
    global $conn;
    try {
        $sql = "SELECT a.*, v.title as vacancy_title 
                FROM applications a 
                JOIN vacancies v ON a.vacancy_id = v.id 
                WHERE 1=1";
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= " AND a.status = ?";
            $params[] = $filters['status'];
        }

        if (!empty($filters['level'])) {
            $sql .= " AND a.developer_level = ?";
            $params[] = $filters['level'];
        }

        $sql .= " ORDER BY a.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Update application status (admin only)
function updateApplicationStatus($id, $status) {
    global $conn;
    try {
        $stmt = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        return ["success" => true];
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Handle API requests
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (!isAdmin()) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        echo json_encode(getApplications($_GET));
        break;
        
    case 'POST':
        requireLogin();
        echo json_encode(submitApplication($_POST, $_FILES));
        break;
        
    case 'PUT':
        if (!isAdmin()) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(updateApplicationStatus($data['id'], $data['status']));
        break;
}
?>
