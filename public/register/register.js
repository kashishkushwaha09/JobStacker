const form = document.getElementById("registerForm");
const msg = document.getElementById("message");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  try {
    const response = await axios.post("/api/auth/signup", {
      name,
      email,
      password,
      role
    });
    const { token, role } = response.data;
      localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    msg.innerHTML = `<span class="text-success">Registered Successfully!</span>`;
    form.reset();
  } catch (err) {
    console.error(err);
    msg.innerHTML = `<span class="text-danger">${err?.response?.data?.message || "Something went wrong"}</span>`;
  }
});