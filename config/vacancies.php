<?php
header('Content-Type: application/json');

// Require db_connect.php from the same directory
require_once __DIR__ . '/db_connect.php';

// Get all vacancies
function getVacancies() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM vacancies ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Add new vacancy
function addVacancy($data) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO vacancies (
            job_title, job_description, required_skills, 
            experience_level, application_deadline, 
            vacancy_type, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $data['jobTitle'],
            $data['jobDescription'],
            json_encode($data['requiredSkills']),
            $data['experienceLevel'],
            $data['applicationDeadline'],
            $data['vacancyType'],
            $data['status']
        ]);
        
        return ["success" => true, "id" => $pdo->lastInsertId()];
    } catch(PDOException $e) {
        return ["error" => $e->getMessage()];
    }
}

// Handle API requests
// Set default method to 'GET' if running from CLI or if REQUEST_METHOD is not set
$method = php_sapi_name() === 'cli' ? 'GET' : ($_SERVER['REQUEST_METHOD'] ?? 'GET');
switch($method) {
    case 'GET':
        echo json_encode(getVacancies());
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(["error" => "Invalid or no POST data provided"]);
            break;
        }
        echo json_encode(addVacancy($data));
        break;
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
?>