
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createJobForm");
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (jobId) {
    document.querySelector("h2").innerText = "Edit Job Post";
    form.querySelector("button[type='submit']").innerText = "Update Job";

    (async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`/api/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const job = data.job;

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

    try {
      const token = localStorage.getItem("token");

      let res;
      if (jobId) {
        res = await axios.patch(`/api/job/${jobId}`, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Job updated successfully!");
      } else {
        res = await axios.post("/api/job", jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Job created successfully!");
      }

      form.reset();
      window.location.href = "/recruiter-dashboard/dashboard.html"; // optional redirect
    } catch (err) {
      console.error("Error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  });
});
