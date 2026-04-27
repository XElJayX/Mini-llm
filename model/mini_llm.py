import torch
import torch.nn as nn
from model.embeddings import Embeddings
from model.transformer_block import TransformerBlock

class MiniLLM(nn.Module):
    def __init__ (self, vocab_size, embedding_dim, n_heads, n_layers, max_seq_len):
        super().__init__()
        self.Embedding = Embeddings(vocab_size,embedding_dim, max_seq_len)
        self.Blocks = nn.Sequential(*[TransformerBlock(embedding_dim,n_heads) for _ in range(n_layers)])
        self.Layernorm = nn.LayerNorm(embedding_dim)
        self.Out = nn.Linear(embedding_dim,vocab_size)


    def forward(self,x):
        x_embedding = self.Embedding(x)
        x_embedding = self.Blocks(x_embedding)
        x_embedding = self.Layernorm(x_embedding)
        return self.Out(x_embedding)