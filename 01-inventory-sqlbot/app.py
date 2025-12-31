import streamlit as st
from sql_bot import ask

st.set_page_config(page_title="AtliQ Tees SQL Bot", layout="centered")
st.title("👕 AtliQ Tees — Talk to MySQL (Local LLM)")

q = st.text_input("Ask a question", placeholder="e.g. How many white Adidas t-shirts are left?")

if st.button("Ask"):
    if not q.strip():
        st.warning("Type a question first.")
    else:
        with st.spinner("Thinking + querying DB..."):
            out = ask(q)

        st.success("Done")
        st.subheader("Answer")
        st.write(out["answer"])

        with st.expander("Show SQL"):
            st.code(out["sql"], language="sql")

        with st.expander("Raw DB result"):
            st.write(out["result"])
