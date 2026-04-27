import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from tokenizer.bpe_tokenizer import BPEtokenizer
from data.dataset import TextDataset
from model.mini_llm import MiniLLM

config = {
    'vocab_size': 512,
    'embedding_dim': 64,
    'n_heads': 4,
    'n_layers': 4,
    'max_seq_len': 64,
    'batch_size': 32,
    'learning_rate': 3e-4,
    'epochs': 50,
    'seq_len': 64,
}
device = 'mps' if torch.backends.mps.is_available() else 'cpu'
print(f"Training on: {device}")

tokenizer = BPEtokenizer(num_merges=500)

with open('data/raw/about_me.txt','r') as f:
    text = f.read()

tokenizer.train(text)
config['vocab_size'] = len(tokenizer.str_to_id)


dataset = TextDataset('data/raw/about_me.txt',tokenizer,config['seq_len'])
dataloader = DataLoader(dataset,config['batch_size'],shuffle = True)

model = MiniLLM(
    vocab_size = config['vocab_size'],
     embedding_dim = config['embedding_dim'],
    n_heads = config['n_heads'],
    n_layers = config['n_layers'],
    max_seq_len = config['max_seq_len']
    ).to(device)

optimizer = torch.optim.AdamW(model.parameters(), lr = config['learning_rate'])

for epoch in range(config['epochs']):
    for x,y in dataloader:
        x = x.to(device)
        y = y.to(device)

        logits = model(x)
        B,T,V = logits.shape
        logits = logits.view(B*T,V)
        loss = F.cross_entropy(logits,y.view(B*T))
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()
    print(f"Epoch {epoch+1}/{config['epochs']} Loss: {loss.item():.4f}")
torch.save(model.state_dict(), 'checkpoints/model.pt')
tokenizer.save('checkpoints/tokenizer.json')
response = model.generate(tokenizer, prompt="Q: What are your skills?")
print(response)
