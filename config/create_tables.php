<?php
// create_tables.php
// Include db_config.php and store the returned PDO object
require_once 'db_config.php';

// Verify $conn is a PDO object
if (!($conn instanceof PDO)) {
    die("Error: Database connection failed - PDO object not returned.");
}

try {
    // Create Vacancies table
    $conn->exec("CREATE TABLE IF NOT EXISTS vacancies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        required_skills TEXT NOT NULL,
        experience_level ENUM('Beginner', 'Early Beginner', 'Junior Developer', 
            'Mid-Level Developer', 'Senior Developer', 'Tech Lead', 
            'Expert Developer', 'Master Developer') NOT NULL,
        vacancy_type ENUM('Full-time', 'Internship-Paid', 'Internship-Unpaid') NOT NULL,
        deadline DATE NOT NULL,
        status ENUM('active', 'closed', 'draft') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // Create Applications table
    $conn->exec("CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vacancy_id INT,
        user_id INT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        developer_level ENUM('Beginner', 'Early Beginner', 'Junior Developer', 
            'Mid-Level Developer', 'Senior Developer', 'Tech Lead', 
            'Expert Developer', 'Master Developer') NOT NULL,
        education TEXT NOT NULL,
        experience TEXT NOT NULL,
        resume_path VARCHAR(255) NOT NULL,
        portfolio_url VARCHAR(255),
        cover_letter TEXT NOT NULL,
        status ENUM('pending', 'shortlisted', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vacancy_id) REFERENCES vacancies(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");

    // Create Users table for admin access
    $conn->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('admin', 'super_admin', 'applicant') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    echo "Tables created successfully";
} catch (PDOException $e) {
    echo "Error creating tables: " . $e->getMessage();
}
?>