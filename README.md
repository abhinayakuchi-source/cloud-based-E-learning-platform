# CloudLearn – Cloud-Based E-Learning Platform
Built with plain HTML, CSS and JavaScript (no installs, no build step).

## Run it
1. Unzip the folder.
2. Double-click `index.html` (opens in Chrome/Edge/Firefox).
   Optional: run a local server for best results:  `python -m http.server 8000`  then open http://localhost:8000

## Features
- Sign up / log in as Student or Instructor
- Course catalog with search
- Lessons with embedded YouTube videos, mark-as-complete and progress bars
- Final quiz (60% to pass) and printable certificate
- Student dashboard with stats
- Instructors can add new courses
- Data saved in browser storage; optional cloud storage with Firebase Firestore

## Make it truly "cloud" (Firebase, free tier)
1. Go to https://console.firebase.google.com and create a project.
2. Add a Web app, copy the config object.
3. Create a Firestore database (start in test mode).
4. Paste the config into `js/firebase-config.js` (replace `null`).
5. Reload. The footer will show "Storage mode: firebase".

## Deploy online
Upload the folder to Netlify Drop, GitHub Pages, Firebase Hosting or AWS S3 static hosting.

## Project structure
index.html · css/style.css · js/app.js · js/cloud.js · js/data.js · js/firebase-config.js

Note: passwords are hashed with a simple demo function. For a real product use Firebase Authentication.
