const token = localStorage.getItem("token");
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn=document.getElementById('cancelBtn');
const form = document.getElementById('profileForm');
let profile = null;
let experienceCount = 0;
let educationCount=0;
let projectCount=0;
let isEditable = false;
let insightsBtn=document.getElementById('insights');
let profileViews=document.getElementById('profileViews');
let addExperienceBtn=document.getElementById('addExperienceBtn');
let addEducationBtn=document.getElementById('addEducationBtn');
let addProjectBtn=document.getElementById('addProjectBtn');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
if (!token) {
  window.location.href = "/login/login.html"; 
}
if(id){
  insightsBtn.style.display='none';
  profileViews.style.display='none';
  addExperienceBtn.style.display='none';
  addEducationBtn.style.display='none';
  addProjectBtn.style.display='none';
  editBtn.style.display='none';
  saveBtn.style.display='none';
  cancelBtn.style.display='none';
}

async function loadInsights() {
  try {
    const res = await axios.get("/api/application/insights", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { insights } = res.data;
    console.log(res.data);
    document.getElementById("totalApplications").textContent = insights.total || 0;
    document.getElementById("acceptedApplications").textContent = insights.accepted || 0;
    document.getElementById("rejectedApplications").textContent = insights.rejected || 0;
    document.getElementById("pendingApplications").textContent = insights.pending || 0;
    document.getElementById("resumeDownloaded").textContent=profile.resumeDownloadCount;
  } catch (err) {
    console.error("Failed to load insights", err);
  }
}


function renderExperience(experienceArray){
    experienceCount =experienceArray.length;
  const container = document.getElementById("experienceContainer");
  container.innerHTML = "";
   experienceArray.forEach((exp, index) => {
    const html = `
  <div class="experience-entry border rounded p-2 mb-2">
    <h6 class="mb-2">Experience ${index + 1}</h6>
    
    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Job Title</label>
        <input type="text" class="form-control form-control-sm" name="experience[${index}][jobTitle]"  value="${exp.jobTitle || ''}" disabled />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Company Name</label>
        <input type="text" class="form-control form-control-sm" name="experience[${index}][companyName]" value="${exp.companyName || ''}" disabled />
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-control form-control-sm" name="experience[${index}][startDate]" value="${exp.startDate ? exp.startDate.slice(0, 10) : ''}" disabled />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">End Date</label>
        <input type="date" class="form-control form-control-sm" name="experience[${index}][endDate]" value="${exp.endDate ? exp.endDate.slice(0, 10) : ''}" disabled />
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Location</label>
        <input type="text" class="form-control form-control-sm" name="experience[${index}][location]" value="${exp.location || ''}" disabled />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Description</label>
        <textarea class="form-control form-control-sm" name="experience[${index}][description]" rows="2" disabled>${exp.description || ''}</textarea>
      </div>
    </div>
  </div>
`;

    container.insertAdjacentHTML("beforeend", html);
  });
}
function renderEducation(educationArray){
    educationCount=educationArray.length;
    const container = document.getElementById("educationContainer");
  container.innerHTML = "";
  educationArray.forEach((edu, index) => {
   const html = `
  <div class="education-entry border rounded p-2 mb-2">
    <h6 class="mb-2">Education ${index + 1}</h6>
    
    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">School Name</label>
        <input type="text" class="form-control form-control-sm" name="education[${index}][schoolName]" value="${edu.schoolName || ''}" disabled />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Degree</label>
        <input type="text" class="form-control form-control-sm" name="education[${index}][degree]" value="${edu.degree || ''}" disabled />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Field of Study</label>
        <input type="text" class="form-control form-control-sm" name="education[${index}][fieldOfStudy]" value="${edu.fieldOfStudy || ''}" disabled />
      </div>
      <div class="col-md-3 mb-2">
        <label class="form-label">Start Year</label>
        <input type="number" class="form-control form-control-sm" name="education[${index}][startYear]" value="${edu.startYear || ''}" disabled />
      </div>
      <div class="col-md-3 mb-2">
        <label class="form-label">End Year</label>
        <input type="number" class="form-control form-control-sm" name="education[${index}][endYear]" value="${edu.endYear || ''}" disabled />
      </div>
    </div>

    <div class="mb-2">
      <label class="form-label">Description</label>
      <textarea class="form-control form-control-sm" rows="2" name="education[${index}][description]" disabled>${edu.description || ''}</textarea>
    </div>
  </div>
`;

    container.insertAdjacentHTML("beforeend", html);
  });
}
function renderProjects(projects) {
    projectCount=projects.length;
  const container = document.getElementById("projectContainer");
  container.innerHTML = ""; // Clear previous content
 // <a href="${resumeUrl}" target="_blank" class="btn btn-outline-primary btn-sm">
          //   📄 View
          // </a>
  projects.forEach((project, index) => {
    const html = `
      <div class="project-entry border rounded p-2 mb-3">
        <h6 class="mb-2">Project ${index + 1}</h6>

        <div class="row mb-2">
          <div class="col-md-6">
            <label class="form-label">Title</label>
            <input type="text" class="form-control form-control-sm" name="projects[${index}][title]" value="${project.title || ''}" disabled />
          </div>
          <div class="col-md-6">
            <label class="form-label">Tech Stack</label>
            <input type="text" class="form-control form-control-sm" name="projects[${index}][techStack]" value="${Array.isArray(project.techStack) ? project.techStack.join(', ') : ''}" disabled />
          </div>
        </div>

        <div class="mb-2">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" name="projects[${index}][description]" rows="2" disabled>${project.description || ''}</textarea>
        </div>

        <div class="row">
          <div class="col-md-6 mb-2">
            <label class="form-label">Live URL</label>
            <input type="url" class="form-control form-control-sm" name="projects[${index}][projectUrl]" value="${project.projectUrl || ''}" disabled />
          </div>
          <div class="col-md-6 mb-2">
            <label class="form-label">GitHub Link</label>
            <input type="url" class="form-control form-control-sm" name="projects[${index}][githubLink]" value="${project.githubLink || ''}" disabled />
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });
}
 async function downloadResume(event) {
   event.preventDefault();
    try {
    
      const response = await axios.get(`/api/profile/download-resume/${profile._id}`, {
        responseType: "blob", // important to receive binary data
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${profile.name}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error.response?.data || error.message);
      alert("Failed to download resume. Please try again.");
    }
  }
function renderResume(resumeUrl, isEditable = false) {
  const container = document.getElementById("resumeContainer");
  if (!container || !resumeUrl) return;

const filename = resumeUrl.split("/").pop(); // "1753676846953_degree.pdf"
const cleanName = filename.split("_").slice(1).join("_"); // "degree.pdf"
  const html = `
    <div class="mb-3">
      ${
        resumeUrl
          ? `
        <div class="d-flex gap-2 mb-2">
        <a href="${resumeUrl}" target="_blank" class="btn btn-outline-primary btn-sm" >
  View Resume ${cleanName}
</a>
<button  class="btn btn-outline-success btn-sm" onclick="downloadResume(event)">Download Resume</button>

      </div>
        `
          : `<p class="text-muted">No resume uploaded</p>`
      }

      ${
        isEditable
          ? `<input type="file" class="form-control" id="resume" name="resume" accept=".pdf,.doc,.docx" />`
          : ''
      }
    </div>
  `;

  container.innerHTML = html;
}

function renderProfilePicture(profilePictureUrl, isEditable = false){
     const container = document.getElementById("profilePictureContainer");
  if (!container) return;
  const html = `
    <div class="mb-3">
    
      <div class="mb-2">
        ${
        `<img src="${profilePictureUrl?profilePictureUrl:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}" alt="Profile Picture" class="img-thumbnail rounded-circle" style="width: 150px; height: 150px; object-fit: cover;" />`
        }
      </div>

      ${
        isEditable
          ? `<input type="file" class="form-control" id="profilePicture" name="profilePicture" accept="image/*" />`
          : ''
      }
    </div>
  `;

  container.innerHTML = html;
}

async function loadProfile() {
  try {
 
   let res;
   if(id){
    res = await axios.get(`/api/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   }else{
    res = await axios.get("/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

   }
     
    profile = res.data.profile;
    console.log(profile);
   
    if (profile.hasPremiumAccess && !id) {
      const viewsDiv = document.getElementById("profileViews");
      if (viewsDiv) {
        viewsDiv.textContent = `${profile.profileViewCount} recruiters viewed your profile`;
      }
       if (insightsBtn) {
    // insightsBtn.style.display = "inline-block"; 
    insightsBtn.classList.remove("d-none");
  }
    }
    document.getElementById("name").value = profile.name || "";
    document.getElementById("headline").value = profile.headline || "";
    document.getElementById("about").value = profile.about || "";
    document.getElementById("location").value = profile.location || "";
    document.getElementById("skills").value = (profile.skills || []).join(", ");
    renderExperience(profile.experience || []);
    renderEducation(profile.education || []);
    renderProjects(profile.projects || []);
    renderResume(profile.resumeUrl);
    renderProfilePicture(profile.profilePicture);
  } catch (err) {
    console.error("Error loading profile", err);
    showToast("Something went wrong","danger");
  }
}

loadProfile();

if(!id){
  insightsBtn.addEventListener('click', () => {
  loadInsights();
});
editBtn.addEventListener('click', () => {
    isEditable=true;
    // Enable all input, select, textarea fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = false;
    });
    document.getElementById('addExperienceBtn').disabled = false;
    document.getElementById('addEducationBtn').disabled = false;
    document.getElementById('addProjectBtn').disabled = false;
    renderResume(profile.resumeUrl, isEditable);
    renderProfilePicture(profile.profilePicture,isEditable);
    // Toggle buttons
    editBtn.classList.add('d-none');
    saveBtn.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
  });
  cancelBtn.addEventListener('click', () => {
    isEditable=false;
    // Enable all input, select, textarea fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = true;
    });
    document.getElementById('addExperienceBtn').disabled = true;
    document.getElementById('addEducationBtn').disabled = true;
    document.getElementById('addProjectBtn').disabled = true;
    renderResume(profile.resumeUrl, isEditable);
    renderProfilePicture(profile.profilePicture,isEditable);
    // Toggle buttons
    editBtn.classList.remove('d-none');
    saveBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
  });

  addExperienceBtn.addEventListener('click', () => {
  const container = document.getElementById("experienceContainer");

  const html = `
  <div class="experience-entry border rounded p-2 mb-2">
    <h6 class="mb-2">Experience ${experienceCount + 1}</h6>

    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Job Title</label>
        <input type="text" name="experience[${experienceCount}][jobTitle]" class="form-control form-control-sm" />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Company Name</label>
        <input type="text" name="experience[${experienceCount}][companyName]" class="form-control form-control-sm" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Start Date</label>
        <input type="date" name="experience[${experienceCount}][startDate]" class="form-control form-control-sm" />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">End Date</label>
        <input type="date" name="experience[${experienceCount}][endDate]" class="form-control form-control-sm" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Location</label>
        <input type="text" name="experience[${experienceCount}][location]" class="form-control form-control-sm" />
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Description</label>
        <textarea name="experience[${experienceCount}][description]" class="form-control form-control-sm" rows="2"></textarea>
      </div>
    </div>
    <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.experience-entry').remove()">🗑️ Remove</button>
      </div>
  </div>
  `;

  container.insertAdjacentHTML("beforeend", html);
  experienceCount++;
});
addEducationBtn.addEventListener('click', () => {
  const container = document.getElementById("educationContainer");

  const html = `
   <div class="education-entry border rounded p-2 mb-2">
    <h6 class="mb-2">Education ${educationCount + 1}</h6>
    
    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">School Name</label>
        <input type="text" class="form-control form-control-sm" name="education[${educationCount}][schoolName]"/>
      </div>
      <div class="col-md-6 mb-2">
        <label class="form-label">Degree</label>
        <input type="text" class="form-control form-control-sm" name="education[${educationCount}][degree]"/>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-2">
        <label class="form-label">Field of Study</label>
        <input type="text" class="form-control form-control-sm" name="education[${educationCount}][fieldOfStudy]"/>
      </div>
      <div class="col-md-3 mb-2">
        <label class="form-label">Start Year</label>
        <input type="number" class="form-control form-control-sm" name="education[${educationCount}][startYear]"/>
      </div>
      <div class="col-md-3 mb-2">
        <label class="form-label">End Year</label>
        <input type="number" class="form-control form-control-sm" name="education[${educationCount}][endYear]"/>
      </div>
    </div>

    <div class="mb-2">
      <label class="form-label">Description</label>
      <textarea class="form-control form-control-sm" rows="2" name="education[${educationCount}][description]"></textarea>
    </div>
    <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.education-entry').remove()">🗑️ Remove</button>
      </div>
  </div>
  
  `;

  container.insertAdjacentHTML("beforeend", html);
  educationCount++;
});
addProjectBtn.addEventListener('click', () => {
  const container = document.getElementById("projectContainer");

  const html = `
    <div class="project-entry border rounded p-2 mb-3">
      <h6 class="mb-2">Project ${projectCount + 1}</h6>

      <div class="row mb-2">
        <div class="col-md-6">
          <label class="form-label">Title</label>
          <input type="text" class="form-control form-control-sm" name="projects[${projectCount}][title]" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tech Stack</label>
          <input type="text" class="form-control form-control-sm" name="projects[${projectCount}][techStack]" placeholder="Comma-separated" required />
        </div>
      </div>

      <div class="mb-2">
        <label class="form-label">Description</label>
        <textarea class="form-control form-control-sm" rows="2" name="projects[${projectCount}][description]" required></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-2">
          <label class="form-label">Live URL</label>
          <input type="url" class="form-control form-control-sm" name="projects[${projectCount}][projectUrl]" />
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">GitHub Link</label>
          <input type="url" class="form-control form-control-sm" name="projects[${projectCount}][githubLink]" />
        </div>
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.project-entry').remove()">🗑️ Remove</button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);
  projectCount++;
});

function collectSectionToFormData(formData, sectionName) {
  const data = [];

  document.querySelectorAll(`[name^='${sectionName}']`).forEach(input => {
    const parts = input.name.match(new RegExp(`${sectionName}\\[(\\d+)\\]\\[(\\w+)\\]`));
    if (!parts) return;

    const i = Number(parts[1]);
    const key = parts[2];

    if (!data[i]) data[i] = {};

     let value = input.value.trim();
    if (key === "techStack") {
      value = value
        .split(",")
        .map(item => item.trim())
        .filter(item => item); // remove empty strings
    }

    data[i][key] = value;
  });

  formData.append(sectionName, JSON.stringify(data));
}

// handle form submission
form.addEventListener("submit",async(e)=>{
    e.preventDefault(); 
  const formData = new FormData();
   formData.append("name", document.getElementById("name").value);
  formData.append("headline", document.getElementById("headline").value);
  formData.append("about", document.getElementById("about").value);
  formData.append("location", document.getElementById("location").value);
  const skillsInput = document.getElementById("skills").value;
  //skills
const skillsArray = skillsInput
  .split(",")
  .map(skill => skill.trim())
  .filter(skill => skill); // remove empty ones
formData.append("skills", JSON.stringify(skillsArray));
//experience
collectSectionToFormData(formData,"experience");
//education 
collectSectionToFormData(formData,"education");
//projects
collectSectionToFormData(formData,"projects");
const profilePicInput = document.getElementById("profilePicture");
console.log(profilePicInput);
  if (profilePicInput?.files[0]) {
    formData.append("profilePicture", profilePicInput.files[0]);
  }

  // Resume File
  const resumeInput = document.getElementById("resume");
  if (resumeInput?.files[0]) {
    formData.append("resume", resumeInput.files[0]);
  }
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
saveBtn.disabled = true;
cancelBtn.disabled = true;
  saveBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Saving...
  `;

  try {
    const response = await axios.patch("/api/profile/applicant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response from server:", response.data);
    showToast(response.data.message,'success');
      isEditable=false;
    // disable all input, select, textarea fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = true;
    });
    addExperienceBtn.disabled = true;
    addEducationBtn.disabled = true;
    addProjectBtn.disabled = true;
    renderResume(profile.resumeUrl, isEditable);
    renderProfilePicture(profile.profilePicture,isEditable);
    // Toggle buttons
    saveBtn.disabled = false;
cancelBtn.disabled = false;
  saveBtn.innerHTML = `
  save
  `;
    editBtn.classList.remove('d-none');
    saveBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
    loadProfile();

  } catch (error) {
    saveBtn.disabled = false;
cancelBtn.disabled = false;
saveBtn.innerHTML='Save';
    if (error.response) {
      console.error("Server error:", error.response.data);
      showToast("Something went wrong","danger");
    } else {
      console.error("Network error:", error.message);
      showToast("Something went wrong","danger");
    }
  }
});


}

function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
