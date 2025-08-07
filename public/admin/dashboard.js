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
async function toggleStatus(userId){
  try {
    const res = await axios.patch(`/api/admin/users/${userId}/status`,{}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.data;
    if(data.success){
    showToast(data.message, "success");
    location.reload();
    }
  
  } catch (err) {
    console.error("Toggle failed:", err);
    showToast("Something went wrong!", "danger");
  }
}

async function fetchAndRenderUsers(search = "") {
  const filters = getFilters();
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);

  for (const [key, value] of Object.entries(filters)) {
    queryParams.append(key, value);
  }

  try {
     const res=await axios.get(`/api/admin/users?${queryParams.toString()}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.data;
    console.log(data);
    renderUserCards(data.users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function renderUserCards(users) {
  const container = document.getElementById("usersContainer");
  container.innerHTML = "";

  if (!users.length) {
    container.innerHTML = "<p class='text-center'>No users found.</p>";
    return;
  }

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100 d-flex flex-column">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${user.name || "Unnamed User"}
           ${user.hasPremiumAccess ? '<span class="badge bg-warning text-dark ms-2">🌟</span>' : ''}
           </h5>
          <p class="card-text">
            Email: ${user.userId?.email || "- null"}<br>
            Role: ${user.userId?.role || "- null"}<br>
            Location: ${user.location || "- null"}<br>
            Skills: ${Array.isArray(user.skills) ? user.skills.join(", ") : "- null"}
          </p>
 <div class="d-flex justify-content-evenly mt-auto pt-1">
            <button class="btn btn-sm ${user.userId.isActive ? 'btn-warning' : 'btn-success'}"
              onclick="toggleStatus('${user.userId?._id}')">
              ${user.userId.isActive ? "Deactivate" : "Activate"}
            </button>
            <button class="btn btn-sm btn-danger"
              onclick="deleteUser('${user.userId?._id}')">
              Delete
            </button>
            <a class="btn btn-sm btn-primary"
             href="${user.userId?.role === 'recruiter' ? `/recruiter-profile/profile.html?id=${user._id}` : `/applicant-profile/profile.html?id=${user._id}`}"
             >
              View Profile
            </a>
          </div>
          
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
async function deleteUser(userId){
try {
  const response = await axios.delete(`/api/admin/users/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    showToast(response.data.message,"success");
    fetchAndRenderUsers();
} catch (error) {
   if (error.response) {
      showToast('Error: ' + error.response.data.message,"danger");
    } else {
      showToast('Something went wrong!',"danger");
    }
    console.error('Delete error:', error);
}
}
async function loadAdminStats() {
  try {
    const res = await axios.get("/api/admin/stats",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { success, data } = res.data;

    if (!success){
      showToast("Failed to load stats","danger");
      return;
    } 

    // Fill basic numbers
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("applicantsCount").textContent = data.applicants;
    document.getElementById("recruitersCount").textContent = data.recruiters;
    document.getElementById("activeJobsCount").textContent = data.activeJobs;
    document.getElementById("totalApplicationsCount").textContent = data.totalApplications;

    // Top Recruiters
    const recruitersList = document.getElementById("topRecruitersList");
    recruitersList.innerHTML = "";
    data.activeRecruiters.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `${r.name} (${r.jobsPosted} jobs)`;
      recruitersList.appendChild(li);
    });

    // Top Applicants
    const applicantsList = document.getElementById("topApplicantsList");
    applicantsList.innerHTML = "";
    data.activeApplicants.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.name} (${a.applications} applications)`;
      applicantsList.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading admin stats:", error);
  }
}

// Load stats whenever offcanvas opens
document.getElementById("adminStatsCanvas").addEventListener("show.bs.offcanvas", loadAdminStats);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const filterForm = document.getElementById("filterForm");
  const toggleFilterBtn = document.getElementById("toggleFilterBtn");

  toggleFilterBtn.addEventListener("click", () => {
    const isHidden = filterForm.classList.toggle("d-none");
  toggleFilterBtn.textContent = isHidden ? "Filter Users" : "Hide Filters";
});


  searchInput.addEventListener("input", () => {
    fetchAndRenderUsers(searchInput.value.trim());
  });

  
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchAndRenderUsers(searchInput.value.trim());
  });

  //auto fetch on dropdown change
  ["role", "isActive", "hasPremiumAccess"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", () => {
        fetchAndRenderUsers(searchInput.value.trim());
      });
    }
  });

  // Initial fetch
  fetchAndRenderUsers();
});
