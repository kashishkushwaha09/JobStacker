const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login/login.html"; 
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
    console.log(applications);
    if (!applications.length) {
      container.innerHTML = `<p class="text-muted">You haven’t applied for any jobs yet.</p>`;
      return;
    }

    applications.forEach(app => {
      const job = app.job;
     console.log(job)
      if (!job) return; 
      const div = document.createElement('div');
      div.className = 'col-md-6';

      div.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text mb-0"><strong>Location:</strong> ${job.location}</p>
            <p class="card-text mb-0"><strong>MatchedSkills:</strong> ${app.matchedSkills.join(', ')}</p>
            <p class="card-text mb-0"><strong>MissingSkills:</strong> ${app.missingSkills.join(', ')}</p>
            <p class="card-text mb-0"><strong>MatchedScore:</strong> ${app.matchScore} %</p>
            <p class="card-text mb-0"><strong>Status:</strong> ${app.status}</p>
            <p class="card-text mb-2"><strong>Applied on:</strong> ${new Date(app.createdAt).toLocaleDateString()}</p>
            <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('${job._id}')">View Details</button>
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
function viewDetails(jobId) {
  window.location.href = `/job-details/job-details.html?id=${jobId}`;
}

function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
