from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import mysql.connector


HOST="localhost"
USER="root"
PASSWORD=""

DB_NAME="Scraper"
TABLE_SQL="""
CREATE TABLE IF NOT EXISTS books(
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(250) UNIQUE NOT NULL,
price VARCHAR(50) NOT NULL,
url VARCHAR(500) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""
def connect_no_db():
    return mysql.connector.connect(host=HOST,user=USER,password=PASSWORD)
def connect_db():
    return mysql.connector.connect(host=HOST,user=USER,password=PASSWORD,database=DB_NAME)

def init_db():
    # create db
    conn=connect_no_db()
    cur=conn.cursor()
    cur.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cur.close()
    conn.close()

    # cretae table
    conn=connect_db()
    cur=conn.cursor()
    cur.execute(TABLE_SQL)
    cur.close()
    conn.close()

def save_book(title,price,url):
    conn=connect_db()
    cur=conn.cursor()
    cur.execute("INSERT IGNORE INTO books (title,price,url) VALUES(%s,%s,%s)",
    (title,price,url))
    conn.commit()
    cur.close()
    conn.close()

def main():
    init_db()

    BASE= "https://books.toscrape.com/"
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=browser.new_page()
        page.goto(BASE,wait_until="networkidle")
        books=page.locator("article.product_pod")
        counts=books.count()

        for i in range(counts):
            book=books.nth(i)
            title=book.locator("h3 a").get_attribute("title").strip()
            href=book.locator("h3 a").get_attribute("href")
            url=urljoin(BASE,href)
            price=book.locator(".price_color").inner_text().strip()
            save_book(title,price,url)
            print("saved:", title,price)

        browser.close()

if __name__=="__main__":
    main()





