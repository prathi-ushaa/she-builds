// Departments and doctors (edit freely)
const doctors = {
  Cardiology: ["Dr. Meera Nair", "Dr. Arjun Rao"],
  Dermatology: ["Dr. Kavya Iyer"],
  Neurology: ["Dr. Sanjay Menon", "Dr. Priya Das"],
  Orthopedics: ["Dr. Rahul Verma"],
  Pediatrics: ["Dr. Anita Joseph", "Dr. Farhan Ali"],
  "General Medicine": ["Dr. Lakshmi Pillai"]
};
const $ = (id) => document.getElementById(id);
const appointments = [
  { id: "APT-1001", name: "Ravi Kumar", blood: "O+", dept: "Cardiology", doctor: "Dr. Meera Nair", date: "2026-10-05", time: "10:30", symptoms: "Chest discomfort while climbing stairs.", status: "Confirmed" },
  { id: "APT-1002", name: "Sneha Reddy", blood: "B+", dept: "Dermatology", doctor: "Dr. Kavya Iyer", date: "2026-10-06", time: "14:00", symptoms: "Persistent skin rash for two weeks.", status: "Pending" }
];
let counter = 1003;

Object.keys(doctors).forEach((d) => $("dept").add(new Option(d, d)));
$("date").min = new Date().toISOString().split("T")[0];
$("dob").max = new Date().toISOString().split("T")[0];

$("dept").addEventListener("change", () => {
  const list = doctors[$("dept").value] || [];
  $("doctor").innerHTML = '<option value="">Select doctor</option>';
  list.forEach((n) => $("doctor").add(new Option(n, n)));
  $("doctor").disabled = list.length === 0;
});

const badge = { Pending: "warning text-dark", Confirmed: "success", Completed: "secondary", Cancelled: "danger" };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtTime = (t) => { const [h, m] = t.split(":"); return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`; };

function render() {
  $("apptBody").innerHTML = appointments.map((a) => `<tr><td>${a.id}</td><td>${esc(a.name)}</td><td>${a.dept}</td><td>${a.doctor}</td><td>${a.date}</td><td>${fmtTime(a.time)}</td><td><span class="badge text-bg-${badge[a.status]}">${a.status}</span></td></tr>`).join("");
  $("healthCards").innerHTML = appointments.map((a) => `
    <div class="col-md-6 col-lg-4"><div class="card h-100 shadow-sm health-card"><div class="card-body"><dl class="mb-0">
      <dt>Patient name</dt><dd>${esc(a.name)}</dd>
      <dt>Blood group</dt><dd>${a.blood}</dd>
      <dt>Department</dt><dd>${a.dept}</dd>
      <dt>Doctor</dt><dd>${a.doctor}</dd>
      <dt>Appointment</dt><dd>${a.date}, ${fmtTime(a.time)}</dd>
      <dt>Symptoms</dt><dd>${esc(a.symptoms)}</dd>
      <dt>Status</dt><dd><span class="badge text-bg-${badge[a.status]}">${a.status}</span></dd>
    </dl></div></div></div>`).join("");
}

$("patientForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
  appointments.push({
    id: "APT-" + counter++, name: $("pname").value.trim(), blood: $("blood").value,
    dept: $("dept").value, doctor: $("doctor").value, date: $("date").value, time: $("time").value,
    symptoms: $("symptoms").value.trim(), status: "Pending"
  });
  render();
  $("msg").innerHTML = '<div class="alert alert-success alert-dismissible fade show">Registered! Your appointment is pending confirmation.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  form.reset(); form.classList.remove("was-validated"); $("doctor").disabled = true;
  $("doctor").innerHTML = '<option value="">Select department first</option>';
});
$("resetBtn").addEventListener("click", () => {
  $("patientForm").classList.remove("was-validated");
  $("doctor").disabled = true;
  $("doctor").innerHTML = '<option value="">Select department first</option>';
});
render();
