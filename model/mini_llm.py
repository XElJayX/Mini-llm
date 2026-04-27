import torch
import torch.nn as nn
from model.embeddings import Embeddings
from model.transformer_block import TransformerBlock

class MiniLLM(nn.Module):
    def __init__ (self, vocab_size, embedding_dim, n_heads, n_layers, max_seq_len):
        super().__init__()
        self.max_seq_len = max_seq_len
        self.Embedding = Embeddings(vocab_size,embedding_dim, max_seq_len)
        self.Blocks = nn.Sequential(*[TransformerBlock(embedding_dim,n_heads) for _ in range(n_layers)])
        self.Layernorm = nn.LayerNorm(embedding_dim)
        self.Out = nn.Linear(embedding_dim,vocab_size)


    def forward(self,x):
        x_embedding = self.Embedding(x)
        x_embedding = self.Blocks(x_embedding)
        x_embedding = self.Layernorm(x_embedding)
        return self.Out(x_embedding)

    def generate(self, tokenizer, prompt, max_new_tokens=100, temperature=0.8):
        self.eval()
        input_ids = tokenizer.encode(prompt)
        x = torch.tensor([input_ids]).to(next(self.parameters()).device)

        for _ in range(max_new_tokens):
            # crop to max_seq_len
            x_crop = x[:, -self.max_seq_len:]
            logits = self(x_crop)
            # take logits at last position, apply temperature
            next_logits = logits[0, -1, :] / temperature
            probs = torch.softmax(next_logits, dim=-1)
            next_id = torch.multinomial(probs, num_samples=1)
            x = torch.cat([x, next_id.unsqueeze(0)], dim=1)

        output_ids = x[0].tolist()
        return tokenizer.decode(output_ids)