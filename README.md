---
title: Mini LLM
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---
# 🤖 Mini LLM — Personal AI Assistant Built From Scratch

A GPT-style decoder-only transformer language model trained on personal resume and Q&A data. Every component — tokenizer, attention mechanism, training loop — was built from scratch in PyTorch without using any pre-built model libraries.

**Live Demo:** [huggingface.co/spaces/ElJayy/mini-llm](https://huggingface.co/spaces/ElJayy/mini-llm)

---

## Architecture

This is a **decoder-only transformer** (same family as GPT-2, GPT-3, GPT-4), built entirely from scratch.

```
Input tokens
     ↓
Token + Positional Embeddings
     ↓
┌─────────────────────────────────┐
│  Transformer Block × 4          │
│                                 │
│  LayerNorm                      │
│  → Masked Multi-Head Attention  │
│  → Residual connection          │
│                                 │
│  LayerNorm                      │
│  → FeedForward (4x expansion)   │
│  → Residual connection          │
└─────────────────────────────────┘
     ↓
Final LayerNorm
     ↓
Linear projection → vocab_size
     ↓
Softmax → next token
```

### Model Stats

| Parameter | Value |
|---|---|
| Total parameters | 273,536 |
| Architecture | Decoder-only transformer |
| Attention type | Masked multi-head self-attention |
| Transformer layers | 4 |
| Attention heads | 4 |
| Embedding dimension | 64 |
| Max sequence length | 64 |
| Vocabulary size | ~530 tokens |
| Tokenizer | BPE (Byte Pair Encoding) |

---

## What Was Built From Scratch

Every component was implemented without using HuggingFace Transformers or any model library.

### BPE Tokenizer (`tokenizer/bpe_tokenizer.py`)
- Character-level initialization
- Iterative pair frequency counting and merging
- Encode / decode with learned merge rules
- Save / load to JSON

### Model Components (`model/`)
- `embeddings.py` — Token embeddings + learned positional embeddings
- `attention.py` — Scaled dot-product self-attention with causal mask, multi-head attention
- `feedforward.py` — Two-layer FFN with 4x expansion and ReLU
- `transformer_block.py` — Pre-norm transformer block with residual connections
- `mini_llm.py` — Full model assembly + autoregressive generation

### Training Infrastructure (`training/train.py`)
- Custom training loop in PyTorch
- AdamW optimizer
- Cosine annealing learning rate scheduler
- Gradient clipping (max norm 1.0)
- Train / validation split (80/20)
- Early stopping with configurable patience
- Best checkpoint saving
- Weights & Biases experiment tracking

---

## Tech Stack

| Layer | Technology |
|---|---|
| Model | PyTorch (from scratch) |
| Tokenizer | Custom BPE implementation |
| Experiment tracking | Weights & Biases |
| Backend API | FastAPI |
| Frontend | React |
| Containerization | Docker |
| Deployment | Hugging Face Spaces |
| Hardware | Apple M4 (MPS acceleration) |

---

## Project Structure

```
mini-llm/
├── tokenizer/
│   └── bpe_tokenizer.py      # BPE tokenizer from scratch
├── model/
│   ├── embeddings.py         # Token + positional embeddings
│   ├── attention.py          # Self-attention + multi-head attention
│   ├── feedforward.py        # FFN layer
│   ├── transformer_block.py  # Full transformer block
│   └── mini_llm.py           # Complete model + generation
├── data/
│   ├── dataset.py            # JSONL dataset + train/val split
│   └── raw/
│       └── about_me.jsonl    # Personal Q&A training data
├── training/
│   ├── train.py              # Training loop with all improvements
│   └── generate.py           # Inference script
├── api/
│   └── main.py               # FastAPI inference endpoint
├── ui/
│   └── src/App.js            # React chat interface
├── checkpoints/              # Saved model weights
├── Dockerfile
└── requirements.txt
```

---

## Training Details

Training data consists of ~100 structured Q&A pairs about my background, skills, projects, and experience, formatted as:

```
User: What are your skills?
Assistant: I am proficient in Python, PyTorch, and FastAPI...
```

### Training Configuration

```python
config = {
    'embedding_dim': 64,
    'n_heads': 4,
    'n_layers': 4,
    'max_seq_len': 64,
    'batch_size': 32,
    'learning_rate': 3e-4,
    'dropout': 0.2,
    'grad_clip': 1.0,
    'patience': 5,
}
```

### Training Results
- Best validation loss: **3.07** (epoch 7)
- Early stopping triggered at epoch 12
- Training device: Apple M4 (MPS)
- Loss curves tracked with Weights & Biases

---

## Running Locally

```bash
# Clone and install
git clone https://github.com/XElJayX/Mini-llm.git
cd mini-llm
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Train the model
python -m training.train

# Run the API
uvicorn api.main:app --reload

# Open the UI
cd ui && npm install && npm start
```

### API Usage

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What are your skills?"}'
```

---

## Key Concepts Implemented

- **Byte Pair Encoding (BPE)** — same subword tokenization algorithm used by GPT-4
- **Scaled dot-product attention** — Q·Kᵀ/√d_k with causal masking
- **Multi-head attention** — 4 parallel attention heads, each learning different patterns
- **Residual connections** — enable gradient flow through deep networks
- **Pre-layer normalization** — more stable than post-norm during training
- **Cosine annealing LR** — smooth learning rate decay over training
- **Gradient clipping** — prevents exploding gradients
- **Early stopping** — halts training when validation loss plateaus

---

## Limitations

- Small model (273k params) trained on limited data — responses may be incoherent
- No instruction tuning or RLHF — not designed to follow complex instructions
- Fixed vocabulary — struggles with out-of-vocabulary words and typos
- Short context window (64 tokens)

---

## License

MIT