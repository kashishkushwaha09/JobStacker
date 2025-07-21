const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html"; 
}
const profileInfo = document.getElementById("profileInfo");
const nameSpan = document.getElementById("applicantName");

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

    profileInfo.innerHTML = `
      <h5>Headline: ${profile.headline || "N/A"}</h5>
      <p>Location: ${profile.location || "N/A"}</p>
      <p>About: ${profile.about || "N/A"}</p>
    `;
  } catch (err) {
    console.error("Error loading profile", err);
    profileInfo.innerHTML = `<p class="text-danger">Failed to load profile.</p>`;
  }
}

loadProfile();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login/login.html";
});