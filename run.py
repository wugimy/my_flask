from flask import Flask, render_template, redirect, url_for, request
import sqlite3
import pandas as pd # 引用套件並縮寫為 pd
import json
import os
import openpyxl

from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import pymysql

# 資料庫參數設定
db_settings = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "gimy0710",
    "db": "my_db",
    "charset": "utf8"
}

def df_transform(df):
    data = []
    for row in df.values:
        a = list(row[0:2])
        for i in range(2,len(row)):
            #a = [row[0],row[1],df.columns[i],row[i]]
            b = a + [df.columns[i]]
            b.append(row[i])
            data.append(b)
    df = pd.DataFrame(data,columns=['STAGE','ITEM','PERIOD','VAL'])
    return df
def get_df_from_mysql(SQL):
    cn = pymysql.connect(**db_settings)
    df = pd.read_sql(SQL, cn)
    cn.close()
    return df

app = Flask(__name__)
@app.route("/")
def home():
    cn = sqlite3.connect('my_db.db')
    SQL = "select * from expense"
    SQL = "select * from books"
    df = pd.read_sql(SQL, cn)
    cn.close()
    jf = df.to_json(orient="records")
    html = '<a href="/static/index.html">index</a>'
    html += ' | <a href="/create_table">create table</a>'
    html += ' | <a href="/insert">資料插入</a>'
    html += ' | <a href="/web_scraper">爬蟲</a>'
    html += '<h3>' + jf
    html += '</h3>'
    return html

@app.route("/mysql_query", methods=["POST", "GET"])
def mysql_query():
    SQL = "select * from cost_course where MFG_DAY='2023/11/04' and STAGE='A'"
    if request.method == "POST":
        SQL = request.form["sql"]
    df = get_df_from_mysql(SQL)
    jf = df.to_json(orient="records", date_format="iso")
    return jf
    
@app.route("/json_query")
def json_query():
    cn = sqlite3.connect('my_db.db')
    SQL = "select * from expense"
    SQL = "select * from books"
    df = pd.read_sql(SQL, cn)
    cn.close()
    jf = df.to_json(orient="records")
    return jf
    
    
@app.route("/create_table")
def create_table():
    cn = sqlite3.connect('my_db.db')
    SQL = "create table IF NOT EXISTS expense (PERIOD date, CLASS2 char(10), EXPENSE int)"
    SQL = "create table IF NOT EXISTS books (id char(50) primary key,book_name char(50),result char(10),grade int, pass_datetime datetime)"
    cn.execute(SQL)
    cn.close()
    return '<a href="/">expense 表格建立完成</a>'

@app.route("/insert")
def insert():
    cn = sqlite3.connect('my_db.db')
    SQL = "insert into expense (PERIOD,CLASS2,EXPENSE) values ('2023-08-01','維護費用',10000)"
    cn.execute(SQL)
    cn.commit()
    cn.close()
    return '<a href="/">資料插入一筆</a>'

@app.route("/add_book")
def add_book():
    cn = sqlite3.connect('my_db.db')
    SQL = "insert OR IGNORE into books (id) values ('test')"
    cn.execute(SQL)
    cn.commit()
    cn.close()
    return '<a href="/static/index.html">back</a>'

@app.route("/del_book")
def del_book():
    cn = sqlite3.connect('my_db.db')
    SQL = "delete from books where  id='test'"
    cn.execute(SQL)
    cn.commit()
    cn.close()
    return '<a href="/static/index.html">back</a>'

@app.route('/excel/<sheet_name>')
def excel(sheet_name):
    path = r'D:\doc\test.xlsx'
    wb = openpyxl.load_workbook(path)
    #sheet_name = wb.sheetnames[0]
    #s = wb[sheet_name]
    s = wb[wb.sheetnames[0]]
    s['A10'].value = sheet_name
    wb.save(path)
    wb.close()
    os.system(path)
    #return f'<a href="/excel/bbb">Hello</a> {sheet_name}'
    return '<a href="/excel/aaa">aaa</a> <a href="/excel/bbb">bbb</a> '

@app.route("/web_scraper")
def web_scraper():
    driver = webdriver.Edge()
    url = "https://read.tc.edu.tw/member_login_new.php"
    driver.get(url) # 更改網址以前往不同網頁
    a = driver.find_element('id', 'student')
    a.click()
    a = driver.find_element(By.XPATH, "//input[@type='radio' and @value='s_uname']")
    a.click()
    a = driver.find_element(By.NAME, "stu_username")
    a.send_keys('ltestyc111030604')
    a = driver.find_element(By.NAME, "password")
    a.send_keys('71565')
    a = driver.find_element(By.NAME, "submit_item")
    a.click()
    url = "https://read.tc.edu.tw/stu_account_number_1.php"
    driver.get(url) # 更改網址以前往不同網頁
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    driver.close() # 關閉瀏覽器視窗
    
    cn = sqlite3.connect('my_db.db')
    tr = soup.find_all('tr')
    for i in tr:
        td = i.find_all('td')
        if len(td) > 5:
            print(td[1].text,td[2].text,td[3].text,td[4].text,td[5].text)
            SQL = "INSERT OR IGNORE INTO books (id) VALUES ('" + td[1].text + "')"
            cn.execute(SQL)
            pass_datetime = td[5].text.split('~')[0]
            SQL = "update books set book_name='" + td[2].text + "',result='" + td[3].text + "',grade='" + td[4].text + "',pass_datetime='" + pass_datetime + "' where id='" + td[1].text + "'"
            cn.execute(SQL)
    cn.commit()
    cn.close()
    return '<a href="/">爬蟲執行完成</a>'
    
