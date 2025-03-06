<?php
// db_connect.php
function getDatabaseConnection() {
    $host = 'localhost';
    $username = 'root';
    $password = '28720617'; // Verify this is your correct MySQL root password
    $database = 'debo_jobs';

    try {
        $dsn = "mysql:host=$host;dbname=$database;charset=utf8";
        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo; // Explicitly return PDO object
    } catch (PDOException $e) {
        // Output detailed error for debugging
        die("Connection failed in db_connect.php: " . $e->getMessage() . " (Code: " . $e->getCode() . ")");
    }
}

// Ensure this file always returns something
$pdo = getDatabaseConnection();
if (!$pdo) {
    die("Error: Failed to initialize PDO connection in db_connect.php");
}
return $pdo;
?>