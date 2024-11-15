from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

# Model dosyalarını D: diskine kaydetmek için cache_dir'i ayarla
model_name = "meta-llama/Llama-3.1-70B-Instruct"
pipe = pipeline("text-generation", model=model_name, cache_dir="D:/huggingface_models")

messages = [
    {"role": "user", "content": "Who are you?"},
]

# Metni oluştur
response = pipe(messages)
print(response)
