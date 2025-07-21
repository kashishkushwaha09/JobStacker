const form = document.getElementById("loginForm");
const msg = document.getElementById("message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await axios.post("/api/auth/signIn", {
      email,
      password
    });
    const { token, role } = response.data;
      localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    console.log(response.data);
    msg.innerHTML = `<span class="text-success">Login Successfully!</span>`;
    form.reset();
    
    if (role === "applicant") {
      window.location.href = "/applicant-dashboard/dashboard.html";
    } else if (role === "recruiter") {
      window.location.href = "/recruiter-dashboard/dashboard.html";
    } else {
      window.location.href = "/"; // fallback
    }
  } catch (err) {
    console.error(err);
    msg.innerHTML = `<span class="text-danger">${err?.response?.data?.message || "Something went wrong"}</span>`;
  }
});