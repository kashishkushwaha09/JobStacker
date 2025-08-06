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

const statusBadge = (status) => {
    if (!status) return '';
    switch (status) {
      case 'accepted':
        return '<span class="badge bg-success">Accepted</span>';
      case 'pending':
        return '<span class="badge bg-warning text-dark">Pending</span>';
      case 'rejected':
        return '<span class="badge bg-danger">Rejected</span>';
      default:
        return `<span class="badge bg-secondary">${status}</span>`;
    }
  };

  async function loadApplications() {
    const applicantName = document.getElementById('filterApplicant').value.trim();
    const jobTitle = document.getElementById('filterJob').value.trim();
    const status = document.getElementById('filterStatus').value;

    const tbody = document.getElementById('applicationsTableBody');
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">Loading...</td>
      </tr>
    `;

    try {
      const params = {};
      if (applicantName) params.applicantName = applicantName;
      if (jobTitle) params.jobTitle = jobTitle;
      if (status) params.status = status;

      // If your API requires auth, include headers here:
      // const token = localStorage.getItem('adminToken');
      // const res = await axios.get('/admin/applications', { params, headers: { Authorization: `Bearer ${token}` }});

      const res = await axios.get('/api/admin/applications', { params, headers: { Authorization: `Bearer ${token}` }});
      const { success, data } = res.data;

      if (!success) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load applications</td></tr>`;
        return;
      }

      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No applications found.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';

      data.forEach((app, i) => {
        const appliedOn = new Date(app.createdAt).toLocaleString();
        const applicantNameText = app.applicant?.name || 'N/A';
        const applicantLocation = app.applicant?.location || 'N/A';
        const jobTitleText = app.job?.title || 'N/A';
        const matchScore = app.matchScore ?? 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${applicantNameText}</td>
          <td>${applicantLocation}</td>
          <td>${jobTitleText}</td>
          <td>${statusBadge(app.status)}</td>
          <td>${matchScore}</td>
          <td>${appliedOn}</td>
        `;
        tbody.appendChild(tr);
      });

    } catch (err) {
      console.error('Error loading applications', err);
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading applications</td></tr>`;
    }
  }
 
  document.getElementById('filterBtn').addEventListener('click', loadApplications);
  document.addEventListener('DOMContentLoaded', loadApplications);