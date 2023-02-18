from flask import Flask, jsonify, request
import pymysql

app = Flask(__name__)

conn = pymysql.connect(
        host='localhost',
        user='USER',
        password='USER_PASSWORD',
        db='DATABASE_NAME',
        port=3306,
        )

cursor = conn.cursor()

@app.route('/login', methods=['POST'])
def add_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT Email, Password FROM  user WHERE (Email=%s AND Password=%s)",(email, password))
    result = cursor.fetchone()
    if result is None:
        return jsonify({"message":"Email or Password Incorrect!"})
    else:    
        return jsonify({"message": "User Identified!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True) 
