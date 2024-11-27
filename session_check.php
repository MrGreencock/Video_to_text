<?php
session_start();

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_id'])) {
    // Ha nincs bejelentkezve, irányítsuk át a login.html-re
    header("Location: login.php");
    exit;
}
?>