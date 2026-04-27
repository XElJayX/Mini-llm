import torch
from torch.utils.data import Dataset

class TextDataset(Dataset):
    def __init__(self,file_path,tokenizer,seq_len):
        self.seq_len = seq_len

        with open(file_path,'r') as f:
            text = f.read()
        
        self.tokens = tokenizer.encode(text)
        # print(f"TOKENS: {self.tokens}")
        print(f"Total tokens in dataset: {len(self.tokens)}")
    
    def __len__(self):
        return len(self.tokens) - self.seq_len

    def __getitem__(self,idx):
        chunk= self.tokens[idx:idx+self.seq_len+1]
        x = torch.tensor(chunk[:-1], dtype = torch.long)
        y = torch.tensor(chunk[1:], dtype = torch.long)

        return x,y 

