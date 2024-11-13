<?php
// Feltöltési könyvtár beállítása
$uploadFileDir = './uploaded_videos/';
if (!is_dir($uploadFileDir)) {
    mkdir($uploadFileDir, 0775, true); 
}
if (!is_writable($uploadFileDir)) {
    die("A feltöltési könyvtár nem írható.");
}

$allowedfileExtensions = array('mp4', 'mov', 'avi', 'mkv');  // Csak videófájl kiterjesztések
$response = ["messages" => [], "video_url" => ""];  // Eredmény üzenetek és videó URL

if (isset($_FILES['video']) && $_FILES['video']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['video']['tmp_name'];
    $fileName = $_FILES['video']['name'];
    $fileNameCmps = explode(".", $fileName);
    $fileExtension = strtolower(end($fileNameCmps));

    // Fájl kiterjesztés ellenőrzése
    if (in_array($fileExtension, $allowedfileExtensions)) {
        $dest_path = $uploadFileDir . $fileName;

        // Fájl áthelyezése a feltöltési könyvtárba
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $response["messages"][] = "A fájl $fileName sikeresen feltöltve.";
            $response["video_url"] = "https://dvdantikvar.hu/video_to_text/uploaded_videos/" . $fileName;  // Publikus URL
        } else {
            $response["messages"][] = "Hiba történt a $fileName fájl áthelyezésekor.";
        }
    } else {
        $response["messages"][] = "A feltöltés sikertelen volt a $fileName fájl esetében. Engedélyezett fájltípusok: " . implode(', ', $allowedfileExtensions);
    }
} else {
    $response["messages"][] = "Nem történt fájl feltöltés, vagy hiba történt a fájl feltöltésekor.";
}

// Válasz JSON formátumban
echo json_encode($response);
?>
