<?php
// Database connection settings
$host = "localhost";
$username = "root";
$password = "";
$database = "video_portal";

// Establish a connection to the database
$conn = new mysqli($host, $username, $password, $database);

// Check for connection errors
if ($conn->connect_error) {
    // Log the error (optional) and provide a generic error message for security reasons
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(["messages" => ["Database connection failed. Please try again later."]]);
    exit;
}

// Optional: Set the character set to UTF-8
$conn->set_charset("utf8");

?>
