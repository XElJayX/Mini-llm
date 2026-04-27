from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import torch
import os
import sys
sys.path.append('..')
from tokenizer.bpe_tokenizer import BPEtokenizer
from model.mini_llm import MiniLLM

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
device = 'mps' if torch.backends.mps.is_available() else 'cpu'

tokenizer = BPEtokenizer()
tokenizer.load('checkpoints/tokenizer.json')

model = MiniLLM(
    vocab_size=len(tokenizer.str_to_id),
    embedding_dim=64,
    n_heads=4,
    n_layers=4,
    max_seq_len=64
).to(device)

model.load_state_dict(torch.load('checkpoints/model.pt', map_location=device))
model.eval()

class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 100
    temperature: float = 0.8

class GenerateResponse(BaseModel):
    response: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    response = model.generate(
        tokenizer,
        prompt=f"Q: {request.prompt}",
        max_new_tokens=request.max_new_tokens,
        temperature=request.temperature
    )

    if "A:" in response:
        response = response.split("A:")[1].strip()
    
    if "Q:" in response:
        response = response.split("Q:")[0].strip()
    return GenerateResponse(response=response)


ui_build_path = os.path.join(os.path.dirname(__file__), '..', 'ui', 'build')
app.mount("/static", StaticFiles(directory=ui_build_path + "/static"), name="static")

@app.get("/")
def serve_ui():
    return FileResponse(ui_build_path + "/index.html")