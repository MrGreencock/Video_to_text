from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
from translate_srt_helsinki import process_srt_translation
from concurrent.futures import ThreadPoolExecutor
import time
import requests
import shutil

app = Flask(__name__)
CORS(app)
executor = ThreadPoolExecutor()
api_key = "a1b6b6d405244939a769d583b1ec79b2"
headers = {
    "authorization": api_key,
    "content-type": "application/json"
}

@app.route('/upload_srt', methods=['POST'])
def upload_srt_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join('./upload_srt', file.filename)
    file.save(file_path)

    return jsonify({"status": "success", "file_path": file_path})


# FFmpeg konvertálás
@app.route('/convert', methods=['POST'])
def convert_video():
    data = request.json  # JSON adatok fogadása
    input_file = data.get('input_file')
    output_file = data.get('output_file')

    if not os.path.isfile(input_file):
        return jsonify({
            "status": "error",
            "message": f"A bemeneti fájl nem található: {input_file}"
        }), 400

    try:
        # Futtatja az ffmpeg konverziós parancsot
        subprocess.run(
            ["ffmpeg", "-i", input_file, "-c:v", "copy", "-c:a", "aac", output_file],
            check=True
        )
        return jsonify({
            "status": "success",
            "message": "Videó konvertálása sikeres!",
            "output_file": f"{output_file}"
        })
    except subprocess.CalledProcessError as e:
        return jsonify({
            "status": "error",
            "message": f"Hiba a konvertálás során: {str(e)}"
        }), 500



import os
import subprocess

def convert_to_mp3(input_file):
    try:

        # Az output_file létrehozása ugyanabban a könyvtárban, mint az input_file
        output_file = input_file.replace("http://localhost/", "C:/xampp/htdocs/")
        output_file = output_file.replace(".mp4", ".mp3")
        print(f"Az MP3 fájl abszolút útvonala: {output_file}")

        # FFMPEG parancs összeállítása
        command = ["ffmpeg", "-i", input_file, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k", output_file]
        print(f"Futtatandó parancs: {' '.join(command)}")

        # FFMPEG futtatása
        subprocess.run(command, check=True)
        print(f"MP3 konvertálás sikeres: {output_file}")

        # Ellenőrzés, hogy az MP3 fájl létrejött-e
        if not os.path.isfile(output_file):
            raise FileNotFoundError(f"Az MP3 fájl nem található: {output_file}")

        return output_file  # Az output_file elérési útját visszaadja
    except subprocess.CalledProcessError as e:
        print(f"Hiba az MP3 konvertálás során: {e}")
        raise
    except Exception as e:
        print(f"Általános hiba: {e}")
        raise



def upload_audio_to_assemblyai(file_path):
    # Győződj meg róla, hogy a fájl elérési út helyes és abszolút
    file_path = file_path.replace("http://localhost/", "C:/xampp/htdocs/")
    file_path = file_path.replace(".mp4", ".mp3")
    print(f"Feltöltendő fájl abszolút elérési útja: {file_path}")

    try:
        with open(file_path, "rb") as f:
            response = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                files={"file": f}
            )
        if response.status_code == 200:
            audio_url = response.json()["upload_url"]
            print(f"Audio feltöltve: {audio_url}")
            return audio_url
        else:
            raise Exception(f"Audio feltöltés sikertelen: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Feltöltési hiba: {e}")
        raise


def transcribe_audio(audio_url, language_code="en"):
    transcript_request = {"audio_url": audio_url, "language_code": language_code}
    response = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        json=transcript_request,
        headers=headers
    )
    if response.status_code == 200:
        transcript_id = response.json()["id"]
        print(f"Transzkripció indítva. ID: {transcript_id}")
        return transcript_id
    else:
        raise Exception(f"Transzkripció indítása sikertelen: {response.status_code}, {response.text}")

def check_transcription_status(transcript_id):
    url = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    while True:
        response = requests.get(url, headers=headers).json()
        if response["status"] == "completed":
            print("Transzkripció befejeződött.")
            return response
        elif response["status"] == "failed":
            raise Exception("Transzkripció sikertelen.")
        print("Transzkripció folyamatban...")
        time.sleep(5)

def download_srt(transcript_id, output_path):
    try:
        url = f"https://api.assemblyai.com/v2/transcript/{transcript_id}/srt"
        response = requests.get(url, headers=headers)
        output_path = output_path.replace("http://localhost/video_to_text/uploaded_videos/", "C:/xampp/htdocs/video_to_text/upload_srt/")
        if response.status_code == 200:
            with open(output_path, "w", encoding="utf-8") as srt_file:
                srt_file.write(response.text)
            print(f"SRT fájl mentve: {output_path}")
            return output_path
        else:
            raise Exception(f"SRT fájl letöltése sikertelen: {response.status_code}, {response.text}")
    except Exception as e:
        print(f"Hiba az SRT letöltésekor: {e}")
        raise


@app.route('/transcribe', methods=['POST'])
def transcribe_audio_endpoint():
    data = request.json
    input_file = data.get("input_file")
    language_code = data.get("language_code", "en")

    if not input_file:
        return jsonify({"status": "error", "message": "Missing input file"}), 400

    try:
        # 1. MP3 konvertálás
        mp3_file = input_file.replace(".mp4", ".mp3")
        convert_to_mp3(input_file)

        # 2. MP3 feltöltése az AssemblyAI szerverére
        audio_url = upload_audio_to_assemblyai(mp3_file)

        # 3. Transzkripció indítása
        transcript_id = transcribe_audio(audio_url, language_code)

        # 4. Eredmény ellenőrzése
        result = check_transcription_status(transcript_id)

        # 5. SRT fájl mentése
        srt_file_path = input_file.replace(".mp4", ".srt")
        srt_file_path = srt_file_path.replace("http://localhost/video_to_text/uploaded_videos/", "C:/xampp/htdocs/video_to_text/upload_srt/")
        download_srt(transcript_id, srt_file_path)

        if os.path.exists(mp3_file):
            os.remove(mp3_file)
            print(f"Audiofájl törölve: {mp3_file}")

        return jsonify({"status": "success", "transcription": result, "srt_file": srt_file_path})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate_sync():
    data = request.json
    input_srt_path = data.get("file_path")
    
    source_language = data.get("source_language")
    target_language = data.get("target_language")

    if not input_srt_path or not os.path.isfile(input_srt_path):
        return jsonify({"status": "error", "message": "SRT fájl nem található"}), 400

    if not source_language or not target_language:
        return jsonify({"status": "error", "message": "Hiányzik a forrás- vagy célnyelv"}), 400

    try:
        chunk_folder = "./srt_chunks"
        if os.path.exists(chunk_folder):
            shutil.rmtree(chunk_folder)
        translated_file_path = f"./translated_files/{os.path.basename(input_srt_path).replace('.srt', '_translated.srt')}"

        # Fordítási folyamat
        process_srt_translation(
            input_srt_path=input_srt_path,
            output_srt_path=translated_file_path,
            source_language=source_language,
            target_language=target_language,
            chunk_folder=chunk_folder,
            block_limit=25
        )

        # Fordítás kész, JSON válasz visszaadása
        return jsonify({
            "status": "success",
            "message": "Fordítás kész",
            "translated_file": translated_file_path
        })
    
        
    
    except Exception as e:
        # Hiba esetén JSON válasz visszaadása
        return jsonify({
            "status": "error",
            "message": f"Hiba a fordítás során: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
