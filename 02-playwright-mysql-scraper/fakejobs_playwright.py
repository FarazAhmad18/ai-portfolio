from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import mysql.connector

BASE="https://realpython.github.io/fake-jobs/"
HOST="localhost"
USER="root"
PASSWORD=""
DB_NAME="JOB"
TABLE_SQL="""
CREATE TABLE IF NOT EXISTS jobs(
id INT AUTO_INCREMENT PRIMARY KEY,
TITLE VARCHAR(70) NOT NULL,
SUB_TITLE VARCHAR(80) NOT NULL,
LOCATION VARCHAR(80) NOT NULL,
DATE VARCHAR(50) NOT NULL,
URL VARCHAR(500) UNIQUE,
CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
"""
#connect server
def connect_no_db():
    return mysql.connector.connect(host=HOST,user=USER,password=PASSWORD)
# connect db
def connect_db():
    return mysql.connector.connect(host=HOST,user=USER,password=PASSWORD,database=DB_NAME)

def init_db():
    conn=connect_no_db()
    cur=conn.cursor()
    cur.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    cur.close()
    conn.close()
    
    conn=connect_db()
    cur=conn.cursor()
    cur.execute(TABLE_SQL)
    conn.commit()
    cur.close()
    conn.close()


def save_job(title,sub_title,location,date,url):
    conn=connect_db()
    cur=conn.cursor()
    cur.execute("INSERT IGNORE INTO jobs (title,sub_title,location,date,url) VALUES(%s,%s,%s,%s,%s)",
    (title,sub_title,location,date,url)
    )
    conn.commit()
    cur.close()
    conn.close()

def main():
    init_db()
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=browser.new_page()
        page.goto("https://realpython.github.io/fake-jobs/")
        jobs=page.locator(".card")
        count=jobs.count()

        print(count)
        for i in range(count):
             job=jobs.nth(i)
             title=job.locator(".title").inner_text()
             sub_title=job.locator(".subtitle").inner_text()
             location=job.locator(".location").inner_text()
             date=job.locator(".is-small").inner_text()
             href=job.locator(".card-footer a").nth(1).get_attribute("href")
             url=urljoin(BASE,href)
             save_job(title,sub_title,location,date,url)
        # print(href)
        # print(sub_title)
        # print(location)
        # print(date)
        
if __name__=="__main__":
    main()