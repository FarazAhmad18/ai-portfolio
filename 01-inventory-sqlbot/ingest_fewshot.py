import json
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

EXAMPLES_FILE = "fewshot_examples.json"
PERSIST_DIR = "chroma_fewshot"

def main():
    examples=json.load(open(EXAMPLES_FILE,"r",encoding="utf-8")) 
    texts=[e["question"] for e in examples]
    metadatas=[{"sql":e["sql"]}for e in examples]
    emb=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vs=Chroma.from_texts(
    texts=texts,
    metadatas=metadatas,
    embedding=emb,
    persist_directory=PERSIST_DIR
    )
    vs.persist()
    print("✅ Few-shot examples indexed in Chroma.")

if __name__=="__main__":
    main()