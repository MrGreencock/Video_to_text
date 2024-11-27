const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input");
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");
szalag = document.querySelector(".szalag"),
vissza = document.querySelector(".vissza"),
visszavissza = document.querySelector(".visszavissza");
let timer;

const fileUpload = document.getElementById("fileUpload");
const youtubeLink = document.getElementById("youtubeLink");
const importOptions = document.querySelector(".import-options");


async function importVideo() {
    if (fileUpload.files.length > 0) {
        const file = fileUpload.files[0];
        const formData = new FormData();
        formData.append("video", file);

        const fileExtension = file.name.split('.').pop().toLowerCase(); // Kiterjesztés ellenőrzése
        const allowedExtensions = ["mkv", "mp4"];

        if (!allowedExtensions.includes(fileExtension)) {
            console.log("Nem támogatott fájlformátum.");
            updateProgressBar(0, "Nem támogatott fájlformátum.");
            return;
        
        }
        const xhr = new XMLHttpRequest();

        // Feltöltési haladás frissítése
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                updateProgressBar(percentComplete, "Feltöltés alatt...");
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                console.log("Szerver válasz:", result);
                console.log(result.messages.join("\n"));

                if (result.video_url) {
                    // A szerver már kezelte a konverziót (ha szükséges), az URL használható
                    updateProgressBar(100, "Kész!");
                    showVideoPlayer(result.video_url);
                } else {
                    console.log("Hiba a fájl feltöltésekor.");
                    updateProgressBar(0, "Hiba a fájl feltöltésekor.");
                }
            } else {
                console.error("HTTP Hiba:", xhr.status);
                updateProgressBar(0, "Hiba történt a feltöltés során.");
            }
        });

        xhr.addEventListener("error", () => {
            console.log("Hiba a videó feltöltésekor");
            updateProgressBar(0, "Hiba a feltöltés során.");
        });

        xhr.open("POST", "./upload_video.php");
        xhr.send(formData);
    } else {
        console.log("Nincs fájl kiválasztva!");
        updateProgressBar(0, "Nincs fájl kiválasztva!");
    }
}


function updateProgressBar(percent, message) {
    const progressBar = document.getElementById("upload-progress-bar");
    importOptions.style.display="none";
    szalag.style.height="2em";
    szalag.style.transition="all 0.3s ease-in-out";
    container.style.display = "flex";
    container.style.height="0%";
    container.style.height=((percent*25)/100) + "em";
    progressBar.innerText = `${percent}% - ${message}`;
    vissza.style.display="block";
}

async function vaszonFel() {
    container.style.display="none";
    importOptions.style.display="flex";
    szalag.removeAttribute('style');
    szalag.style.transition="all 0.3s ease-in-out";
    vissza.removeAttribute('style');
    visszavissza.style.display="block";
}

async function vaszonLeMegint() {
    visszavissza.removeAttribute('style');
    importOptions.style.display="none";
    szalag.style.height="2em";
    szalag.style.transition="all 0.3s ease-in-out";
    container.style.display = "flex";
    vissza.style.display="block";
}


let currentVideoPath = null; // Globális változó

function showVideoPlayer(videoURL) {
    const videoPlayer = document.querySelector(".container video");
    videoPlayer.src = videoURL;
    videoPlayer.load();
    videoPlayer.style.display = "block"; 
    container.style.display = "flex";  
    szalag.style.height = "2em";
    szalag.style.transition = "all 0.3s ease-in-out";
    importOptions.style.display = "none"; 
    vissza.style.display="block";

    // A videoURL mentése a globális változóba
    currentVideoPath = videoURL;
    console.log("Current video path set:", currentVideoPath);
}


const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    else {
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        container.requestFullscreen();
    }
});

fullScreenBtn.addEventListener("keydown", (e) => {
    container.classList.toggle("fullscreen");
    if(e.key == "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        container.requestFullscreen();
    }
});

function getSelectedLanguages() {
    const sourceLanguage = document.getElementById("sourceLanguage").value;
    const targetLanguage = document.getElementById("targetLanguage").value;
    return { sourceLanguage, targetLanguage };
}


async function generateSubtitles() {
    if (!currentVideoPath) {
        console.error("Nincs megadva videoFilePath.");
        return;
    }

    console.log("Video fájl elérési út:", currentVideoPath);

    const { sourceLanguage, targetLanguage } = getSelectedLanguages();

    try {
        // Flask transzkripció
        const transcribeResponse = await fetch("http://127.0.0.1:5000/transcribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input_file: currentVideoPath,
                language_code: sourceLanguage, // Forrásnyelv
            }),
        });

        const transcribeResult = await transcribeResponse.json();
        console.log(transcribeResult)
        if (transcribeResult.status !== "success") {
            throw new Error("Hiba történt a transzkripció során.");
        }

        const subtitles = transcribeResult.srt_file; 
        console.log(subtitles)
        // Flask fordítás
        const translateResponse = await fetch("http://127.0.0.1:5000/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                file_path: subtitles,
                source_language: sourceLanguage,
                target_language: targetLanguage,
            }),
        });

        const translateResult = await translateResponse.json();
        if (translateResult.status !== "success") {
            throw new Error("Hiba történt a fordítás során.");
        }

        // Feliratok megjelenítése
        const translatedSubtitles = translateResult.translated_file;
        loadSubtitles(translatedSubtitles);
        console.log("Fordítás sikeresen alkalmazva!");
    } catch (error) {
        console.error("Hiba történt a felirat generálása során:", error);
    }
}


