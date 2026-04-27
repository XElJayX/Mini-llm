from model.mini_llm import MiniLLM
import torch

model = MiniLLM(
    vocab_size=512,
    embedding_dim=64,
    n_heads=4,
    n_layers=4,
    max_seq_len=128
)

x = torch.randint(0, 512, (2, 16))  # batch=2, seq_len=16
out = model(x)
print("Output shape:", out.shape)  # expect (2, 16, 512)

# Count parameters
total = sum(p.numel() for p in model.parameters())
print(f"Total parameters: {total:,}")