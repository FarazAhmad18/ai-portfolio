import streamlit as st
from langChainHelper import generate_restaurant_name_and_items

st.set_page_config(page_title="Restaurant Generator", layout="centered")

st.title("🍽️ Restaurant Idea Generator")
st.write("Generate a restaurant name and menu using a local LLM (LangChain + Ollama).")

cuisine = st.text_input("Enter cuisine type", placeholder="e.g. Italian, Japanese, Mexican")

if st.button("Generate"):
    if not cuisine.strip():
        st.warning("Please enter a cuisine.")
    else:
        with st.spinner("Thinking..."):
            result = generate_restaurant_name_and_items(cuisine)

        st.success("Done!")

        st.subheader("Restaurant Name")
        st.write(result["restaurant_name"])

        st.subheader("Menu Items")
        st.markdown("\n".join([f"- {item}" for item in result["menu_list"]]))



