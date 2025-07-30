const token = localStorage.getItem("token");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const premiumBadgeContainer=document.getElementById("premiumBadgeContainer");
const jobInsightPremium=document.getElementById("jobInsightPremium");
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
        nameSpan.innerText = profile.name || "Recruiter";
    if(profile.hasPremiumAccess){
        buyPremiumBtn.style.display = "none";
        premiumBadgeContainer.style.display = "inline-block";
        jobInsightPremium.style.display="inline-block";
    }
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
       showToast("You must be logged in", "danger");
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
           showToast("You haven't posted any jobs yet!", "danger");
            container.innerHTML = "<p>No jobs posted yet.</p>";
            return;
        }

        jobs.forEach((job) => {
          const isDisabled = job.isActive ? "" : "disabled";
            const jobCard = document.createElement("div");
            jobCard.className = "col";
            jobCard.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
              ${job.title}
               ${job.isFeatured ? '<span class="badge bg-warning text-dark ms-2">🌟 Featured</span>' : ''}
              </h5>
              <p class="card-text">
                <strong>Location:</strong> ${job.location}<br/>
                <strong>Posted On:</strong> ${new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p>Status: <strong>${job.isActive ? 'Active' : 'Inactive'}</strong></p>
              <a href="/job-details/job-details.html?jobId=${job._id}" class="btn btn-info btn-sm me-0">View Details</a>
              <button class="btn btn-sm btn-outline-primary toggle-status-btn" onclick="toggleJobStatus(event,'${job._id}')">
  Toggle Status
</button>
              <button class="btn btn-primary btn-sm me-0" onclick="editJob('${job._id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteJob(event,'${job._id}')" ${isDisabled}>Delete</button>
              <a href="/recruiter-applications/recruiter-applications.html?jobId=${job._id}" class="btn btn-outline-secondary btn-sm fw-medium">View Applications</a>
              
            </div>
          </div>
        `;
            container.appendChild(jobCard);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
         showToast("Failed to load jobs!", "danger");
    }
});
async function toggleJobStatus(event,jobId) {
  try {
   const btn = event.target;
  btn.disabled = true;
    const res = await axios.patch(`/api/job/${jobId}/status`, {},{
         headers: {
                Authorization: `Bearer ${token}`,
            },
    });
    showToast("Job status updated!", "success");
    location.reload();
  } catch (err) {
    console.error(err);
    showToast("Failed to update status!", "danger");
  }finally{
    btn.disabled = false
  };
}

async function deleteJob(event,jobId) {
  
    if (!confirm("Are you sure you want to delete this job?")) return;

    const token = localStorage.getItem("token");
    
    try {
      const btn = event.target;
  btn.disabled = true;
        await axios.delete(`/api/job/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        showToast("Job deleted successfully!", "success");
        setTimeout(() => {
           location.reload();
           
        }, 2000);
       
    } catch (error) {
        console.error("Delete error:", error);
        showToast("Failed to delete job!", "danger");
    }finally{
    btn.disabled = false
  };
}

function editJob(jobId) {
    window.location.href = `/create-job/create-job.html?id=${jobId}`;
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
               showToast("Premium Activated!!", "success");
              location.reload();
            } else {
              showToast("Payment verification failed!", "danger");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            showToast("Something went wrong while verifying payment!", "danger");
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
      showToast("Something went wrong while initiating payment!", "danger");
    }
  });

  function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

