<?php
session_start();
$errorMessage = $_SESSION['error'] ?? null;
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Bejelentkezés</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form class="login" action="login_process.php" method="POST">
        <h3>Jelentkezz be!</h3>
        <label for="username">Felhasználónév</label>
        <input type="text" id="username" name="username" placeholder="user0" required>
        <label for="password">Jelszó</label>
        <input type="password" id="password" name="password" placeholder="*********" required>
        <button type="submit">Bejelentkezés</button>
        <?php if ($errorMessage): ?>
        <h1 style="color: red;"><?php echo htmlspecialchars($errorMessage); ?></h1>
        <script>
            // Hozzáadja a 'shake' osztályt hibás bejelentkezés esetén
            const usernameField = document.getElementById("username");
            const passwordField = document.getElementById('password');
            usernameField.classList.add('shake');
            passwordField.classList.add('shake');
            setTimeout(() => {
                usernameField.classList.remove('shake');
                passwordField.classList.remove('shake');
            }, 500); // Animáció időtartama
        </script>
        <?php unset($_SESSION['error']); ?>
        <?php endif; ?>
    </form>
</body>
</html>
