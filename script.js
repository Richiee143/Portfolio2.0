/* ==========================================================
   script.js - the BEHAVIOR of the website
   Parts of this file:
     1. PROJECTS list (EDIT HERE to add your projects)
     2. Intro screen
     3. Theme (light / dark) toggle
     4. Mobile menu + active link highlight
     5. Typing terminal in the Home section
     6. Build the project cards
     7. Contact form (demo only)
     8. Fade-in on scroll
   ========================================================== */


/* ---------- 1. PROJECTS ----------
   To add a project, copy one { ... } block, paste it after the last one
   (don't forget the comma), then change the text.
     title : the project name
     description : one or two sentences
     tech : technologies you used
     link : a web address (GitHub, hosted site...). Use "#" if you don't have one yet. */
const projects = [
  {
    title: "Compliance Violation Monitoring System",
    description:
      "A proposed software system designed to help organizations record, monitor, manage, and track compliance violations.",
    tech: ["Proposed", "Database", "Web App"],
    link: "#",
  },
  {
    title: "Programmer Profile",
    description:
      "A personal programmer portfolio created as part of a Software Development project.",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "#",
  },
];


/* ---------- Small helper: show a pop-up message ---------- */
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- 2. INTRO SCREEN ---------- */
const intro = document.getElementById("intro");
const introText = document.getElementById("introText");
const loaderBar = document.getElementById("loaderBar");
const INTRO_MS = 2800; // how long the intro lasts (2800 = 2.8 seconds)

// Types a message one letter at a time
function typeText(element, text, speed, done) {
  let i = 0;
  const timer = setInterval(() => {
    element.textContent = text.slice(0, ++i);
    if (i >= text.length) {
      clearInterval(timer);
      if (done) done();
    }
  }, speed);
}

// Floating blue particles behind the hoodie
function startParticles() {
  const canvas = document.getElementById("introParticles");
  const ctx = canvas.getContext("2d");
  let dots = [];
  let running = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.5 + 0.15,
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(86, 182, 255, 0.7)";
    dots.forEach((d) => {
      d.y -= d.speed;
      if (d.y < -5) { d.y = canvas.height + 5; d.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  return () => { running = false; window.removeEventListener("resize", resize); };
}

let introFinished = false;
let stopParticles = () => {};

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  intro.classList.add("hide");              // fade + zoom out (see CSS)
  document.body.classList.remove("is-loading");
  setTimeout(() => { stopParticles(); intro.remove(); }, 1000);
  startTerminal();                          // start typing in the Home section
}

if (reduceMotion) {
  // Skip the animation for people who asked for less motion
  introText.textContent = "Initializing Profile...";
  finishIntro();
} else {
  stopParticles = startParticles();
  typeText(introText, "Initializing Profile...", 70);
  // progress bar fills over INTRO_MS
  loaderBar.style.transition = `width ${INTRO_MS}ms linear`;
  requestAnimationFrame(() => (loaderBar.style.width = "100%"));
  setTimeout(finishIntro, INTRO_MS);
}
document.getElementById("skipIntro").addEventListener("click", finishIntro);


/* ---------- 3. THEME TOGGLE ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

// Remember the choice between visits (wrapped in try in case storage is blocked)
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) { /* ignore */ }

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
});


/* ---------- 4. MOBILE MENU + ACTIVE LINK ---------- */
const menuBtn = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
// close the menu after choosing a link
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
  })
);

// Highlight the link of the section you are viewing
const sections = document.querySelectorAll("main section[id]");
const linkFor = (id) => navLinks.querySelector(`a[href="#${id}"]`);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
        const link = linkFor(entry.target.id);
        if (link) link.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));


/* ---------- 5. TYPING TERMINAL (Home section) ---------- */
// EDIT: change these lines to change what the terminal shows.
// <span class="..."> adds color (see .t-... classes in style.css).
const terminalLines = [
  '<span class="t-prompt">&gt;_</span> whoami',
  '<span class="t-str">richard_licupa</span>',
  '',
  '<span class="t-prompt">&gt;_</span> cat profile.json',
  '{',
  '  <span class="t-key">"role"</span>: <span class="t-str">"BSIT Student"</span>,',
  '  <span class="t-key">"school"</span>: <span class="t-str">"NVSU"</span>,',
  '  <span class="t-key">"status"</span>: <span class="t-str">"always learning"</span>,',
  '  <span class="t-key">"interests"</span>: [<span class="t-str">"coding"</span>, <span class="t-str">"software"</span>, <span class="t-str">"networks"</span>]',
  '}',
  '',
  '<span class="t-com">// next: build something useful</span>',
];

function startTerminal() {
  const body = document.getElementById("terminalBody");
  const cursor = '<span class="t-cursor"></span>';

  if (reduceMotion) {
    body.innerHTML = terminalLines.join("\n") + "\n" + cursor;
    return;
  }

  // Show one line at a time
  let shown = 0;
  const timer = setInterval(() => {
    shown++;
    body.innerHTML = terminalLines.slice(0, shown).join("\n") + "\n" + cursor;
    if (shown >= terminalLines.length) clearInterval(timer);
  }, 330);
}


/* ---------- 6. BUILD THE PROJECT CARDS ---------- */
const grid = document.getElementById("projectsGrid");

// Make text safe before putting it into HTML
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

projects.forEach((p) => {
  const card = document.createElement("article");
  card.className = "card project";
  card.innerHTML = `
    <h3>${escapeHTML(p.title)}</h3>
    <p>${escapeHTML(p.description)}</p>
    <div class="tech">${p.tech.map((t) => `<span>${escapeHTML(t)}</span>`).join("")}</div>
    <a class="btn small" href="${escapeHTML(p.link)}" target="_blank" rel="noopener">View Project</a>
  `;
  // If there is no link yet, don't jump to the top of the page
  if (p.link === "#") {
    card.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
      showToast("No link yet. Add one in script.js.");
    });
  }
  grid.appendChild(card);
});


/* ---------- 7. CONTACT FORM (demo only) ---------- */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading

  const nameField = document.getElementById("cName");
  const emailField = document.getElementById("cEmail");
  const messageField = document.getElementById("cMsg");
  const fields = [nameField, emailField, messageField];
  fields.forEach((f) => f.classList.remove("invalid"));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
  const missing = fields.filter((f) => !f.value.trim());
  if (missing.length || !emailOk) {
    (missing[0] || emailField).classList.add("invalid");
    if (!emailOk && !missing.includes(emailField)) emailField.classList.add("invalid");
    formStatus.className = "form-status error";
    formStatus.textContent = missing.length
      ? "Please fill in your name, email, and message."
      : "Please enter a valid email address.";
    return;
  }

  // No backend yet, so nothing is sent. We say so honestly.
  formStatus.className = "form-status ok";
  formStatus.textContent = "Form looks good, but this is a demo. Your message was not sent.";
  form.reset();
});


/* ---------- 8. FADE-IN ON SCROLL ---------- */
const revealItems = document.querySelectorAll(".card, .section-sub");
revealItems.forEach((el) => el.classList.add("reveal"));
const revealer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealItems.forEach((el) => revealer.observe(el));


/* ---------- Profile picture: show the photo if it exists ---------- */
const avatarImg = document.getElementById("avatarImg");
const avatarBox = avatarImg.parentElement;
function markPhoto() { avatarBox.classList.add("has-photo"); }
avatarImg.addEventListener("error", () => avatarImg.remove()); // no photo -> keep the >_ logo
avatarImg.addEventListener("load", markPhoto);
if (avatarImg.complete && avatarImg.naturalWidth > 0) markPhoto();
