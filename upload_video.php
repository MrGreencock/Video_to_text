<?php
session_start();
header('Content-Type: application/json');

// Database connection
$conn = new mysqli("localhost", "root", "", "video_portal");
if ($conn->connect_error) {
    echo json_encode(["messages" => ["Database connection failed: " . $conn->connect_error]]);
    exit;
}

// Upload directory settings
$uploadFileDir = './uploaded_videos/';
if (!is_dir($uploadFileDir)) {
    mkdir($uploadFileDir, 0775, true);
}
if (!is_writable($uploadFileDir)) {
    echo json_encode(["messages" => ["The upload directory is not writable."]]);
    exit;
}

// Allowed file extensions
$allowedFileExtensions = ['mkv', 'mp4'];
$response = ["messages" => [], "video_url" => ""];

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["messages" => ["User is not logged in."]]);
    exit;
}

$userId = $_SESSION['user_id'];

// Handle file upload
if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['video']['tmp_name'];
    $fileName = basename($_FILES['video']['name']);
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    if (in_array($fileExtension, $allowedFileExtensions)) {
        // Sanitize file name
        $safeFileName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', $fileName);
        $destPath = $uploadFileDir . $safeFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            // Ellenőrizd, hogy a fájl sikeresen feltöltődött
            if (!file_exists($destPath)) {
                $response["messages"][] = "Error: The uploaded file could not be found.";
                echo json_encode($response);
                exit;
            }

            if ($fileExtension === "mp4") {
                // Directly save MP4 to database
                $stmt = $conn->prepare("INSERT INTO uploaded_files (user_id, file_name, file_path, uploaded_at) VALUES (?, ?, ?, NOW())");
                $stmt->bind_param("iss", $userId, $safeFileName, $destPath);

                if ($stmt->execute()) {
                    $response["messages"][] = "The file $safeFileName was successfully uploaded.";
                    $response["video_url"] = $destPath;
                } else {
                    $response["messages"][] = "Error updating database: " . $stmt->error;
                }
                $stmt->close();
            } 
            elseif ($fileExtension === "mkv") {
                // Készíts POST kérést a Python szolgáltatásnak
                $postData = json_encode([
                    "input_file" => $destPath,
                    "output_file" => $uploadFileDir . preg_replace('/\.[^.]+$/', '.mp4', $safeFileName)
                ]);

                $options = [
                    "http" => [
                        "header" => "Content-Type: application/json\r\n",
                        "method" => "POST",
                        "content" => $postData,
                        "timeout" => 300 // 300 másodperc
                    ]
                ];

                $context = stream_context_create($options);
                $pythonResponse = @file_get_contents("http://127.0.0.1:5000/convert", false, $context);

                if ($pythonResponse === false) {
                    $response["messages"][] = "Python service error.";
                } else {
                    $pythonResponse = json_decode($pythonResponse, true);

                    if ($pythonResponse === null) {
                        $response["messages"][] = "Invalid JSON response from Python service.";
                    } elseif (isset($pythonResponse["status"]) && $pythonResponse["status"] === "success") {
                        $mp4FileName = basename($pythonResponse["output_file"]);
                        $mp4DestPath = $pythonResponse["output_file"];

                        // Mentsd el az adatbázisba
                        $stmt = $conn->prepare("INSERT INTO uploaded_files (user_id, file_name, file_path, uploaded_at) VALUES (?, ?, ?, NOW())");
                        $stmt->bind_param("iss", $userId, $mp4FileName, $mp4DestPath);

                        if ($stmt->execute()) {
                            $response["messages"][] = "The file $mp4FileName was successfully uploaded and converted.";
                            $response["video_url"] = $mp4DestPath;
                        } else {
                            $response["messages"][] = "Error updating database: " . $stmt->error;
                        }
                        $stmt->close();
                    } else {
                        $response["messages"][] = "Python conversion failed: " . ($pythonResponse["message"] ?? "Unknown error");
                    }
                }
            }
        } else {
            $response["messages"][] = "Error moving the file $safeFileName.";
        }
    } else {
        $response["messages"][] = "Upload failed. Allowed file types: " . implode(', ', $allowedFileExtensions);
    }
} else {
    $response["messages"][] = "No file uploaded or an error occurred during the upload.";
}

$conn->close();
echo json_encode($response);
