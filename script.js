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
let timer;

const fileUpload = document.getElementById("fileUpload");
const youtubeLink = document.getElementById("youtubeLink");
const importOptions = document.querySelector(".import-options");


//Vagy az importVideo()-ba illeszted be az import srt opciót, vagy egy importSRT() hozhatsz, ha úgy kényelmesebb.

async function importVideo() {
    if (fileUpload.files.length > 0) {
        const file = fileUpload.files[0];
        const formData = new FormData();
        formData.append("video", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
            if(event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total)* 100);
                document.getElementById("upload-progress-bar").style.width = percentComplete + "%";
                document.getElementById("upload-progress-bar").innerText = percentComplete + "%";
            }
        });

        xhr.addEventListener("load", () => {
            if(xhr.status == 200) {
                const result = JSON.parse(xhr.responseText);
                console.log(result.messages.join("\n"));

                if(result.video_url) {
                    showVideoPlayer(result.video_url);
                }
                else {
                    console.log("Hiba a fájl feltöltésekor.")
                }
            }
        });

        xhr.addEventListener("error", () => {
            console.log("Hiba a videó feltöltésekor");
        });

        xhr.open("POST", "https://dvdantikvar.hu/video_to_text/upload_video.php");
        xhr.send(formData);
    }
}

function showVideoPlayer(videoURL) {
    const videoPlayer = document.querySelector(".container video");
    videoPlayer.src = videoURL; // Videó forrás beállítása
    videoPlayer.load();         // Videó újratöltése
    videoPlayer.style.display = "block";  // Videóelem megjelenítése
    container.style.display = "flex";     // Konténer megjelenítése
    importOptions.style.display = "none"; // Importálási opciók elrejtése
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

/*function loadSubtitles(subtitleText, languageCode) {
    const videoPlayer = document.getElementById("videoPlayer");
    const track = videoPlayer.addTextTrack("subtitles", "Felirat", languageCode);
    track.mode = "showing";

    const cues = parseSRT(subtitleText);
    cues.forEach(({ start, end, text }) => {
        track.addCue(new VTTCue(start, end, text));
    });
}*/


function parseSRT(data) {
    const cues = [];
    const srt = data.trim().split('\n\n'); // Üres sorok eltávolítása

    srt.forEach((cue) => {
        const parts = cue.split('\n');
        if (parts.length < 3) return; // Ha nem teljes a formátum, ugorja át

        const time = parts[1];
        const [start, end] = time.split(' --> ').map(toSeconds);

        if (isNaN(start) || isNaN(end)) return; // Hibás időformátum esetén kihagyás

        const text = parts.slice(2).join('\n'); // Szöveg egyesítése, ha több soros
        cues.push({ start, end, text });
    });

    return cues;
}

function toSeconds(time) {
    const [hours, minutes, seconds] = time.split(':');
    return parseInt(hours || 0) * 3600 + parseInt(minutes || 0) * 60 + parseFloat((seconds || '0').replace(',', '.'));
}



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