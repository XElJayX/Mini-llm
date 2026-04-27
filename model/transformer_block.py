import torch.nn as nn
from model.attention import MultiHeadAttention
from model.feedforward import FeedForward

class TransformerBlock(nn.Module):
    def __init__ (self, embedding_dim, n_heads):
        super().__init__()

        self.attention = MultiHeadAttention(embedding_dim,n_heads)
        self.feedforward = FeedForward(embedding_dim)
        self.LN1 = nn.LayerNorm(embedding_dim)
        self.LN2 = nn.LayerNorm(embedding_dim)

    def forward(self, x):
        x = x + self.attention(self.LN1(x))
        x = x + self.feedforward(self.LN2(x))
        return x