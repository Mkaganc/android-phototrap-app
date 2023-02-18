import logging
import os
import requests
from datetime import datetime, timedelta
from telegram import InputFile
from telegram.ext import Updater, CommandHandler, MessageHandler, Application, ContextTypes, filters
from flask import Flask, request
import pymysql
import threading

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)
app = Flask(__name__)

USERNAME = ''
USERID = ''
TOKEN = 'YOUR TELEGRAM BOT TOKEN HERE'

def get_conn():
    connection = pymysql.connect(
        host="localhost", user="YOUR_USER", password="YOUR_USER_PW", database="YOUR_NAME", port="YOUR_PORT")
    return connection

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

async def start(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    global USERNAME
    USERNAME = update.message.from_user.username
    connection = get_conn()
    cursor = connection.cursor()
    sql = f"SELECT TelegramUsername,Id FROM user WHERE TelegramUsername = %s"
    
    cursor.execute(sql, USERNAME)
    result = cursor.fetchone()
    if result is not None:
        global USERID
        USERID = result[1]
        print(f"New userid: {USERID}")
        await update.message.reply_text(
            "Hi I am Telegram Bot of Photo Trap service.!\n"
            "'/image_day' sends all the photos that taken today. \n"
            "'/image_week' sends all the photos that taken this week.\n"
            "'/video_day' sends all the videos that taken today.\n"
            "'/video_week' sends all the videos that taken in last one week\n"
            "'/help' gives you the contact information of authorized person to assists.\n")
        return 1
    else:
        await update.message.reply_text(
            "I am sorry, I can't find you in my registered users.\n"
            "Please contact with +90 505 555 5555.\n."
            )
        return 0

async def image_day(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    global USERID
    connection = get_conn()
    cursor = connection.cursor()
    query = f"SELECT Path FROM image_table WHERE (Date BETWEEN DATE(NOW()) AND NOW()) AND UserId = %s"
    cursor.execute(query, USERID)
    result = cursor.fetchall()
    images = [x[0] for x in result]

    for image in images:
        await context.bot.send_photo(
            chat_id=update.message.chat_id, photo=open(f"{image}", 'rb'))


async def video_day(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    global USERID
    connection = get_conn()
    cursor = connection.cursor()
    query = "SELECT Path FROM video_table WHERE (Date BETWEEN DATE(NOW()) "
    + "AND NOW()) AND UserId = %s"
    cursor.execute(query, USERID)
    result = cursor.fetchall()
    videos = [x[0] for x in result]
 
    for video in videos:
        await context.bot.send_photo(
            chat_id=update.message.chat_id, photo=open(f"{video}", 'rb'))


async def image_week(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    global USERID
    connection = get_conn()
    cursor = connection.cursor()
    query = "SELECT Path FROM image_table WHERE (Date BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) " 
    + "AND NOW()) AND UserId = %s"
    cursor.execute(query, USERID)
    result = cursor.fetchall()
    images = [x[0] for x in result]
 
    for image in images:
        await context.bot.send_photo(
            chat_id=update.message.chat_id, photo=open(f"{image}", 'rb'))


async def video_week(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    global USERID
    connection = get_conn()
    cursor = connection.cursor()
    query = "SELECT Path FROM video_table WHERE (Date BETWEEN DATE_SUB(NOW(), " 
    + "INTERVAL 7 DAY) AND NOW()) AND UserId = %s"
    cursor.execute(query, USERID)
    result = cursor.fetchall()
    videos = [x[0] for x in result]
 
    for video in videos:
        await context.bot.send_photo(
            chat_id=update.message.chat_id, photo=open(f"{video}", 'rb'))


async def help(update: Updater, context: ContextTypes.DEFAULT_TYPE):
    try:
        await update.message.reply_text(
            "Please contact with 555 555 5555.\n"
            )
    except:
        await update.message.reply_text(
            "Couldn't find authorized person's contacts.\n"
            )

def main():
    dp = Application.builder().token(TOKEN).build() 
    starthandler = CommandHandler("start", start)
    dp.add_handler(starthandler)
    # You could 
    if starthandler:
        dp.add_handler(CommandHandler("image_day", foto_day))
        dp.add_handler(CommandHandler("video_day", video_day))
        dp.add_handler(CommandHandler("image_week", foto_week))
        dp.add_handler(CommandHandler("video_week", video_week))
        dp.add_handler(CommandHandler("help", help))
    dp.run_polling()

    dp.idle()

def start_flask_app(app=app):
    app.run(host='0.0.0.0', debug=True)    

if __name__ == '__main__':
    main()

