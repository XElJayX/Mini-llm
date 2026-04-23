from collections import defaultdict

class BPEtokenizer:

    def __init__(self,num_merges=100):
        self.num_merges = num_merges
        self.str_to_id = {}
        self.id_to_str = {}
        self.merges = []

    def get_pair_freqs(self,vocab):
        """
        Count how often each adjacent pair of tokens appears.
        vocab is a dict of {tuple_of_tokens: frequency}

        """
        pairs = defaultdict(int)
        for word, freq in vocab.items():
            for i in range(len(word)-1):
                pair = (word[i],word[i+1])
                pairs[pair] += freq
        return pairs

    def merge_pair(self,pair,vocab):
        """
        Merge the most common pair in the vocab.
        For example, if pair is ('l','o'), then we replace all occurrences of 'l' followed by 'o' with 'lo'.
        """
        new_vocab = {}
        a, b = pair # Unpack the pair into its two tokens

        for word, freq in vocab.items():
            new_word=[]
            i = 0
            while i < len(word):
                if i < len(word) - 1 and word[i] == a and word[i+1] == b:
                    new_word.append(a + b)
                    i += 2
                else:
                    new_word.append(word[i])
                    i+=1
            new_vocab[tuple(new_word)] = freq
        return new_vocab

    def train(self,text):
        """
        Full BPE training loop.
        Returns the list of merges learned, in order.
        """
        # Start with character-level vocab
        vocab = {}
        for word in text.strip().split():
            tokens = tuple(list(word))
            vocab[tokens] = vocab.get(tokens,0) + 1

        # RECORD EVERY MERGE

        for i in range(self.num_merges):
            pairs = self.get_pair_freqs(vocab)
            if not pairs:
                break

            best_pair = max(pairs, key=pairs.get)
            vocab = self.merge_pair(best_pair,vocab)
            self.merges.append(best_pair)

            print(f"Merge {i+1}: {best_pair[0]} + {best_pair[1]} → {best_pair[0]+best_pair[1]}")
        
        return self.merges, vocab

    def encode (self,text):
        """
        APPLY LEARNED MERGES TO TEXT
        """

        #START CHAR LEVEL
        tokens = list(text.strip())
        

        #REPLAY MERGES IN ORDER AND MAKE CHANGES

        for a,b in self.merges:
            i = 0
            new_tokens=[]
            while i< len(tokens):
                if i<len(tokens)-1 and tokens[i]==a and tokens[i+1]==b: # FOUND MATCH FOR PAIR
                    new_tokens.append(a+b)
                    i+=2
                else:
                    new_tokens.append(tokens[i])
                    i+=1
            tokens = new_tokens
        
        #BUILD VOCAB FROM MERGES TO ASSIGN INTEGER ID
        vocab = sorted(set(t for t in tokens))
        self.str_to_id = {s:i for i,s in enumerate(vocab)}
        print("TOKENS", tokens)
        return [self.str_to_id[t] for t in tokens], self.str_to_id

    def decode(self, ids):
        self.id_to_str = {i:s for s,i in self.str_to_id.items()}
        return ''.join(self.id_to_str[i] for i in ids)