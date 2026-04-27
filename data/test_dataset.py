from tokenizer.bpe_tokenizer import BPEtokenizer
from data.dataset import TextDataset
from torch.utils.data import DataLoader

tokenizer = BPEtokenizer(num_merges=500)
with open('data/raw/about_me.txt', 'r') as f:
    text = f.read()
tokenizer.train(text)

dataset = TextDataset('data/raw/about_me.txt', tokenizer, seq_len=64)
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

# Grab one batch and check shapes
x, y = next(iter(dataloader))
print("x shape:", x.shape)  # expect (32, 64)
print("y shape:", y.shape)  # expect (32, 64)
print("x[0]:", x[0])        # first sample — list of token ids