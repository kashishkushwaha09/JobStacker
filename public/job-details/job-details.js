  const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("id");

  if (!jobId) {
    alert("Invalid Job ID");
    return;
  }

  try {
    const res = await axios.get(`/api/job/${jobId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const job = res.data.job;
    console.log(job);
     const deadline = new Date(job.applicationDeadline);
        const now = new Date();
        const isOpen = job.isActive && deadline > now;
    const container = document.getElementById("jobDetailsContainer");
    // container.className = "container mt-5";

    container.innerHTML = `
        <h2>${job.title}</h2>
        <p><strong>Company:</strong> ${job.postedBy.companyName || "N/A"}</p>
        <p><strong>Recruiter Name:</strong> ${job.postedBy.name || "N/A"}</p>
  <p><strong>Company Location:</strong> ${job.postedBy.companyLocation || "N/A"}</p>
  <p><strong>About Company:</strong> ${job.postedBy.companyAbout || "N/A"}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Job Type:</strong> ${job.jobType}</p>
        <p><strong>Experience Level:</strong> ${job.experienceLevel}</p>
        <p><strong>Deadline:</strong> ${new Date(job.applicationDeadline).toLocaleDateString()}</p>
        <p><strong>Openings:</strong> ${job.openings}</p>
        <p><strong>Description:</strong> ${job.description}</p>
        <p><strong>Skills Required:</strong> ${job.skillsRequired.join(", ")}</p>
         <p><strong>Salary:</strong> ${job.salary}</p>
        <button class="btn btn-primary mt-3" id="applyBtn">Apply Now</button>
      
    `;
   if(!isOpen){
    const applyBtn = document.getElementById('applyBtn');
     applyBtn.disabled = true;
        applyBtn.innerText = 'Application Closed';
        applyBtn.classList.add('btn-danger');
        applyBtn.classList.remove('btn-primary');
   }
    // document.body.appendChild(container);
    axios.get('/api/application',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  .then((response) => {
    const applications = response.data.applications;

    // extract job IDs the user already applied to
    const appliedJobIds = applications.map(app => {
      // handle if populated or not
      return typeof app.job === 'object' ? app.job._id : app.job;
    });

    // if this job was already applied
    if (appliedJobIds.includes(jobId)) {
      const applyBtn = document.getElementById('applyBtn');
      if (applyBtn) {
        applyBtn.disabled = true;
        applyBtn.innerText = 'Already Applied';
        applyBtn.classList.add('btn-secondary');
        applyBtn.classList.remove('btn-primary');
      }
    }
  })
  .catch((error) => {
    console.error('Failed to fetch applications:', error);
  });

    document.getElementById("applyBtn").addEventListener("click", async () => {
      try {
       
         const response =await axios.post(`/api/application`, {jobId }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert("Applied successfully!");
         document.getElementById("applyBtn").disabled = true;
    document.getElementById("applyBtn").innerText = "Applied";
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to apply.");
      }
    });

  } catch (err) {
    console.error("Error loading job:", err);
    alert("Error fetching job details.");
  }
});
