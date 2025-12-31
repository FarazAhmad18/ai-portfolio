import os
from dotenv import load_dotenv

from langchain_ollama import ChatOllama
from langchain_community.utilities import SQLDatabase
from langchain_core.prompts import ChatPromptTemplate

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

PERSIST_DIR = "chroma_fewshot"

def get_db():
    host = os.getenv("MYSQL_HOST")
    port = os.getenv("MYSQL_PORT", "3306")
    user = os.getenv("MYSQL_USER")
    pw = os.getenv("MYSQL_PASSWORD")
    dbname = os.getenv("MYSQL_DB")
    uri = f"mysql+pymysql://{user}:{pw}@{host}:{port}/{dbname}"
    print("HOST:", os.getenv("MYSQL_HOST"))
    print("DB:", os.getenv("MYSQL_DB"))

    return SQLDatabase.from_uri(uri)


def get_llm():
    return ChatOllama(model=os.getenv("OLLAMA_MODEL", "gpt-oss:120b-cloud"), temperature=0.0)

def get_fewshot_sql_examples(question: str, k: int = 2):
    emb = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vs = Chroma(persist_directory=PERSIST_DIR, embedding_function=emb)
    docs = vs.similarity_search(question, k=k)
    # docs[i].page_content = example question, docs[i].metadata["sql"] = example sql
    return [(d.page_content, d.metadata.get("sql", "")) for d in docs]

SQL_PROMPT = ChatPromptTemplate.from_template("""
You are an expert MySQL analyst. Convert the user's question into a correct MySQL query.

DATABASE SCHEMA:
{schema}

FEW-SHOT EXAMPLES (question -> sql):
{examples}

Rules:
- Output ONLY SQL (no markdown, no explanation).
- Use table/column names exactly as in schema.
- If filtering brand/color/size, match values exactly.
- Prefer SUM, COUNT, JOIN as needed.

User question:
{question}
""".strip())

ANSWER_PROMPT = ChatPromptTemplate.from_template("""
You are a helpful store analytics assistant.
User asked: {question}

SQL used:
{sql}

SQL result:
{result}

Respond with a short, clear final answer (no SQL).
""".strip())

def ask(question: str):
    db = get_db()
    llm = get_llm()

    schema = db.get_table_info()
    few = get_fewshot_sql_examples(question, k=2)
    examples_text = "\n".join([f"- Q: {q}\n  SQL: {s}" for q, s in few])

    sql_msg = (SQL_PROMPT | llm).invoke({
        "schema": schema,
        "examples": examples_text,
        "question": question
    })
    sql = sql_msg.content.strip().rstrip(";") + ";"

    result = db.run(sql)

    answer_msg = (ANSWER_PROMPT | llm).invoke({
        "question": question,
        "sql": sql,
        "result": result
    })
    return {"sql": sql, "result": result, "answer": answer_msg.content.strip()}
