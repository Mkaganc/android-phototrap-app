import sys
import os

sys.path.append('/var/www/telebot/')
from receiver import app

app.run(host='0.0.0.0', debug=True)
 
