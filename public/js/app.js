 const userRole = localStorage.getItem("role");
 const token=localStorage.getItem("token");
 const welcomeText = document.getElementById("welcomeText");
  const buttonContainer = document.getElementById("dashboardButtonContainer");
  const profileInfo = document.getElementById("profileInfo");
  const profileLinkItem = document.getElementById("profileLinkItem");
const nameSpan = document.getElementById("userName");
  if(userRole){
    document.getElementById("register").style.display = "none";
  document.getElementById("login").style.display = "none";
 profileInfo.classList.remove('d-none');
  }

  if (userRole === "admin") {
    welcomeText.textContent = "Welcome Admin";
    buttonContainer.innerHTML = `<a href="/admin/dashboard.html" class="btn btn-primary">Go to Admin Dashboard</a>`;
    profileLinkItem.style.display="none";
    const hr=document.querySelector('.dropdown-divider');
    hr.classList.add('d-none')
    console.log(hr);
  } else if (userRole === "recruiter") {
    welcomeText.textContent = "Welcome Recruiter";
    buttonContainer.innerHTML = `<a href="/recruiter-dashboard/dashboard.html" class="btn btn-success">Go to Recruiter Dashboard</a>`;
    profileLinkItem.innerHTML = `<a class="dropdown-item" href="/recruiter-profile/profile.html">View Profile</a>`;
  } else if (userRole === "applicant") {
    welcomeText.textContent = "Welcome Applicant";
    buttonContainer.innerHTML = `<a href="/applicant-dashboard/dashboard.html" class="btn btn-warning">Go to Applicant Dashboard</a>`;
    profileLinkItem.innerHTML = `<a class="dropdown-item" href="/applicant-profile/profile.html">View Profile</a>`;
  } else {
    welcomeText.textContent = "Welcome Guest";
    buttonContainer.innerHTML = `<a href="/login/login.html" class="btn btn-outline-secondary">Login to Continue</a>`;
  }

  if (token && userRole!=='admin') {
  loadProfile();
}


async function loadProfile() {
  try {
    const res = await axios.get("/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const profile = res.data.profile;
    console.log(profile);

    nameSpan.innerText = profile.name || "Applicant";

  } catch (err) {
    console.error("Error loading profile", err);
  }
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

   document.getElementById("register").style.display = "block";
  document.getElementById("login").style.display = "block";
  welcomeText.textContent = "Welcome Guset";
    buttonContainer.innerHTML = ``;
    profileInfo.classList.add('d-none');
    location.reload();
});
