from transformers import MarianMTModel, MarianTokenizer
import os
import re
import torch
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
import time

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@lru_cache(maxsize=None)
def get_model(source_language, target_language):
    model_name = f"Helsinki-NLP/opus-mt-{source_language}-{target_language}"
    tokenizer = MarianTokenizer.from_pretrained(model_name)
    model = MarianMTModel.from_pretrained(model_name).to(device)
    return tokenizer, model

def clean_text(text):
    import unicodedata
    text = "".join(c for c in text if c.isprintable())
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def split_text_into_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return [sentence.strip() for sentence in sentences if sentence.strip()]

def translate_text(text, source_language, target_language):
    tokenizer, model = get_model(source_language, target_language)
    inputs = tokenizer([text], return_tensors="pt", padding=True, truncation=True).to(device)
    outputs = model.generate(**inputs)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def translate_sentences(sentences, source_language, target_language):
    translated_sentences = []
    for sentence in sentences:
        translated_sentence = translate_text(sentence, source_language, target_language)
        # Tisztítás: felesleges szóközök eltávolítása a fordított szövegből
        cleaned_translation = re.sub(r"\s+", " ", translated_sentence).strip()
        translated_sentences.append(cleaned_translation)
    return translated_sentences

def translate_via_english(text, source_language, target_language):
    if source_language == "en" or target_language == "en":
        return translate_text(text, source_language, target_language)

    sentences = split_text_into_sentences(text)
    english_translation = " ".join(
        translate_text(sentence, source_language, "en") for sentence in sentences
    )

    translated_sentences = split_text_into_sentences(english_translation)
    final_translation = " ".join(
        translate_text(sentence, "en", target_language) for sentence in translated_sentences
    )
    return final_translation

def split_srt_by_block_number(input_path, output_folder, block_limit=10):
    os.makedirs(output_folder, exist_ok=True)
    with open(input_path, "r", encoding="utf-8") as srt_file:
        content = srt_file.read()

    blocks = content.strip().split("\n\n")
    total_blocks = len(blocks)

    for i in range(0, total_blocks, block_limit):
        chunk_blocks = blocks[i:i + block_limit]
        chunk_file_path = os.path.join(output_folder, f"srt_chunk_{i // block_limit + 1}.srt")
        with open(chunk_file_path, "w", encoding="utf-8") as chunk_file:
            chunk_file.write("\n\n".join(chunk_blocks))

def translate_chunk(chunk_file, input_folder, source_language, target_language):
    chunk_path = os.path.join(input_folder, chunk_file)
    translated_blocks = []
    print(f"Chunk feldolgozása elkezdődött: {chunk_file}")
    with open(chunk_path, "r", encoding="utf-8") as f:
        blocks = f.read().strip().split("\n\n")
    for i, block in enumerate(blocks):
        if block.strip():
            lines = block.split("\n")
            if len(lines) >= 3:
                index = lines[0]
                timing = lines[1]
                original_text = "\n".join(lines[2:])
                cleaned_text = clean_text(original_text)
                sentences = split_text_into_sentences(cleaned_text)
                translated_sentences = translate_sentences(sentences, source_language, target_language)
                translated_text = " ".join(translated_sentences)
                translated_blocks.append(f"{index}\n{timing}\n{translated_text}")

    print(f"Chunk feldolgozása befejeződött: {chunk_file}")
    return "\n\n".join(translated_blocks)



def translate_srt_chunks_sorted(input_folder, output_file, source_language, target_language):
    start_time = time.time()
    srt_files = [f for f in os.listdir(input_folder) if f.endswith(".srt")]
    srt_files.sort(key=lambda x: int(re.search(r"chunk_(\d+)", x).group(1)))

    translated_results = []
    with ThreadPoolExecutor() as executor:
        future_to_chunk = {executor.submit(translate_chunk, chunk, input_folder, source_language, target_language): chunk for chunk in srt_files}
        for future in future_to_chunk:
            translated_results.append(future.result())

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as output_srt:
        output_srt.write("\n\n".join(translated_results))

def process_srt_translation(input_srt_path, output_srt_path, source_language, target_language, chunk_folder="./srt_chunks", block_limit=25):
    split_srt_by_block_number(input_srt_path, chunk_folder, block_limit)
    translate_srt_chunks_sorted(chunk_folder, output_srt_path, source_language, target_language)