async function insertSRTFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".srt";

    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("Nincs kiválasztva fájl.");
            return;
        }

        const { sourceLanguage, targetLanguage } = getSelectedLanguages();

        try {
            // SRT fájl feltöltése a szerverre
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await fetch("http://127.0.0.1:5000/upload_srt", {
                method: "POST",
                body: formData,
            });

            const uploadResult = await uploadResponse.json();
            if (uploadResult.status !== "success") {
                throw new Error(`Feltöltési hiba: ${uploadResult.message}`);
            }

            const filePath = uploadResult.file_path; // Feltöltött fájl elérési útja a szerveren

            // Fordítás kérés a szerverre
            const translateResponse = await fetch("http://127.0.0.1:5000/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: filePath,
                    source_language: sourceLanguage,
                    target_language: targetLanguage,
                }),
            });

            const translateResult = await translateResponse.json();
            if (translateResult.status !== "success") {
                throw new Error(`Fordítási hiba: ${translateResult.message}`);
            }

            const translatedSubtitles = translateResult.translated_file; // Fordított felirat
            console.log("Fordított felirat:", translatedSubtitles);

            // Feliratok betöltése a videóhoz
            loadSubtitles(translatedSubtitles);
        } catch (error) {
            console.error("Hiba az SRT fájl feldolgozása során:", error);
        }
    });

    fileInput.click();
}


async function loadSubtitles(filePath, languageCode = "en") {
    try {
        console.log(`Betöltés indítása: ${filePath}`);
        
        // Az SRT fájl tartalmának betöltése
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Nem sikerült betölteni az SRT fájlt: ${response.status}`);
        }
        console.log("SRT fájl sikeresen betöltve.");
        
        const srtText = await response.text();

        // Feliratok feldolgozása
        const cues = parseSRT(srtText);
        console.log("Feliratok feldolgozva:", cues);

        // Feliratok frissítése a videó időzítése szerint
        const videoPlayer = document.getElementById("videoPlayer");
        const subtitleDiv = document.getElementById("subtitle");

        videoPlayer.addEventListener("timeupdate", () => {
            const currentTime = videoPlayer.currentTime;
            const activeCue = cues.find(cue => cue.start <= currentTime && cue.end >= currentTime);

            if (activeCue) {
                subtitleDiv.textContent = activeCue.text;
                subtitleDiv.style.display = "block";
            } else {
                subtitleDiv.textContent = "";
                subtitleDiv.style.display = "none";
            }
        });

        console.log("Feliratok sikeresen alkalmazva.");
    } catch (error) {
        console.error("Hiba a feliratok betöltésekor:", error);
    }
}

function fixTimeFormat(time) {
    if (!time.includes(',')) {
        return time.replace(/$/, ',000'); // Ezredmásodperc hozzáadása, ha hiányzik
    }
    return time;
}

function parseSRT(data) {
    const cues = [];
    const srt = data.trim().split(/\n\s*\n/); // Üres sorok kezelése

    srt.forEach((cue) => {
        const parts = cue.split('\n');
        if (parts.length < 3) return; // Ha nem teljes a formátum, ugorja át

        const [index, time, ...textLines] = parts;
        const indexTrimmed = index.trim();
        if (!/^\d+$/.test(indexTrimmed)) {
            console.warn(`Hibás index: ${index}`);
            return;
        }

        if (!time.includes('-->')) {
            console.warn(`Hibás időformátum (hiányzó "-->"): ${time}`);
            return;
        }

        const [start, end] = time.split(' --> ').map(toSeconds);

        if (isNaN(start) || isNaN(end)) {
            console.warn(`Nem sikerült feldolgozni az időbélyeget: ${time}`);
            return;
        }

        const text = textLines.join('\n'); // Többsoros szövegek egyesítése
        cues.push({ start, end, text });
    });

    return cues;
}


function toSeconds(time) {
    try {
        const [hours, minutes, seconds] = time.split(':');
        const [sec, ms] = seconds.split(',').map(Number); // Ezredmásodperc vesszővel!
        return parseInt(hours) * 3600 + parseInt(minutes) * 60 + sec + ms / 1000;
    } catch (error) {
        console.error("Hibás időformátum:", time, error);
        return NaN; // Hibás időformátum kezelése
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('videoGallery');
    const videoPlayer = document.getElementById('videoPlayer');
    const container = document.querySelector('.container.show-controls');

    gallery.addEventListener('click', (event) => {
        if (event.target.classList.contains('play-video-btn')) {
            const videoPath = event.target.getAttribute('data-video-path');
            
            // A lejátszó forrásának frissítése
            videoPlayer.src = videoPath;
            showVideoPlayer(videoPlayer.src)
            importOptions.style.display = "none";
        }
    });
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));
pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
mainVideo.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));