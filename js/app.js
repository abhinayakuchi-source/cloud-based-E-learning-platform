/* CloudLearn – single-page e-learning app (HTML + CSS + JS only) */
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); }; // demo only

/* ---------- State ---------- */
const store = {
  users: () => Cloud.get("users", {}),
  courses: () => Cloud.get("courses", null) || (Cloud.set("courses", window.SEED_COURSES), window.SEED_COURSES),
  progress: () => Cloud.get("progress", {}),
  session: () => JSON.parse(sessionStorage.getItem("el_session") || "null"),
};
const currentUser = () => { const s = store.session(); return s ? store.users()[s.email] || null : null; };

function getProgress(email, courseId) {
  const all = store.progress();
  return (all[email] && all[email][courseId]) || { done: [], quiz: null };
}
function saveProgress(email, courseId, data) {
  const all = store.progress();
  all[email] = all[email] || {};
  all[email][courseId] = data;
  Cloud.set("progress", all);
}
function percent(course, prog) {
  return Math.round((prog.done.length / course.lessons.length) * 100);
}

/* ---------- UI helpers ---------- */
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add("hidden"), 2600);
}
function openModal(html) { $("#modalBox").innerHTML = html; $("#modal").classList.remove("hidden"); }
function closeModal() { $("#modal").classList.add("hidden"); }
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ---------- Navigation ---------- */
function renderNav() {
  const u = currentUser();
  $("#nav").innerHTML = u
    ? `<a href="#/">Courses</a><a href="#/dashboard">My learning</a>` +
      (u.role === "instructor" ? `<a href="#/teach">Add course</a>` : "") +
      `<span class="who">${esc(u.name)}</span><button class="btn small ghost" id="logout">Log out</button>`
    : `<a href="#/">Courses</a><button class="btn small" id="loginBtn">Log in / Sign up</button>`;
  const lo = $("#logout"); if (lo) lo.onclick = () => { sessionStorage.removeItem("el_session"); renderNav(); location.hash = "#/"; route(); toast("Logged out"); };
  const li = $("#loginBtn"); if (li) li.onclick = () => authModal();
}

/* ---------- Auth ---------- */
function authModal(mode = "login", after) {
  const isSignup = mode === "signup";
  openModal(`
    <h2>${isSignup ? "Create your account" : "Welcome back"}</h2>
    <form id="authForm">
      ${isSignup ? `<label>Full name<input name="name" required></label>` : ""}
      <label>Email<input type="email" name="email" required></label>
      <label>Password<input type="password" name="pass" minlength="4" required></label>
      ${isSignup ? `<label>I am a<select name="role"><option value="student">Student</option><option value="instructor">Instructor</option></select></label>` : ""}
      <p class="error" id="authErr"></p>
      <button class="btn" type="submit">${isSignup ? "Sign up" : "Log in"}</button>
    </form>
    <p class="switch">${isSignup ? "Already registered?" : "New here?"} <a href="#" id="swap">${isSignup ? "Log in" : "Create an account"}</a></p>
  `);
  $("#swap").onclick = (e) => { e.preventDefault(); authModal(isSignup ? "login" : "signup", after); };
  $("#authForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const email = f.email.trim().toLowerCase();
    const users = store.users();
    if (isSignup) {
      if (users[email]) return ($("#authErr").textContent = "That email is already registered. Log in instead.");
      users[email] = { name: f.name.trim(), email, pass: hash(f.pass), role: f.role };
      Cloud.set("users", users);
    } else if (!users[email] || users[email].pass !== hash(f.pass)) {
      return ($("#authErr").textContent = "Email or password is incorrect.");
    }
    sessionStorage.setItem("el_session", JSON.stringify({ email }));
    closeModal(); renderNav(); route();
    toast(isSignup ? "Account created" : "Logged in");
    if (after) after();
  };
}

/* ---------- Views ---------- */
function viewCatalog() {
  const u = currentUser();
  const courses = store.courses();
  $("#app").innerHTML = `
    <section class="hero">
      <h1>Learn web and cloud skills at your own pace.</h1>
      <p>Short lessons, quizzes and certificates. Your progress is saved to the cloud.</p>
      <input id="search" class="search" placeholder="Search courses…" aria-label="Search courses">
    </section>
    <section class="grid" id="grid"></section>`;
  const draw = (q = "") => {
    const list = courses.filter((c) => (c.title + c.summary + c.level).toLowerCase().includes(q.toLowerCase()));
    $("#grid").innerHTML = list.length ? list.map((c) => {
      const p = u ? percent(c, getProgress(u.email, c.id)) : 0;
      return `<a class="card" href="#/course/${esc(c.id)}">
        <div class="card-top" style="background:${esc(c.color)}"><span>${esc(c.level)}</span></div>
        <div class="card-body">
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.summary)}</p>
          <small>${esc(c.instructor)} · ${c.lessons.length} lessons</small>
          ${u ? `<div class="bar"><i style="width:${p}%"></i></div><small>${p}% complete</small>` : ""}
        </div></a>`;
    }).join("") : `<p class="empty">No courses match “${esc(q)}”. Try a different word.</p>`;
  };
  draw();
  $("#search").oninput = (e) => draw(e.target.value);
}

