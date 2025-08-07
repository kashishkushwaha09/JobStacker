const token = localStorage.getItem("token");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const premiumBadgeContainer=document.getElementById("premiumBadgeContainer");
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
    
    if(profile.hasPremiumAccess){
        buyPremiumBtn.style.display = "none";
        premiumBadgeContainer.style.display = "inline-block";
    }
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


function viewDetails(jobId) {
  window.location.href = `/job-details/job-details.html?id=${jobId}`;
}


// buyPremium feature
 

  buyPremiumBtn.addEventListener("click", async () => {
    try {
      const response = await axios.post("/api/order/create-order", {},{
         headers: {
        Authorization: `Bearer ${token}`
      }
      });

      const order = response.data;
     console.log(order);
      // Step 2: Configure Razorpay checkout options
      const options = {
        key:"rzp_test_KwsDOyvLFExWYC", // Replace with actual Razorpay Key ID
        amount: order.amount, // in paise
        currency: "INR",
        order_id: order.orderId,
        name: "JobStacker Premium",
        description: "Upgrade to Premium",
        

        handler: async function (response) {
          try {
            console.log(response);
            const verifyRes = await axios.post("/api/order/verify-payment", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            },{
         headers: {
        Authorization: `Bearer ${token}`
      }
      });

            if (verifyRes.data.success) {
              showToast("Premium Activated!","success");
              location.reload();
            } else {
              showToast("Payment verification failed.","danger");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            showToast("Something went wrong while verifying payment","danger");
          }
        },

        theme: {
          color: "#6777ef"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order Creation Error:", err);
      showToast("Something went wrong while initiating payment.","danger")
    }
  });
  async function saveJob(jobId) {
  try {
    await axios.post(`/api/saved-jobs/save/${jobId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    showToast("Job saved!","success");
     
  } catch (err) {
    showToast(err.response?.data?.message || "Error saving job","danger");
  }
}
async function toggleSaveJob(button, jobId) {
  const isSaved = button.getAttribute("data-saved") === "true";
  console.log(isSaved);
  const url = isSaved
    ? `/api/saved-jobs/unsave/${jobId}`
    : `/api/saved-jobs/save/${jobId}`;
console.log(url);
  try {
    button.disabled = true; // optional: disable *only during* request

     if (isSaved) {
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  
    // Toggle saved state
    button.setAttribute("data-saved", (!isSaved).toString());

    button.innerText = !isSaved ? "Unsave" : "Save"; // change label
     if(isSaved){
      showToast("Job unsaved successfully!","success");
     }else{
      showToast("Job saved successfully!","success");
     }
  } catch (err) {
    console.error("Unsave error:", err);
    showToast(err.response?.data?.message || "Error updating saved status","danger");
  } finally {
    button.disabled = false; // re-enable
  }
}

function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

window.addEventListener("pageshow", function (event) {
  if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
    location.reload();
  }
});

/// get jobs using search filter
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
async function fetchAndRenderJobs(search = ""){
const filters = getFilters();
  const queryParams = new URLSearchParams();

  if (search) queryParams.append("search", search);

  for (const [key, value] of Object.entries(filters)) {
    queryParams.append(key, value);
  }


  try {
      const res = await axios.get("/api/job", {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    const data = await res.data;
    console.log(data);
    renderJobCards(data.jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    showToast("Failed to load jobs!","danger");
  }
}
function renderJobCards(jobs) {
  const container = document.getElementById("jobsContainer");
  container.innerHTML = "";
  if (jobs.length === 0) {
      container.innerHTML = `<p>No jobs available at the moment.</p>`;
      return;
    }

        jobs.forEach(job => {
        const deadline = new Date(job.applicationDeadline);
        const now = new Date();
        const isOpen = job.isActive && deadline > now;
      const card = document.createElement("div");
      card.className = "col d-flex";
       const notApprovedWarning = !job.isApproved
    ? `<div class="alert alert-warning p-1 small">
         ⚠️ <strong>Apply at your own risk</strong> — this job is not yet approved!
       </div>`
    : "";
      card.innerHTML = `
        <div class="card shadow-sm border rounded h-100 w-100 d-flex flex-column">
          <div class="card-body d-flex flex-column">

    <div class="flex-grow-1">
      <h5 class="card-title">
        ${job.title}
        ${job.isFeatured ? '<span class="badge bg-warning text-dark ms-2">🌟</span>' : ''}
      </h5>
      <p class="card-text mb-1"><strong>Company:</strong> ${job.postedBy?.companyName || 'Unknown'}</p>
      <p class="card-text mb-1"><strong>Location:</strong> ${job.location}</p>
      <p class="card-text mb-1"><strong>Type:</strong> ${job.jobType}</p>
      <p class="card-text mb-2"><strong>Status:</strong> ${isOpen
        ? `🟢 Open till: ${deadline.toDateString()}`
        : `🔴 Applications Closed`}
      </p>
      ${notApprovedWarning}
    </div>

    <div class="mt-auto d-flex gap-2">
      <button class="btn btn-sm btn-primary" onclick="viewDetails('${job._id}')">View Details</button>
      <button class="btn btn-outline-primary btn-sm" onclick="toggleSaveJob(this, '${job._id}')"
        data-saved="${job.isSaved}">${job.isSaved ? "Unsave" : "Save"}</button>
    </div>
  </div>
</div>
        </div>
      `;
      container.appendChild(card);
    });

}
document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("searchInput");
  const filterForm = document.getElementById("filterForm");
  const toggleFilterBtn = document.getElementById("toggleFilterBtn");

  toggleFilterBtn.addEventListener("click", () => {
    const isHidden = filterForm.classList.toggle("d-none");
  toggleFilterBtn.textContent = isHidden ? "Filter Jobs" : "Hide Filters";
});


  searchInput.addEventListener("input", () => {
    fetchAndRenderJobs(searchInput.value.trim());
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchAndRenderJobs(searchInput.value.trim());
  });
  fetchAndRenderJobs();
});