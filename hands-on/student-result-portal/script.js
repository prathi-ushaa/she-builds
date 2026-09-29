const subjects = ["Maths", "Physics", "Programming", "Electronics", "English"];
const PASS_MARK = 40; // minimum marks needed in each subject
const students = [];

const $ = (id) => document.getElementById(id);
const markInputs = [...document.querySelectorAll(".mark")];

function flag(input, valid) {
  input.classList.toggle("is-invalid", !valid);
  input.classList.toggle("is-valid", valid);
  return valid;
}

function validate() {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value.trim());
  const checks = [
    flag($("name"), /^[A-Za-z .]{3,}$/.test($("name").value.trim())),
    flag($("roll"), $("roll").value.trim().length > 0),
    flag($("email"), emailOk),
    flag($("phone"), /^[6-9]\d{9}$/.test($("phone").value.trim())),
    flag($("course"), $("course").value !== ""),
  ];
  markInputs.forEach((m) => {
    const n = Number(m.value);
    checks.push(flag(m, m.value !== "" && n >= 0 && n <= 100));
  });
  return checks.every(Boolean);
}

function showAlert(msg, type) {
  $("alertBox").innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${msg}
     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}

$("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) {
    showAlert("Please fix the highlighted fields and try again.", "danger");
    return;
  }
  const marks = markInputs.map((m) => Number(m.value));
  const total = marks.reduce((a, b) => a + b, 0);
  const percent = total / subjects.length;
  const passed = marks.every((m) => m >= PASS_MARK);

  const s = {
    name: $("name").value.trim(),
    roll: $("roll").value.trim(),
    email: $("email").value.trim(),
    course: $("course").value,
    marks,
    total,
    percent,
    passed,
  };

  if (students.some((x) => x.roll === s.roll)) {
    showAlert(`Roll number ${s.roll} is already registered.`, "warning");
    return;
  }
  students.push(s);
  showResult(s);
  addRow(s);
  showAlert(
    `${s.name} registered. Result: ${passed ? "Pass" : "Fail"}.`,
    passed ? "success" : "danger",
  );
});

function showResult(s) {
  $("resultCard").hidden = false;
  $("rName").textContent = s.name;
  $("rRoll").textContent = s.roll;
  $("rMeta").textContent = `${s.course} · ${s.email}`;
  $("marksBody").innerHTML = s.marks
    .map((m, i) => {
      const ok = m >= PASS_MARK;
      return `<tr><td>${subjects[i]}</td><td>${m}</td>
      <td><span class="badge ${ok ? "text-bg-success" : "text-bg-danger"}">${ok ? "Pass" : "Fail"}</span></td></tr>`;
    })
    .join("");
  $("rTotal").textContent = `${s.total} / ${subjects.length * 100}`;
  $("rPercent").textContent = s.percent.toFixed(2) + "%";
  $("rStatus").textContent = s.passed ? "PASS" : "FAIL";
  $("rStatus").className =
    "fs-5 fw-bold " + (s.passed ? "pass-badge" : "fail-badge");
}

function addRow(s) {
  const empty = $("emptyRow");
  if (empty) empty.remove();
  const tr = document.createElement("tr");
  const cells = [s.roll, s.name, s.course, s.percent.toFixed(2)];
  cells.forEach((c) => {
    const td = document.createElement("td");
    td.textContent = c;
    tr.appendChild(td);
  });
  const td = document.createElement("td");
  td.innerHTML = `<span class="badge ${s.passed ? "text-bg-success" : "text-bg-danger"}">${s.passed ? "Pass" : "Fail"}</span>`;
  tr.appendChild(td);
  $("studentsBody").appendChild(tr);
}

$("resetBtn").addEventListener("click", () => {
  $("studentForm").reset();
  document
    .querySelectorAll(".is-valid,.is-invalid")
    .forEach((el) => el.classList.remove("is-valid", "is-invalid"));
  $("alertBox").innerHTML = "";
});
