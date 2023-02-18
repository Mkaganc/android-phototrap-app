# android-phototrap-app
Mobile App and Server-side application for converting old android phones to phototrap machines.

Android app listens volume down button and when signal came takes a photo or video(you should add necessary script) and sends it to your apache webserver. When server detects new post request saves the file and sends the photo to clients telegram account. 

We made a eletronic kit includes sencors, microprocessor, solarpanel, battery and aux port. When sensors detect any movement gives a current to aux port and it creates a volume down button pressed effect on android phone.

In server-side, receiver.py listens all the incomming 'video-photo' 'login' and 'register' posts and saves file paths to database, checks if the user valid etc. 
In server-side, app.py is a telegram bot algorithm for users to initiate chat and access to their all the taken photo/video s.

We didn't complete the app for accessing their photo and statistics on homepage.

    *mkaganc-yavuzbolat*
