import torch
import torch.nn as nn

class Embeddings(nn.Module):
    def __init__(self,vocab_size,embedding_dim,max_seq_len):
        super().__init__()
        self.token_embedding_table = nn.Embedding(vocab_size,embedding_dim)
        self.pos_embedding_table = nn.Embedding(max_seq_len,embedding_dim)
        
    def forward(self,x):
        batch_size, seq_len = x.shape
        #X is tensor of token ids , [batch_size, seq_len]
        token_embeddings = self.token_embedding_table(x)
        position  = torch.arange(seq_len)
        pos_embeddings = self.pos_embedding_table(position)

        return token_embeddings + pos_embeddings