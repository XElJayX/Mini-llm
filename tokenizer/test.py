from model.attention import MultiHeadAttention
import torch

mha = MultiHeadAttention(embedding_dim=16, n_heads=4)
x = torch.randn(2, 8, 16)
out = mha(x)
print("Output shape:", out.shape)  # expect (2, 8, 16)