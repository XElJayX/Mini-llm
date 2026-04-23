from tokenizer.bpe_tokenizer import BPEtokenizer

tokenizer = BPEtokenizer(num_merges=10)

text = "hello help world hell helmet"
tokenizer.train(text)

test = "hello help"
ids, _ = tokenizer.encode(test)
decoded = tokenizer.decode(ids)

print(f"\nOriginal : {test}")
print(f"Ids      : {ids}")
print(f"Decoded  : {decoded}")
print(f"Match    : {test == decoded}")