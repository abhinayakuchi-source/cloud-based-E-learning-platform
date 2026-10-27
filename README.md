# Cloud-Based E-Learning Platform

A complete e-learning web application built with **HTML, CSS and JavaScript only**. No installation, no build step and no backend server are needed. Optionally, it can store data in the cloud using **Firebase Firestore**.

---

## 1. Table of Contents
1. Overview
2. Features
3. Technologies Used
4. Project Structure
5. How to Run
6. How to Use the App
7. Connect to the Cloud (Firebase)
8. Deploy Online
9. Push to GitHub
10. How the Code Works
11. Customization
12. Troubleshooting
13. Limitations and Future Improvements

---

## 2. Overview
CloudLearn lets students register, browse courses, watch video lessons, track progress, take quizzes and download a certificate. Instructors can add new courses. By default data is saved in the browser (localStorage). With Firebase configured, the same data is saved to a cloud database, which makes it a true cloud-based application.

## 3. Features
| Area | What it does |
|---|---|
| Authentication | Sign up and log in as **Student** or **Instructor** |
| Course catalog | Cards with level, instructor, lesson count and live search |
| Lessons | Embedded YouTube videos plus text content |
| Progress tracking | Mark lessons complete or undo; progress bars on every course |
| Quiz | Multiple-choice final quiz, 60% needed to pass |
| Certificate | Shown after all lessons are done and the quiz is passed; print or save as PDF |
| Dashboard | Courses started, courses completed, lessons finished |
| Instructor tools | Form to publish a new course with a lesson and a quiz question |
| Cloud sync | Optional Firestore storage |
| Responsive design | Works on desktop, tablet and mobile |

## 4. Technologies Used
- **HTML5** – page structure
- **CSS3** – layout (Grid and Flexbox), responsive design, print styles
- **JavaScript (ES6+)** – routing, state, DOM rendering, quiz logic
- **localStorage / sessionStorage** – default data storage
- **Firebase Firestore (optional)** – cloud database
- **YouTube iframe embed** – video lessons

## 5. Project Structure
```
cloud-elearning/
├── index.html              Main page (loads everything)
├── README.md               This file
├── css/
│   └── style.css           All styling
└── js/
    ├── firebase-config.js  Optional Firebase settings (empty by default)
    ├── data.js             Sample courses, lessons and quizzes
    ├── cloud.js            Storage layer (localStorage + optional Firestore)
    └── app.js              Main application logic and screens
```

## 6. How to Run
**Option A – Easiest:** unzip the folder and double-click `index.html`.

**Option B – Local server (recommended):**
1. Open PowerShell inside the folder (type `powershell` in the File Explorer address bar).
2. Run: `python -m http.server 8000` (needs Python), or use the VS Code **Live Server** extension.
3. Open http://localhost:8000 in your browser.

An internet connection is needed for the YouTube videos and the Google Fonts.

## 7. How to Use the App
1. Click **Log in / Sign up** and create a **Student** account.
2. Open a course from the catalog.
3. Select each lesson, watch the video, and click **Mark as complete**.
4. Click **Final quiz**, answer all questions and submit. You need 60% or more.
5. After all lessons are complete and the quiz is passed, click **Get certificate**, then **Print / Save as PDF**.
6. Open **My learning** to see your dashboard.
7. To add a course, sign up with the **Instructor** role, then click **Add course**.

## 8. Connect to the Cloud (Firebase)
1. Go to https://console.firebase.google.com and click **Add project**.
2. In the project, click the **</>** (Web) icon to register a web app. Copy the `firebaseConfig` object.
3. Open **Build → Firestore Database → Create database** and choose **test mode**.
4. Open `js/firebase-config.js` and replace `window.FIREBASE_CONFIG = null;` with:
```js
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
```
5. Reload the page. The footer should show **Storage mode: firebase**.
6. In the Firebase console you will see a collection named `elearning` with documents `users`, `courses` and `progress`.

Test mode rules expire after 30 days and are open to everyone. Do not use them for a real product.

## 9. Deploy Online
**GitHub Pages (free):**
1. Push the project to GitHub (see section 10).
2. Open the repository → **Settings → Pages**.
3. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
4. After about a minute the site is live at `https://YOUR-USERNAME.github.io/cloud-elearning/`.

**Netlify Drop:** go to app.netlify.com/drop and drag the folder in.

**Firebase Hosting:** install Node.js, run `npm install -g firebase-tools`, then `firebase login`, `firebase init hosting` and `firebase deploy`.

## 10. Push to GitHub
Create an empty repository on github.com (do not tick "Add README"). Then, in PowerShell inside the project folder:
```
git init
git add .
git commit -m "Initial commit: CloudLearn e-learning platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cloud-elearning.git
git push -u origin main
```
Notes:
- Write `git add .` with a space before the dot.
- If Git asks who you are: `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`.
- GitHub needs a Personal Access Token instead of your password, or a browser sign-in popup.
- To update later: `git add .`, `git commit -m "message"`, `git push`.

## 11. How the Code Works
- **Routing:** the URL hash decides the screen: `#/` catalog, `#/course/ID/LESSON`, `#/course/ID/quiz`, `#/dashboard`, `#/teach`. The `route()` function in `app.js` reads it and calls the right view function.
- **Storage:** `Cloud.get(key)` and `Cloud.set(key, value)` in `cloud.js` read and write `users`, `courses` and `progress`. Every write goes to localStorage; if Firebase is active it is also copied to Firestore.
- **Session:** the logged-in user is kept in sessionStorage, so closing the tab logs you out.
- **Progress:** stored as `progress[email][courseId] = { done: [lessonIds], quiz: {score, total} }`.
- **Security helper:** every piece of user text is passed through `esc()` to prevent HTML injection.
- **Passwords:** hashed with a very simple demo function. This is for learning only.

## 12. Customization
- **Add or edit courses:** edit `js/data.js`. Each course needs `id`, `title`, `level`, `instructor`, `color`, `summary`, `lessons[]` and `quiz[]`.
- **Change a video:** replace the `video` value with the ID from a YouTube link (the part after `v=`).
- **Colors and fonts:** change the variables at the top of `css/style.css` (`--primary`, `--accent`, `--ink`).
- **Pass mark:** search for `0.6` in `app.js`.
- **Reset all data:** open browser DevTools (F12) → Application → Local Storage → delete keys starting with `el_`, then reload. If you edit `data.js` and don't see the changes, do this reset because the old courses are cached.

## 13. Troubleshooting
| Problem | Fix |
|---|---|
| Blank page | Press F12 → Console and read the error. Make sure the `js` and `css` folders are next to `index.html`. |
| Video does not play | Check internet connection or the video ID. |
| My `data.js` edits do not show | Clear the `el_courses` key as described above. |
| Storage mode says "local" after adding Firebase | Check the config values and that Firestore is created. Look at the Console for errors. |
| "Missing or insufficient permissions" | Set Firestore rules to test mode. |
| `git add.` is not a git command | Type `git add .` with a space. |
| `git` is not recognized | Install Git from git-scm.com and reopen PowerShell. |
| Push rejected / authentication failed | Use a Personal Access Token or sign in through the browser popup. |

## 14. Limitations and Future Improvements
- Add Firebase Authentication for secure login instead of the demo password hash.
- Add Firestore security rules per user.
- Add file uploads (PDFs, slides) with Firebase Storage.
- Add more quiz question types and instructor course editing.
- Add discussion forums or messaging.

---
Built for learning purposes. Feel free to modify and extend it.
## Developed by
Abhinaya Kuchi
