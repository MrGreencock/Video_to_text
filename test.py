import speech_recognition as sr
from moviepy.editor import *
import datetime


def transcribe_audio_to_srt(wav_path, srt_path, segment_duration=5000):
    recognizer = sr.Recognizer()
    start_time = 0
    subtitle_index = 1
    srt_content = []

    with sr.AudioFile(wav_path) as source:
        while True:
            # Hanganyag feldarabolása
            audio_data = recognizer.record(source, duration=segment_duration / 1000)
            if audio_data.frame_data == b'':  # Ellenőrzi, hogy van-e még adat
                break
            try:
                text = recognizer.recognize_google(audio_data, language="hu-HU")
                start_srt = datetime.timedelta(milliseconds=start_time)
                end_srt = datetime.timedelta(milliseconds=start_time + segment_duration)
                srt_content.append(f"{subtitle_index}\n{start_srt} --> {end_srt}\n{text}\n")
                subtitle_index += 1
            except sr.UnknownValueError:
                pass
            except sr.RequestError as e:
                print(f"API hiba történt: {e}")

            start_time += segment_duration

    # .srt fájl mentése
    with open(srt_path, "w", encoding="utf-8") as srt_file:
        srt_file.writelines(srt_content)

# Használat
video = VideoFileClip("video.mp4")
video.audio.write_audiofile("example.wav")
wav_path = "example.wav"  # Az eredeti MP3 fájl útvonala
srt_path = "output_subtitles.srt"  # A kimeneti SRT fájl neve

transcribe_audio_to_srt(wav_path, srt_path)
