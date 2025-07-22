document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createJobForm");

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
console.log(jobData);
   try {
  const token = localStorage.getItem("token"); 

  const res = await axios.post("/api/job", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  alert("Job created successfully!");
  form.reset();
//   window.location.href = "/recruiter/dashboard.html"; // update if needed

} catch (err) {
  console.error("Error:", err.response?.data?.message || err.message);
  alert((err.response?.data?.message || "Something went wrong"));
}

  });
});
