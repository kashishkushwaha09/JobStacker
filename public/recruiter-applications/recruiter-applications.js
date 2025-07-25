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
    nameSpan.innerText = profile.name || "Recruiter";

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
  const token = localStorage.getItem('token');
  const jobId = new URLSearchParams(window.location.search).get('jobId');
  const container = document.getElementById('applicationsContainer');

  if (!jobId) {
    container.innerHTML = "<p class='text-danger'>Invalid job ID.</p>";
    return;
  }

  try {
    const res = await axios.get(`/api/application/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const applications = res.data.applications;
   console.log(applications);
    if (!applications.length) {
      container.innerHTML = "<p class='text-muted'>No one has applied yet.</p>";
      return;
    }

    applications.forEach(app => {
      const div = document.createElement('div');
      div.className = 'col-md-6';

      div.innerHTML = `
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="mb-2">${app.applicant.name}</h5>
      <p class="mb-1">Headline: ${app.applicant.headline}</p>
      <p class="mb-1">Location: ${app.applicant.location}</p>
      <p class="mb-1">Email: ${app.applicant.userId.email}</p>
      <p class="mb-1">Matched Skills: ${app.matchedSkills.join(', ')}</p>
      <p class="mb-1">Missing Skills: ${app.missingSkills.join(', ')}</p>
      <p class="mb-1">Matched Score: ${app.matchScore} %</p>
      ${app.applicant.resumeUrl ? `<a class="mb-1 d-block" href="${app.applicant.resumeUrl}">📄 View Resume</a>` : ''}
      <p class="mb-2">Status: <strong>${app.status}</strong></p>

      <select class="form-select status-select" data-id="${app._id}">
        <option value="">Update Status</option>
        <option value="accepted">Accept</option>
        <option value="rejected">Reject</option>
        <option value="pending">Mark Pending</option>
      </select>
    </div>
  </div>
`;


      container.appendChild(div);
    });

    // Handle status change
    container.addEventListener('change', async (e) => {
      if (e.target.classList.contains('status-select')) {
        const newStatus = e.target.value;
        const appId = e.target.getAttribute('data-id');

        if (!newStatus) return;

        try {
          await axios.patch(`/api/application/${appId}/status`, {
            status: newStatus
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          alert(`Status updated to ${newStatus}`);
          window.location.reload();
        } catch (err) {
          alert('Failed to update status');
          console.error(err);
        }
      }
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-danger'>Failed to load applications.</p>";
  }
});
