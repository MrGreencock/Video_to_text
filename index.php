
<?php
    require_once 'db_connection.php'; // Adatbázis kapcsolat
    require_once 'session_check.php';

    $userId = $_SESSION['user_id'];

    $query = "SELECT DISTINCT file_name, file_path FROM uploaded_files WHERE user_id = ? ORDER BY uploaded_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $videos = [];
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
    $stmt->close();

    $languageQuery = "SELECT country_id, country FROM country ORDER BY country";
    $languageStmt = $conn->prepare($languageQuery);
    $languageStmt->execute();
    $languageResult = $languageStmt->get_result();

    $languages = [];
    while ($row = $languageResult->fetch_assoc()) {
        $languages[] = $row;
    }
    $languageStmt->close();
    $conn->close();
?>
<!DOCTYPE html>
<html lang="hu" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Translate video with NLP</title> 
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <style>

        #subtitle {
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0, 0, 0, 0.5);
            padding: 10px;
            font-size: 35px;
            text-align: center;
            border-radius: 5px;
            width: 80%;
            z-index: 1000;
            display: none;
        }

    </style>
  </head>
  <body>

    <div class="vaszon">
        <div class="dekorelem egy"></div>
        <div class="dekorelem ketto">
            <div class="kettoa"></div>
            <div class="kettob"></div>
        </div>
    </div>
    <div class="container show-controls" style="display:none;">
        <div class="wrapper">
            <div class="video-timeline">
                <div class="progress-area">
                    <span>00:00</span>
                    <div class="progress-bar"></div>
                </div>
            </div>
            <ul class="video-controls">
                <li class="options left">
                    <button class="volume"><i class="fa-solid fa-volume-high"></i></button>
                    <input type="range" min="0" max="1" step="any">
                    <div class="video-timer">
                        <p class="current-time">00:00</p>
                        <p class="separator"> / </p>
                        <p class="video-duration">00:00</p>
                    </div>
                </li>
                <li class="options center">
                    <button class="skip-backward"><i class="fas fa-backward"></i></button>
                    <button class="play-pause"><i class="fas fa-play"></i></button>
                    <button class="skip-forward"><i class="fas fa-forward"></i></button>
                </li>
                <li class="options right">
                    <div class="playback-content">
                        <button class="playback-speed"><span class="material-symbols-rounded">slow_motion_video</span></button>
                        <ul class="speed-options">
                            <li data-speed="2">2x</li>
                            <li data-speed="1.5">1.5x</li>
                            <li data-speed="1" class="active">Normal</li>
                            <li data-speed="0.75">0.75x</li>
                            <li data-speed="0.5">0.5x</li>
                        </ul>
                    </div>
                    <div class="nyelvset">
                        <button class="fordikon"><i class="fa-solid fa-language"></i></button>
                        <div class="forras-cel">
                            <select id="sourceLanguage">
                                <option value="">Forrásnyelv</option>
                                <?php foreach ($languages as $language): ?>
                                    <option value="<?= htmlspecialchars($language['country_id']) ?>">
                                        <?= htmlspecialchars($language['country']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>

                            <select id="targetLanguage">
                                <option value="">Célnyelv</option>
                                <?php foreach ($languages as $language): ?>
                                    <option value="<?= htmlspecialchars($language['country_id']) ?>">
                                        <?= htmlspecialchars($language['country']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="subtitles">
                        <button class="subtitle"><i class="fa-solid fa-closed-captioning"></i></button>
                        <div class="subt-options">
                            <button onclick="generateSubtitles()">Generáljon feliratot</button>
                            <button onclick="insertSRTFile()">SRT file beszúrása</button>
                        </div>
                    </div>

                    <button class="pic-in-pic"><span class="material-icons">picture_in_picture_alt</span></button>
                    <button class="fullscreen"><i class="fa-solid fa-expand"></i></button>
                </li>
            </ul>
        </div>
        <div id="subtitle"></div>
        <video id="videoPlayer"></video>
    </div>
    <div class="dekorelem harom upload-progress-container">
        <div id="upload-progress-bar"></div>
    </div>
    <div class="nyil">
        <div class="vissza" onclick="vaszonFel()">&#11165;</div>
        <div class="visszavissza" onclick="vaszonLeMegint()">&#11167;</div>
    </div>

    <div class="import-options">
        <label for="fileUpload" class="gomb">File feltöltés</label>
        <input type="file" id="fileUpload">
        <button onclick="importVideo()">Importálás</button>
    </div>

    <div class="szalag">
        <div class="videok" id="videoGallery">
            <?php if (!empty($videos)): ?>
                <?php foreach ($videos as $video): ?>
                    <div class="video">
                        <video src="<?= htmlspecialchars($video['file_path']) ?>" width="200"></video>
                        <button class="play-video-btn" data-video-path="<?= htmlspecialchars($video['file_path']) ?>">
                        <p><?= htmlspecialchars($video['file_name']) ?></p>    
                        </button>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>Még nincs feltöltött videód.</p>
            <?php endif; ?>
        </div>
    </div>

    <button onclick="logout()" class="gomb lout">
        <i class="fa-solid fa-door-open"></i><br>
        Kijelentkezés
    </button>

    <script src="script.js"></script>
    <script>
      // Logout
      function logout() {
        fetch('logout.php', { method: 'POST' })
          .then(() => {
            window.location.href = 'login.php';
          })
          .catch(error => console.error('Logout failed:', error));
      }
    </script>
  </body>
</html>
