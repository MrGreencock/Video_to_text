<?php
session_start();
header('Content-Type: application/json');

require_once 'db_connection.php'; // Include the database connection

$response = ["messages" => [], "videos" => []];

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    $response["messages"][] = "Felhasználó nincs bejelentkezve.";
    echo json_encode($response);
    exit;
}

$userId = $_SESSION['user_id'];

// Fetch videos uploaded by the logged-in user
$query = "SELECT id, file_name, file_path, uploaded_at FROM uploaded_files WHERE user_id = ? ORDER BY uploaded_at DESC";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $response["videos"][] = [
            "id" => $row["id"],
            "file_name" => $row["file_name"],
            "file_path" => $row["file_path"],
            "uploaded_at" => $row["uploaded_at"]
        ];
    }

    $stmt->close();
} else {
    $response["messages"][] = "Hiba történt az adatok lekérdezése során: " . $conn->error;
}

$conn->close();

// Return the videos as JSON
echo json_encode($response);
?>
