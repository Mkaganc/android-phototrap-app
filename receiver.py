import os
import requests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
import pymysql
import base64
app = Flask(__name__)

USERNAME = ''
USERID = 0
TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
def get_conn():
    connection = pymysql.connect(
        host="localhost", user="USER", password="USER_PASSWORD", database="DATABASE_NAME")
    return connection

def send_photo(chat_id, file_path, Token=TOKEN):
    url = f"https://api.telegram.org/bot{Token}/sendPhoto"
    files = {'photo': open(file_path, 'rb')}
    data = {'chat_id': chat_id}
    requests.post(url, files=files, data=data)

def send_video(chat_id, file_path, Token=TOKEN):
    url = f"https://api.telegram.org/bot{Token}/sendVideo"
    files = {'video': open(file_path, 'rb')}
    data = {'chat_id': chat_id}
    requests.post(url, files=files, data=data)

def save_to_database(file_path, user_id, type):
    connection = get_conn()
    cursor = connection.cursor()
    if type == "image":
        sql = "INSERT INTO picture_table (user_id, file_path) VALUES (%s, %s)"
    elif type == "video":
        sql = "INSERT INTO video_table (user_id, file_path) VALUES (%s, %s)"
    try:
        cursor.execute(sql, (user_id, file_path))
        connection.commit()
    except Exception as e:
        connection.rollback()
    finally:
        connection.close()

@app.route("/receiver", methods=["POST"])
def receiver():
    if request.method == "POST":
        user_id = request.json["user_id"]
        media_type = request.json["type"]
        media_bytes = base64.b64decode(request.json["bytes"])
        now = datetime.now()
        date_time = now.strftime("%Y-%m-%d-%H-%M")

        connection = get_conn()
        cursor = connection.cursor()
        sql = f"SELECT TelegramUsername FROM user WHERE Id = %s"
        cursor.execute(sql, user_id)
        result = cursor.fetchone()
        telegram_username = result[0]
        print(f"POST for : {telegram_username}")
        url = f"https://api.telegram.org/bot{TOKEN}/getChat?chat_id={telegram_username}"
        response = requests.get(url)
        if response.status_code == 200:
            chat = response.json()["result"]
            chat_id = chat["id"]
            print("Chat ID:", chat_id)
        else:
            print("Request failed with status code:", response.status_code)

        if media_type == "image":
            filename = f"/var/www/telebot/DATA/IMAGE/{user_id}-{date_time}.jpg"
            with open(filename, "wb") as f:
                f.write(media_bytes)
            save_to_database(filename, user_id, "image")
            send_photo(chat_id=chat_id, file_path=filename)
        elif media_type == "video":
            filename = f"/var/www/telebot/DATA/VIDEO/{user_id}-{date_time}.mp4"
            with open(filename, "wb") as f:
                f.write(media_bytes)
            save_to_database(filename, user_id, "video")
            send_video(chat_id=chat_id, file_path=filename)
        return "File saved."

@app.route('/register', methods=['POST'])

def add_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    telegram_username = data.get('telegram_username')
    client_phone = data.get('client_phone')
    provider_phone = data.get('provider_phone')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO user(Name, Email, Password, TelegramUsername, ClientPhoneNumber, ProviderPhoneNumber) VALUES (%s, %s, %s, %s, %s, %s)", (name, email, password, telegram_username, client_phone, provider_phone))
    conn.commit()
    return jsonify({"message": "User saved successfully!"})


@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT Email, Password FROM  user WHERE (Email=%s AND Password=%s)",(email, password))
    result = cursor.fetchone()
    if result is None:
        return jsonify({"message":"Email or Password Incorrect!"})
    else:
        return jsonify({"message": "User Identified!"})

