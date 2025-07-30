const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login/login.html"; 
}
async function loadSavedJobs() {
  const container = document.getElementById("savedJobsContainer");
  try {
    const res = await axios.get("/api/saved-jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jobs = res.data.savedJobs;

    if (!jobs.length) {
      container.innerHTML = "<p class='text-danger'>No saved jobs found.</p>";
      return;
    }

    jobs.forEach(({ job }) => {
      const card = document.createElement("div");
      card.className = "card mb-2";
      card.innerHTML = `
        <div class="card-body">
          <h5>${job.title}</h5>
          <p>${job.description}</p>
          <button class="btn btn-danger btn-sm" onclick="unsaveJob('${job._id}')">Unsave</button>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading saved jobs:", err);
    container.innerHTML = "<p>Something went wrong while loading saved jobs. Please try again later.</p>";
  }
}

async function unsaveJob(jobId) {
  try {
    await axios.delete(`/api/saved-jobs/unsave/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("Job unsaved successfully!","success");
    setTimeout(() => {
      location.reload();
    }, 1000);
    
  } catch (err) {
    console.error(`Error unsaving job ${jobId}:`, err);
    showToast("Failed to unsave job. Please try again.","danger");
  }
}

loadSavedJobs();

  function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
