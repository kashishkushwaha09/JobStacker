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

  } catch (err) {
    console.error("Error loading profile", err);
  }
}

loadProfile();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login/login.html";
});



document.addEventListener('DOMContentLoaded', async () => {

  try {
    const res = await axios.get('/api/application', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const applications = res.data.applications;
    const container = document.getElementById('applicationsList');

    if (!applications.length) {
      container.innerHTML = `<p class="text-muted">You haven’t applied for any jobs yet.</p>`;
      return;
    }

    applications.forEach(app => {
      const job = app.job;
      const div = document.createElement('div');
      div.className = 'col-md-6';

      div.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text"><strong>Location:</strong> ${job.location}</p>
            <p class="card-text"><strong>Status:</strong> ${app.status}</p>
            <p class="card-text"><strong>Applied on:</strong> ${new Date(app.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert('Failed to load applications.');
  }
});
