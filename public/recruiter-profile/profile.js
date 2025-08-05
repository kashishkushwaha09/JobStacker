const token = localStorage.getItem("token");
const role=localStorage.getItem("role");
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById('profileForm');
let profile = null;
let isEditable = false;
if (!token) {
    window.location.href = "/login/login.html";
}
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
if(id){
  editBtn.style.display='none';
  saveBtn.style.display='none';
  cancelBtn.style.display='none';
}
function renderProfilePicture(profilePictureUrl, isEditable = false) {
    const container = document.getElementById("profilePictureContainer");
    if (!container) return;
    const html = `
    <div class="mb-3">
    
      <div class="mb-2">
        ${`<img src="${profilePictureUrl ? profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}" alt="Profile Picture" class="img-thumbnail rounded-circle" style="width: 150px; height: 150px; object-fit: cover;" />`
        }
      </div>

      ${isEditable
            ? `<input type="file" class="form-control" id="profilePicture" name="profilePicture" accept="image/*" />`
            : ''
        }
    </div>
  `;

    container.innerHTML = html;
}
function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}
async function loadProfile() {
    try {
      let res='/api/profile/me';
      if(id){
       res=`/api/admin/users/${id}`;
      }

         res = await axios.get(res, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        profile = res.data.profile;
        console.log(profile);

        document.getElementById("name").value = profile.name || "";
        document.getElementById("headline").value = profile.headline || "";
        document.getElementById("about").value = profile.about || "";
        document.getElementById("location").value = profile.location || "";
        // companyName, companyAbout, companyLocation 
        document.getElementById("companyName").value = profile.companyName || "";
        const aboutTextarea = document.getElementById("companyAbout");
        aboutTextarea.value = profile.companyAbout || "";
        autoResizeTextarea(aboutTextarea);
        document.getElementById("companyLocation").value = profile.companyLocation || "";
        renderProfilePicture(profile.profilePicture);
    } catch (err) {
        console.error("Error loading profile", err);
        showToast("Failed fetching profile","danger");
    }
}

loadProfile();
editBtn.addEventListener('click', () => {
    isEditable=true;
    // Enable all input, select, textarea fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = false;
    });
    
    renderProfilePicture(profile.profilePicture,isEditable);
    // Toggle buttons
    editBtn.classList.add('d-none');
    saveBtn.classList.remove('d-none');
    cancelBtn.classList.remove("d-none");

  });
  cancelBtn.addEventListener("click", () => {
     isEditable=true;
  const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = false;
    });
    
  saveBtn.classList.add("d-none");
  cancelBtn.classList.add("d-none");
  editBtn.classList.remove("d-none");
});

  // handle form submission
form.addEventListener("submit",async(e)=>{
    e.preventDefault(); 
  const formData = new FormData();
   formData.append("name", document.getElementById("name").value);
  formData.append("headline", document.getElementById("headline").value);
  formData.append("about", document.getElementById("about").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("companyName", document.getElementById("companyName").value);
formData.append("companyAbout", document.getElementById("companyAbout").value);
formData.append("companyLocation", document.getElementById("companyLocation").value);
const profilePicInput = document.getElementById("profilePicture");
console.log(profilePicInput);
  if (profilePicInput.files[0]) {
    formData.append("profilePicture", profilePicInput.files[0]);
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
    const response = await axios.patch("/api/profile/recruiter", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response from server:", response.data);
      isEditable=false;
    // disable all input, select, textarea fields
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.disabled = true;
    });
    
    renderProfilePicture(profile.profilePicture,isEditable);
    // Toggle buttons
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


function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
