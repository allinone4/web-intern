<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db_connect.php'; // Correct path to db_connect.php

function login($username, $password) {
    global $pdo;

    if (empty($username) || empty($password)) {
        return ["error" => "Username and password are required"];
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true); // Prevent session fixation attacks
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            return ["success" => true, "role" => $user['role']];
        }
        return ["error" => "Invalid credentials"];
    } catch (PDOException $e) {
        return ["error" => "Database error, please try again later"];
    }
}

// ✅ Allow Running from Both CLI and Web Requests
if (php_sapi_name() === 'cli') {
    // Running from CLI: Allow manual testing
    $username = readline("Enter username: ");
    $password = readline("Enter password: ");
    echo json_encode(login($username, $password), JSON_PRETTY_PRINT);
} else {
    // Running from a Web Request
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['username'], $data['password'])) {
            echo json_encode(["error" => "Invalid request"]);
            exit;
        }

        echo json_encode(login(trim($data['username']), $data['password']));
    } else {
        echo json_encode(["error" => "Invalid access method. Use POST request."]);
    }
}
?>

