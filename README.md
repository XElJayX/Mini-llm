---
title: Mini LLM
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Mini LLM — Personal AI Assistant

A miniature GPT-style language model trained from scratch on my personal data.

## Architecture
- BPE Tokenizer built from scratch
- Transformer with multi-head self-attention
- Trained on personal bio, resume, and Q&A pairs

## Stack
- PyTorch (model + training)
- FastAPI (backend)
- React (frontend)