function viewCourse(id, lessonId) {
  const course = store.courses().find((c) => c.id === id);
  if (!course) { $("#app").innerHTML = `<p class="empty">Course not found. <a href="#/">Back to courses</a></p>`; return; }
  const u = currentUser();
  if (!u) {
    $("#app").innerHTML = `<section class="panel"><h2>${esc(course.title)}</h2><p>${esc(course.summary)}</p>
      <button class="btn" id="needLogin">Log in to start learning</button></section>`;
    $("#needLogin").onclick = () => authModal("login");
    return;
  }
  const prog = getProgress(u.email, id);
  const lesson = course.lessons.find((l) => l.id === lessonId) || course.lessons[0];
  const done = prog.done.includes(lesson.id);
  const p = percent(course, prog);
  const allDone = prog.done.length === course.lessons.length;
  const passed = prog.quiz && prog.quiz.score / prog.quiz.total >= 0.6;

  $("#app").innerHTML = `
    <div class="course-layout">
      <aside class="sidebar">
        <a href="#/" class="back">← All courses</a>
        <h2>${esc(course.title)}</h2>
        <div class="bar"><i style="width:${p}%"></i></div><small>${p}% complete</small>
        <ul class="lessons">
          ${course.lessons.map((l) => `<li class="${l.id === lesson.id ? "active" : ""}">
            <a href="#/course/${esc(id)}/${esc(l.id)}"><span class="tick">${prog.done.includes(l.id) ? "✔" : "○"}</span>${esc(l.title)}</a></li>`).join("")}
          <li><a href="#/course/${esc(id)}/quiz" class="${lessonId === "quiz" ? "active-link" : ""}"><span class="tick">${passed ? "✔" : "○"}</span>Final quiz</a></li>
        </ul>
        ${allDone && passed ? `<button class="btn" id="cert">Get certificate</button>` : ""}
      </aside>
      <section class="lesson" id="lessonBox"></section>
    </div>`;

  const box = $("#lessonBox");
  if (lessonId === "quiz") return renderQuiz(course, u, box);

  box.innerHTML = `
    <h1>${esc(lesson.title)}</h1>
    ${lesson.video ? `<div class="video"><iframe src="https://www.youtube.com/embed/${esc(lesson.video)}" title="${esc(lesson.title)}" allowfullscreen loading="lazy"></iframe></div>` : ""}
    <p class="body">${esc(lesson.body)}</p>
    <button class="btn ${done ? "ghost" : ""}" id="markDone">${done ? "Completed ✔ (click to undo)" : "Mark as complete"}</button>`;
  $("#markDone").onclick = () => {
    const d = new Set(prog.done);
    d.has(lesson.id) ? d.delete(lesson.id) : d.add(lesson.id);
    saveProgress(u.email, id, { ...prog, done: [...d] });
    viewCourse(id, lesson.id);
    toast(d.has(lesson.id) ? "Lesson completed" : "Marked as not complete");
  };
  const cert = $("#cert"); if (cert) cert.onclick = () => certificate(course, u);
}

