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
// my jobs
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("jobsContainer");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in");
        return;
    }

    try {
        const res = await axios.get("/api/job/postedByRecruiter", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const jobs = res.data.jobs;
        console.log(jobs);
        if (jobs.length === 0) {
            container.innerHTML = "<p>No jobs posted yet.</p>";
            return;
        }

        jobs.forEach((job) => {
            const jobCard = document.createElement("div");
            jobCard.className = "col";
            jobCard.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${job.title}</h5>
              <p class="card-text">
                <strong>Location:</strong> ${job.location}<br/>
                <strong>Posted On:</strong> ${new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p>Status: <strong>${job.isActive ? 'Active' : 'Inactive'}</strong></p>
              <button class="btn btn-sm btn-outline-primary toggle-status-btn" onclick="toggleJobStatus('${job._id}')">
  Toggle Status
</button>
              <button class="btn btn-primary btn-sm me-2" onclick="editJob('${job._id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteJob('${job._id}')">Delete</button>
              <a href="/recruiter-applications/recruiter-applications.html?jobId=${job._id}" class="btn btn-outline-secondary btn-sm fw-medium">View Applications</a>
              
            </div>
          </div>
        `;
            container.appendChild(jobCard);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to load jobs.");
    }
});
async function toggleJobStatus(jobId) {
  try {
   
    const res = await axios.patch(`/api/job/${jobId}/status`, {},{
         headers: {
                Authorization: `Bearer ${token}`,
            },
    });
    alert("Job status updated!");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
}

async function deleteJob(jobId) {
    if (!confirm("Are you sure you want to delete this job?")) return;

    const token = localStorage.getItem("token");

    try {
        await axios.delete(`/api/job/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        alert("Job deleted successfully.");
        location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete job.");
    }
}

function editJob(jobId) {
    window.location.href = `/create-job/create-job.html?id=${jobId}`;
}