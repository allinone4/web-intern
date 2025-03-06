<?php
header('Content-Type: application/json');
require_once '../config/db_config.php';
require_once '../includes/auth.php';

// Get all vacancies
function getVacancies($filters = []) {
    global $conn;
    try {
        $sql = "SELECT * FROM vacancies WHERE 1=1";
        $params = [];

        if (!empty($filters['level'])) {
            $sql .= " AND experience_level = ?";
            $params[] = $filters['level'];
        }

        if (!empty($filters['type'])) {
            $sql .= " AND vacancy_type = ?";
            $params[] = $filters['type'];
        }

        if (!empty($filters['status'])) {
            $sql .= " AND status = ?";
            $params[] = $filters['status'];
        }

        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Add new vacancy
function addVacancy($data) {
    global $conn;
    try {
        $stmt = $conn->prepare("INSERT INTO vacancies (
            title, description, required_skills, experience_level,
            vacancy_type, deadline, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['title'],
            $data['description'],
            json_encode($data['required_skills']),
            $data['experience_level'],
            $data['vacancy_type'],
            $data['deadline'],
            $data['status']
        ]);
        
        return ["success" => true, "id" => $conn->lastInsertId()];
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Handle API requests
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        echo json_encode(getVacancies($_GET));
        break;
        
    case 'POST':
        if (!isAdmin()) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        echo json_encode(addVacancy($data));
        break;
}
?> 