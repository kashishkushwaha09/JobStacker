const form = document.getElementById("registerForm");
const msg = document.getElementById("message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
 const btn = document.getElementById("registerBtn");
  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Registering...
  `;
  try {
    const response = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
      role
    });
    const { token, role:userRole} = response.data;
      localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    showToast("Registered successfully!", "success");
    // setTimeout(() => {
    //   if (role === "applicant") {
    //    setTimeout(() => window.location.href = "/applicant-dashboard/dashboard.html", 2000);
    // } else if (role === "recruiter") {
    //    setTimeout(() => window.location.href = "/recruiter-dashboard/dashboard.html", 2000);
    // } else {
       setTimeout(() => window.location.href = "/", 2000);

    // }
    // }, 2000);
    form.reset();
  } catch (err) {
     btn.disabled = false;
    btn.innerHTML = "Register";
    console.error(err);
     showToast("Registration failed", "danger");
  }

});


function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
