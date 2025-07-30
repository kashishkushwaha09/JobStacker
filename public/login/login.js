const form = document.getElementById("loginForm");
const msg = document.getElementById("message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  // loginbtn
  const btn = document.getElementById("loginbtn");
  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Login...
  `;
  try {
    const response = await axios.post("/api/auth/signIn", {
      email,
      password
    });
    const { token, role } = response.data;
      localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    console.log(response.data);
    showToast("Login successfully!", "success"); 
    form.reset();
    
    // if (role === "applicant") {
    //    setTimeout(() => window.location.href = "/applicant-dashboard/dashboard.html", 2000);
    // } else if (role === "recruiter") {
    //    setTimeout(() => window.location.href = "/recruiter-dashboard/dashboard.html", 2000);
    // } else {
       setTimeout(() => window.location.href = "/", 2000);

    // }
  } catch (err) {
     btn.disabled = false;
    btn.innerHTML = "Login";
    console.error(err);
    showToast("Something went wrong", "danger");
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
