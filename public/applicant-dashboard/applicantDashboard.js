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

/// jobs 
const jobsContainer = document.getElementById("jobsContainer");

const getAllJobs = async () => {
  try {
    const res = await axios.get("/api/job",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); // Adjust if your route differs
    const jobs = res.data.jobs;

    jobsContainer.innerHTML = "";

    if (jobs.length === 0) {
      jobsContainer.innerHTML = `<p>No jobs available at the moment.</p>`;
      return;
    }

    jobs.forEach(job => {
        const deadline = new Date(job.applicationDeadline);
        const now = new Date();
        const isOpen = job.isActive && deadline > now;
      const card = document.createElement("div");
      card.className = "col";

      card.innerHTML = `
        <div class="card shadow-sm border rounded">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text mb-1"><strong>Company:</strong> ${job.postedBy?.companyName || 'Unknown'}</p>
            <p class="card-text mb-1"><strong>Location:</strong> ${job.location}</p>
            <p class="card-text mb-1"><strong>Type:</strong> ${job.jobType}</p>
            <p class="card-text mb-2"><strong>Status:</strong> ${isOpen
  ? `🟢 Open till: ${deadline.toDateString()}`
  : `🔴 Applications Closed`}</p>
            <button class="btn btn-sm btn-primary" onclick="viewDetails('${job._id}')">View Details</button>
          </div>
        </div>
      `;
      jobsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    jobsContainer.innerHTML = `<p class="text-danger">Failed to load jobs.</p>`;
  }
};

function viewDetails(jobId) {
  window.location.href = `/job-details/job-details.html?id=${jobId}`;
}

getAllJobs();
