 const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login/login.html"; 
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createJobForm");
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");
console.log(jobId);
  if (jobId) {
    document.querySelector("h2").innerText = "Edit Job Post";
    form.querySelector("button[type='submit']").innerText = "Update Job";

    (async () => {
      try {
    
        const { data } = await axios.get(`/api/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const job = data.job;
        console.log(job);
        form.title.value = job.title;
        form.description.value = job.description;
        form.salary.value = job.salary;
        form.location.value = job.location;
        form.skillsRequired.value = job.skillsRequired.join(", ");
        form.jobType.value = job.jobType;
        form.experienceLevel.value = job.experienceLevel;
        form.applicationDeadline.value = job.applicationDeadline?.split("T")[0];
        form.openings.value = job.openings;
      } catch (err) {
        console.error("Error loading job:", err.message);
      }
    })();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn=document.getElementById("submitBtn");
    const jobData = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      salary: form.salary.value.trim(),
      location: form.location.value.trim(),
      skillsRequired: form.skillsRequired.value
        .split(",")
        .map((skill) => skill.trim())
        .filter((s) => s),
      jobType: form.jobType.value,
      experienceLevel: form.experienceLevel.value,
      applicationDeadline: form.applicationDeadline.value,
      openings: Number(form.openings.value),
    };
    submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    ${jobId? "Updating...":"Creating..."}
  `;
    try {
      const token = localStorage.getItem("token");

      let res;
      if (jobId) {
        res = await axios.patch(`/api/job/${jobId}`, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Job updated successfully!","success");
        
      } else {
        res = await axios.post("/api/job", jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("Job created successfully!","success");
        
      }

      setTimeout(() => {
        window.location.href = "/recruiter-dashboard/dashboard.html"; // optional redirect 
      }, 2000);
     
    } catch (err) {
      console.error("Error:", err.response?.data?.message || err.message);
       submitBtn.disabled = false;
    submitBtn.innerHTML =jobId?"Update Job":"Create Job";
      showToast("Something went wrong!","danger");
      
    }
  });
});


function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

