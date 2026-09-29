// ---------- Data (edit these to update the portal) ----------
const events = [
  {
    id: 1,
    name: "Code Sprint",
    cat: "Technical",
    date: "12 Nov 2026",
    time: "10:00 AM",
    venue: "Lab 3",
    desc: "A 3-hour competitive coding contest.",
  },
  {
    id: 2,
    name: "Hack the Campus",
    cat: "Technical",
    date: "13 Nov 2026",
    time: "9:00 AM",
    venue: "Seminar Hall",
    desc: "24-hour team hackathon on campus problems.",
  },
  {
    id: 3,
    name: "Battle of Bands",
    cat: "Cultural",
    date: "12 Nov 2026",
    time: "5:00 PM",
    venue: "Open Air Theatre",
    desc: "Live music competition for college bands.",
  },
  {
    id: 4,
    name: "Dance Fiesta",
    cat: "Cultural",
    date: "13 Nov 2026",
    time: "4:00 PM",
    venue: "Main Auditorium",
    desc: "Solo and group dance performances.",
  },
  {
    id: 5,
    name: "Football Cup",
    cat: "Sports",
    date: "14 Nov 2026",
    time: "8:00 AM",
    venue: "Main Ground",
    desc: "Inter-department 7-a-side football.",
  },
  {
    id: 6,
    name: "Chess Masters",
    cat: "Sports",
    date: "14 Nov 2026",
    time: "11:00 AM",
    venue: "Library Hall",
    desc: "Swiss-system chess tournament.",
  },
];
const announcements = [
  "Registrations close on 10 November.",
  "Hackathon teams can have up to 4 members.",
  "Bring your college ID card to every event.",
];

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

// ---------- Mobile menu ----------
$("menuBtn").addEventListener("click", () => {
  const open = $("nav").classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", open);
});
$("nav").addEventListener("click", () => $("nav").classList.remove("open"));

// ---------- Announcements ----------
function renderAnnouncements() {
  $("announceList").innerHTML = announcements
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join("");
}
$("announceBtn").addEventListener("click", () => {
  const text = $("announceInput").value.trim();
  if (!text) return;
  announcements.unshift(text);
  $("announceInput").value = "";
  renderAnnouncements();
});
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// ---------- Events ----------
function renderEvents(cat = "all") {
  const list = cat === "all" ? events : events.filter((e) => e.cat === cat);
  $("eventGrid").innerHTML = list
    .map(
      (e) => `
    <article class="card">
      <span class="tag">${e.cat}</span>
      <h3>${e.name}</h3>
      <div class="meta">${e.date} · ${e.time} · ${e.venue}</div>
      <p>${e.desc}</p>
      <button class="btn" data-id="${e.id}">Register</button>
    </article>`,
    )
    .join("");
}
$("filters").addEventListener("click", (ev) => {
  const chip = ev.target.closest(".chip");
  if (!chip) return;
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  renderEvents(chip.dataset.cat);
});
$("eventGrid").addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-id]");
  if (!btn) return;
  const ev1 = events.find((e) => e.id == btn.dataset.id);
  $("eventSelect").value = ev1.name;
  $("register").scrollIntoView({ behavior: "smooth" });
  $("name").focus({ preventScroll: true });
});

// ---------- Schedule ----------
function renderSchedule() {
  $("scheduleBody").innerHTML = events
    .map(
      (e) =>
        `<tr><td>${e.date}</td><td>${e.time}</td><td>${e.name}</td><td>${e.venue}</td></tr>`,
    )
    .join("");
}

// ---------- Registration form ----------
events.forEach((e) =>
  $("eventSelect").insertAdjacentHTML(
    "beforeend",
    `<option>${e.name}</option>`,
  ),
);

function setError(field, msg) {
  $("e-" + field).textContent = msg;
  const input = $(field === "event" ? "eventSelect" : field);
  input.classList.toggle("bad", !!msg);
  return !msg;
}
$("regForm").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const v = {
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    mobile: $("mobile").value.trim(),
    dept: $("dept").value,
    year: $("year").value,
    event: $("eventSelect").value,
  };
  const results = [
    setError(
      "name",
      v.name.length < 3 ? "Enter your full name (at least 3 characters)." : "",
    ),
    setError(
      "email",
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)
        ? "Enter a valid email address."
        : "",
    ),
    setError(
      "mobile",
      !/^[6-9]\d{9}$/.test(v.mobile) ? "Enter a 10-digit mobile number." : "",
    ),
    setError("dept", !v.dept ? "Select your department." : ""),
    setError("year", !v.year ? "Select your year." : ""),
    setError("event", !v.event ? "Select an event." : ""),
  ];
  if (results.includes(false)) {
    $("success").hidden = true;
    return;
  }
  $("success").hidden = false;
  $("success").textContent =
    `Thank you, ${v.name}! You are registered for ${v.event}. A confirmation will be sent to ${v.email}.`;
  ev.target.reset();
});

// ---------- Contact form ----------
$("contactForm").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const ok =
    $("cName").value.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("cEmail").value.trim()) &&
    $("cMsg").value.trim();
  $("e-contact").textContent = ok
    ? ""
    : "Fill in your name, a valid email and a message.";
  $("contactOk").hidden = !ok;
  if (ok) ev.target.reset();
});

// ---------- Init ----------
renderAnnouncements();
renderEvents();
renderSchedule();
