const token = localStorage.getItem("token");
  if (!token) {
  window.location.href = "/login/login.html"; 
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login/login.html";
});
function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
///************ */
function getFilters() {
  const form = document.getElementById("filterForm");
  const formData = new FormData(form);
  const filters = {};

  for (let [key, value] of formData.entries()) {
    if (value.trim() !== "") {
      filters[key] = value.trim();
    }
  }

  return filters;
}
async function fetchAndRenderJobs(search = "", page = 1, limit = 10){
const filters = getFilters();
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);

  for (const [key, value] of Object.entries(filters)) {
    queryParams.append(key, value);
  }

  queryParams.append("page", page);
  queryParams.append("limit", limit);
  try {
     const res=await axios.get(`/api/admin/jobs?${queryParams.toString()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.data;
    console.log(data);
    renderJobCards(data.jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}
function renderJobCards(jobs) {
  const container = document.getElementById("jobsContainer");
  container.innerHTML = "";

  if (!jobs.length) {
    container.innerHTML = "<p class='text-center'>No jobs found.</p>";
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    const deadline = new Date(job.applicationDeadline).toLocaleDateString();

    card.innerHTML = `
      <div class="card h-100 d-flex flex-column">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${job.title}</h5>
          <p class="card-text">
            <strong>Company:</strong> ${job.postedBy?.companyName || "N/A"}<br>
            <strong>Location:</strong> ${job.location}<br>
            <strong>Salary:</strong> ${job.salary}<br>
            <strong>Type:</strong> ${job.jobType}<br>
            <strong>Experience:</strong> ${job.experienceLevel}<br>
            <strong>Deadline:</strong> ${deadline}<br>
            <strong>Skills:</strong> ${job.skillsRequired.join(", ")}<br>
            <strong>Active:</strong> ${job.isActive ? "✅" : "❌"}<br>
            <strong>Approved:</strong> ${job.isApproved ? "✅" : "❌"}
          </p>

          <div class="d-flex justify-content-evenly mt-auto pt-2">
            <button class="btn btn-sm ${job.isApproved ? 'btn-warning' : 'btn-success'}"
              onclick="toggleJobApproval('${job._id}', ${!job.isApproved})">
              ${job.isApproved ? "Disapprove" : "Approve"}
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteJob('${job._id}')">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
async function toggleJobApproval(jobId, status) {
  try {
    const res = await axios.patch(`/api/admin/jobs/${jobId}/status`, { isApproved: status }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    showToast("Job status updated!", "success");
    fetchAndRenderJobs(); // reload
  } catch (err) {
    console.error(err);
    showToast("Failed to toggle approval!", "danger");
  }
}

async function deleteJob(jobId) {
  if (!confirm("Are you sure you want to delete this job?")) return;
  try {
    const res = await axios.delete(`/api/admin/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    showToast("Job deleted!", "success");
    fetchAndRenderJobs();
  } catch (err) {
    console.error(err);
    showToast("Failed to delete job!", "danger");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterForm = document.getElementById("filterForm");
  const toggleFilterBtn = document.getElementById("toggleFilterBtn");

  toggleFilterBtn.addEventListener("click", () => {
    const isHidden = filterForm.classList.toggle("d-none");
  toggleFilterBtn.textContent = isHidden ? "Filter Users" : "Hide Filters";
});


  searchInput.addEventListener("input", () => {
    fetchAndRenderJobs(searchInput.value.trim());
  });

  
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchAndRenderJobs(searchInput.value.trim());
  });
//auto fetch on dropdown change
//   ["role", "isActive", "hasPremiumAccess"].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.addEventListener("change", () => {
//         fetchAndRenderUsers(searchInput.value.trim());
//       });
//     }
//   });

  // Initial fetch
  fetchAndRenderJobs();

});