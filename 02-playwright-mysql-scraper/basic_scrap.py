# beautiful soup
import requests
from bs4 import BeautifulSoup
url = "https://books.toscrape.com/"

html = requests.get(url).text
soup=BeautifulSoup(html,"lxml")
books= soup.select("article.product_pod")

for b in books:
    title=b.h3.a["title"]
    price=b.select_one(".price_color").text
    print(title,price)
