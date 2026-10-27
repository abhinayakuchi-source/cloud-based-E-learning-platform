// Storage layer. Works offline with localStorage.
// If window.FIREBASE_CONFIG is set, every write is also mirrored to Firestore (collection "elearning").
const Cloud = {
  mode: "local",
  db: null,
  KEYS: ["users", "courses", "progress"],

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  async init() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey) return;
    try {
      await this.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
      await this.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js");
      firebase.initializeApp(cfg);
      this.db = firebase.firestore();
      for (const key of this.KEYS) {
        const snap = await this.db.collection("elearning").doc(key).get();
        if (snap.exists) localStorage.setItem("el_" + key, snap.data().value);
      }
      this.mode = "firebase";
    } catch (err) {
      console.warn("Firebase unavailable, using local storage.", err);
      this.db = null;
    }
  },

  get(key, fallback) {
    try {
      const raw = localStorage.getItem("el_" + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },

  set(key, value) {
    const json = JSON.stringify(value);
    localStorage.setItem("el_" + key, json);
    if (this.db) {
      this.db.collection("elearning").doc(key).set({ value: json }).catch(console.warn);
    }
  }
};