@app.route("/hello")
def hello():
    return "Hello World! This is Hello Page "

@app.route('/meeting/', methods=['GET','POST'])
def meeting():
    cn = sqlite3.connect("my_db.db")
    if 'MSN' in request.form:
        SQL = "update meeting_minutes set "
        SQL += "ITEM='" + request.form['ITEM'] + "'"
        SQL += ",OWNER='" + request.form['OWNER'] + "'"
        SQL += ",DUE_DATE='" + request.form['DUE_DATE'] + "' where SN=" + request.form['MSN']
        cn.execute(SQL)
        cn.commit()
    elif 'ITEM' in request.form:
        if request.form['ITEM']:
            SQL = "insert into meeting_minutes (ITEM) values ('" + request.form['ITEM'] + "')"
            cn.execute(SQL)
            cn.commit()
    SQL = "select * from meeting_minutes where BELONG is null"
    df = pd.read_sql(SQL, cn)
    jf = df.to_json(orient="records")
    cn.close()
    return render_template('meeting.html',myvar=jf)
@app.route('/meeting_minutes/<sn>', methods=['GET','POST'])
def meeting_minutes(sn):
    #sn = request.args.get('sn')
    cn = sqlite3.connect("my_db.db")
    SQL = "select * from meeting_minutes where SN=" + sn
    df = pd.read_sql(SQL, cn)
    title = '會議名稱:' + df["ITEM"][0] + ' 主持人:' + df["OWNER"][0] + ' 日期:' + df["DUE_DATE"][0]
    '''
    if request.method == 'POST':
        if request.form['name']:
            SQL = "insert into meeting_minutes (ITEM,OWNER,DUE_DATE,BELONG) values ('" + request.form['name'] + "'"
            SQL += ",'" + request.form['owner'] + "'"
            SQL += ",'" + request.form['date'] + "'," + sn + ")"
            cn.execute(SQL)
            cn.commit()
    '''
    if 'MSN' in request.form:
        SQL = "update meeting_minutes set ITEM='" + request.form['ITEM'] + "'"
        SQL += ",OWNER='" + request.form['OWNER'] + "'"
        SQL += ",DUE_DATE='" + request.form['DUE_DATE'] + "'"
        SQL += " where SN=" + request.form['MSN']
        cn.execute(SQL)
        cn.commit()
    elif 'ITEM' in request.form:
        SQL = "insert into meeting_minutes (ITEM,OWNER,DUE_DATE,BELONG) values ('" + request.form['ITEM'] + "'"
        SQL += ",'" + request.form['OWNER'] + "'"
        SQL += ",'" + request.form['DUE_DATE'] + "'," + sn + ")"
        cn.execute(SQL)
        cn.commit()        
    SQL = "select * from meeting_minutes where BELONG=" + sn
    df = pd.read_sql(SQL, cn)
    jf = df.to_json(orient="records")
    cn.close()
    return render_template('meeting_minutes.html',title=title,myvar=jf,sn=sn)
@app.route('/init/')
def init():
    cn = sqlite3.connect("my_db.db")
    #SQL = "create table collab (SN INTEGER PRIMARY KEY AUTOINCREMENT, LM_TIME datetime default current_timestamp)"
    #SQL = "insert or replace into collab (SN) values (2)"
    #SQL = "alter table meeting_minutes add column OWNER text after ITEM"
    SQL = "create table IF NOT EXISTS meeting_minutes (SN INTEGER PRIMARY KEY AUTOINCREMENT,ITEM TEXT,OWNER text,DUE_DATE date,BELONG INTEGER, LM_TIME datetime default current_timestamp)"
    cn.execute(SQL)
    cn.commit()
    cn.close()
    return '<a href="/meeting/">完成資料表建立</a>'
    
if __name__ == "__main__":
    app.run()
    
    
'''
from flask import Flask
import webbrowser

app = Flask(__name__)

@app.route("/")
def hello():
    a = "Hello Flask!"
    return a
    

if __name__ == "__main__":
    app.run()
    url='http://127.0.0.1:5000/'
    webbrowser.get('windows-default').open_new(url)
'''