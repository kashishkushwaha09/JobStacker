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

async function loadOrders() {
  try {
    const params = {
      name: document.getElementById("nameFilter").value.trim(),
      email: document.getElementById("emailFilter").value.trim(),
      userType: document.getElementById("userTypeFilter").value,
      status: document.getElementById("statusFilter").value
    };
const res = await axios.get("/api/admin/orders",{
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { success, data } = res.data; 

    if (!success) {
      showToast("Failed to load orders","danger");
      return;
    }

    const tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = ""; 

    data.forEach((order, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${order.profileId?.name || "N/A"}</td>
        <td>${order.email}</td>
        <td>${order.userType}</td>
        <td>
          <span class="badge ${order.status === "completed" ? "bg-success" : order.status === "pending" ? "bg-warning text-dark" : "bg-danger"}">
            ${order.status}
          </span>
        </td>
        <td>${order.profileId?.location || "N/A"}</td>
        <td>${order.orderId}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading orders:", error);
    showToast("Error loading orders:","danger");
  }
}


loadOrders();
