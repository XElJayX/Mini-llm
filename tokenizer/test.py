import torch
from tokenizer.bpe_tokenizer import BPEtokenizer
from model.mini_llm import MiniLLM

config = {
    'vocab_size': 532,
    'embedding_dim': 64,
    'n_heads': 4,
    'n_layers': 4,
    'max_seq_len': 64,
}

device = 'mps' if torch.backends.mps.is_available() else 'cpu'

# Load tokenizer
tokenizer = BPEtokenizer()
tokenizer.load('checkpoints/tokenizer.json')
config['vocab_size'] = len(tokenizer.str_to_id)  # then build model

# Load model
model = MiniLLM(
    vocab_size=config['vocab_size'],
    embedding_dim=config['embedding_dim'],
    n_heads=config['n_heads'],
    n_layers=config['n_layers'],
    max_seq_len=config['max_seq_len']
).to(device)

model.load_state_dict(torch.load('checkpoints/model.pt', map_location=device))
# add this to generate.py temporarily
# print("Tokenizer vocab size:", len(tokenizer.str_to_id))
# print("Config vocab size:", config['vocab_size'])
# print("Max token id in tokenizer:", max(tokenizer.id_to_str.keys()))
# # Generate
prompts = [
    "Q: Tell me about your experience?",
    "Q: What projects have you built?",
    "Q: Why should we hire you?",
]

for prompt in prompts:
    print(f"\n{prompt}")
    print(model.generate(tokenizer, prompt=prompt))