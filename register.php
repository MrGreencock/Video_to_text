<?php
require 'db_connection.php'; // Az adatbáziskapcsolat betöltése

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Felhasználónév ellenőrzése
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $error = "A felhasználónév már létezik.";
    } else {
        // Új felhasználó regisztrálása
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $hashedPassword);

        if ($stmt->execute()) {
            // Sikeres regisztráció -> Átirányítás a login.html-re
            header("Location: login.html");
            exit;
        } else {
            $error = "Hiba történt a regisztráció során.";
        }
    }
    $stmt->close();
    $conn->close();
}
?>
