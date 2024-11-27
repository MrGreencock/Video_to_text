<?php
session_start();
require 'db_connection.php'; // Az adatbáziskapcsolat betöltése

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Felhasználó keresése az adatbázisban
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($userId, $hashedPassword);
        $stmt->fetch();

        // Jelszó ellenőrzése
        if (password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $userId; // Bejelentkezett felhasználó azonosítója

            // Átirányítás a proba0.html-re
            header("Location: index.php");
            exit;
        } 
        else {
            $_SESSION['error'] = "Helytelen jelszó.";
            header("Location: login.php");
            exit;
        }
    } 
    else {
        $_SESSION['error'] = "A felhasználónév nem létezik.";
        header("Location: login.php");
        exit;
    }
    $stmt->close();
    $conn->close();
}
?>
