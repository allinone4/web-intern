<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '28720617');
define('DB_NAME', 'debo_jobs');

// Create connection
try {
    $conn = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?> 