function renderQuiz(course, u, box) {
  box.innerHTML = `<h1>Final quiz</h1><form id="quizForm">
    ${course.quiz.map((q, i) => `<fieldset><legend>${i + 1}. ${esc(q.q)}</legend>
      ${q.options.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}" required> ${esc(o)}</label>`).join("")}
    </fieldset>`).join("")}
    <button class="btn" type="submit">Submit answers</button></form><div id="result"></div>`;
  const prev = getProgress(u.email, course.id).quiz;
  if (prev) $("#result").innerHTML = `<p class="result">Your last score: <strong>${prev.score}/${prev.total}</strong></p>`;
  $("#quizForm").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    let score = 0;
    course.quiz.forEach((q, i) => { if (Number(f.get("q" + i)) === q.answer) score++; });
    const prog = getProgress(u.email, course.id);
    saveProgress(u.email, course.id, { ...prog, quiz: { score, total: course.quiz.length } });
    const ok = score / course.quiz.length >= 0.6;
    $("#result").innerHTML = `<p class="result ${ok ? "pass" : "fail"}">You scored ${score}/${course.quiz.length}. ${ok ? "Passed! Finish all lessons to unlock your certificate." : "You need at least 60%. Review the lessons and try again."}</p>`;
    renderNavOnly();
  };
}
function renderNavOnly() { /* sidebar refresh after quiz */ setTimeout(() => { const m = location.hash.match(/^#\/course\/([^/]+)\/?(.*)$/); if (m) viewCourse(m[1], m[2]); }, 1200); }

function certificate(course, u) {
  openModal(`<div class="cert" id="certBox">
    <h2>Certificate of Completion</h2>
    <p>This certifies that</p><h1>${esc(u.name)}</h1>
    <p>has successfully completed</p><h3>${esc(course.title)}</h3>
    <p>${new Date().toLocaleDateString()}</p></div>
    <div class="row"><button class="btn" onclick="window.print()">Print / Save as PDF</button>
    <button class="btn ghost" onclick="closeModal()">Close</button></div>`);
}

function viewDashboard() {
  const u = currentUser();
  if (!u) { $("#app").innerHTML = `<section class="panel"><h2>My learning</h2><p>Log in to see your progress.</p><button class="btn" id="l">Log in</button></section>`; $("#l").onclick = () => authModal(); return; }
  const rows = store.courses().map((c) => ({ c, p: getProgress(u.email, c.id) })).filter((r) => r.p.done.length || r.p.quiz);
  const completed = rows.filter((r) => r.p.done.length === r.c.lessons.length).length;
  $("#app").innerHTML = `
    <section class="panel"><h2>Hi ${esc(u.name)}</h2>
      <div class="stats"><div><b>${rows.length}</b><span>Courses started</span></div>
      <div><b>${completed}</b><span>Courses completed</span></div>
      <div><b>${rows.reduce((a, r) => a + r.p.done.length, 0)}</b><span>Lessons finished</span></div></div></section>
    <section class="panel"><h3>Your courses</h3>
      ${rows.length ? rows.map((r) => `<a class="row-link" href="#/course/${esc(r.c.id)}">
        <strong>${esc(r.c.title)}</strong>
        <div class="bar"><i style="width:${percent(r.c, r.p)}%"></i></div>
        <small>${percent(r.c, r.p)}% complete${r.p.quiz ? ` · quiz ${r.p.quiz.score}/${r.p.quiz.total}` : ""}</small></a>`).join("")
        : `<p class="empty">You haven’t started a course yet. <a href="#/">Browse courses</a></p>`}
    </section>`;
}

function viewTeach() {
  const u = currentUser();
  if (!u || u.role !== "instructor") { $("#app").innerHTML = `<section class="panel"><h2>Instructors only</h2><p>Sign up with the Instructor role to add courses.</p></section>`; return; }
  $("#app").innerHTML = `<section class="panel"><h2>Add a new course</h2>
    <form id="teachForm">
      <label>Title<input name="title" required></label>
      <label>Summary<textarea name="summary" rows="2" required></textarea></label>
      <label>Level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
      <label>Lesson 1 title<input name="t1" required></label>
      <label>Lesson 1 text<textarea name="b1" rows="3" required></textarea></label>
      <label>YouTube video ID for lesson 1 (optional)<input name="v1" placeholder="e.g. UB1O30fR-EE"></label>
      <label>Quiz question<input name="qq" required></label>
      <label>Option A<input name="o0" required></label><label>Option B<input name="o1" required></label>
      <label>Option C<input name="o2" required></label><label>Correct option<select name="ans"><option value="0">A</option><option value="1">B</option><option value="2">C</option></select></label>
      <button class="btn" type="submit">Publish course</button></form></section>`;
  $("#teachForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const colors = ["#0E7C7B", "#F2B632", "#7A5CFA", "#E4572E", "#2D9CDB"];
    const course = {
      id: "c" + Date.now(), title: f.title, summary: f.summary, level: f.level, instructor: u.name,
      color: colors[Math.floor(Math.random() * colors.length)],
      lessons: [{ id: "l1", title: f.t1, body: f.b1, video: f.v1.trim() || undefined }],
      quiz: [{ q: f.qq, options: [f.o0, f.o1, f.o2], answer: Number(f.ans) }]
    };
    const list = store.courses(); list.push(course); Cloud.set("courses", list);
    toast("Course published"); location.hash = "#/";
  };
}

/* ---------- Router ---------- */
function route() {
  const [, page, a, b] = location.hash.split("/");
  closeModal();
  if (page === "course") viewCourse(a, b);
  else if (page === "dashboard") viewDashboard();
  else if (page === "teach") viewTeach();
  else viewCatalog();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

(async function start() {
  await Cloud.init();
  $("#mode").textContent = Cloud.mode;
  store.courses(); // seed on first run
  renderNav();
  route();
})();
