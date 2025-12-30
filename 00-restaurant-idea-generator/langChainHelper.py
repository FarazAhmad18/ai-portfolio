from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

llm= ChatOllama(model="gpt-oss:120b-cloud",temperature=0.7)
#prompt template 1
name_prompt=ChatPromptTemplate.from_template(
    "I want to open a restaurant for {cuisine} food. Suggest a fancy name for this. Return ONLY the name."
)
#prompt template 2
menu_prompt=ChatPromptTemplate.from_template(
      "Suggest some menu items for {restaurant_name}. Return ONLY a comma-separated list. return only 5-7 menu items"
)

#chain1
name_chain=name_prompt | llm
#chain2
menu_chain=menu_prompt | llm

def generate_restaurant_name_and_items(cuisine:str):
    #invoke chain
    name_msg=name_chain.invoke({"cuisine":cuisine})
    restaurant_name=name_msg.content.strip()

    menu_msg= menu_chain.invoke({"restaurant_name":restaurant_name})
    # menu_list= menu_msg.content.strip()
    menu_text = menu_msg.content.strip()  # this is the comma-separated string from LLM
    menu_list = [item.strip() for item in menu_text.split(",") if item.strip()]

    return{"restaurant_name":restaurant_name,"menu_list":menu_list}

if __name__=="__main__":
    print(generate_restaurant_name_and_items("Punjabi"))
