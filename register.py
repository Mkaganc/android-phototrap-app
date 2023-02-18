from flask import Flask, jsonify, request
import pymysql

app = Flask(__name__)

conn = pymysql.connect(user='USER', password='USER_PASSWORD', host='localhost', database='DATABASE_NAME')
cursor = conn.cursor()

@app.route('/register', methods=['POST'])

def add_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    telegram_username = data.get('telegram_username')
    client_phone = data.get('client_phone')
    provider_phone = data.get('provider_phone')

    cursor.execute("INSERT INTO user(Name, Email, Password, TelegramUsername, ClientPhoneNumber, ProviderPhoneNumber) VALUES (%s, %s, %s, %s, %s, %s)", (name, email, password, telegram_username, client_phone, provider_phone))
    conn.commit()
    return jsonify({"message": "User saved successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)

