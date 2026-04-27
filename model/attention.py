import torch 
import torch.nn as nn
import torch.nn.functional as F

class SelfAttention(nn.Module):
    def __init__(self,embedding_dim,head_dim):
        super().__init__()

        self.query = nn.Linear(embedding_dim,head_dim,bias=False)
        self.key = nn.Linear(embedding_dim,head_dim,bias=False)
        self.value = nn.Linear(embedding_dim,head_dim,bias=False)

    def forward(self,x):
        # batch_size , seq_len, embedding_dim = x.shape
        Q = self.query(x)
        K = self.key(x)
        V = self.value(x)

        scores = self.compute_scores(Q,K)
        out = self.attend(scores,V)
        return out

    def compute_scores (self, Q, K):
        # Q -> [batch,seq_len,head_dim]
        # K -> [batch,seq_len,head_dim]
        # Score -> [batch,seq_len,seq_len]
        _, seq_len , head_dim = Q.shape
        score = Q @ K.transpose(-2,-1) # [batch,seqlen,headdim] so -1=head_dim and -2 =seqlen
        scaled_score = score / (head_dim ** 0.5)

        mask = torch.tril(torch.ones(seq_len,seq_len)).to(Q.device)
        mask = mask.masked_fill(mask==0 , float('-inf'))

        
        return scaled_score + mask
    
    def attend(self,scores,v):
        # scores shape: (batch, seq_len, seq_len)s
        # V shape:      (batch, seq_len, head_dim)
        softmax_score = F.softmax(scores,-1)
        return softmax_score @ v

class MultiHeadAttention ( nn.Module):

    def __init__(self,embedding_dim,n_heads):
        super().__init__()
        self.head_dim =  embedding_dim // n_heads
        self.heads = nn.ModuleList([SelfAttention(embedding_dim,self.head_dim) for _ in range(n_heads)])
        self.proj = nn.Linear(embedding_dim,embedding_dim)

    def forward(self,x):
        out = torch.cat([h(x) for h in self.heads], dim = -1) 
        out = self.proj(out)
        return out       
