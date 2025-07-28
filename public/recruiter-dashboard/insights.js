const token = localStorage.getItem("token");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const premiumBadgeContainer = document.getElementById("premiumBadgeContainer");
const allInsights = [];
if (!token) {
    window.location.href = "/login.html";
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
        if (profile.hasPremiumAccess) {
            buyPremiumBtn.style.display = "none";
            premiumBadgeContainer.style.display = "inline-block";
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



async function loadInsights() {
    const container = document.getElementById("insightsContainer");
    const jobsRes = await axios.get("/api/job/postedByRecruiter", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const jobs = await jobsRes.data.jobs;

    if (!jobs.length) {
        container.innerHTML = "<p>You haven’t posted any jobs yet.</p>";
        return;
    }
    for (const job of jobs) {
        try {
            const insightsRes = await axios.get(`/api/job/insights/${job._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const insights = await insightsRes.data.jobInsights;
            allInsights.push({
                title: job.title,
                views: insights.views,
                totalApplications: insights.totalApplications,
                premiumCount: insights.premiumCount,
                postedOn: insights.timeSincePosted,
            });

            const card = document.createElement("div");
            card.className = "col-md-6 mb-3";

            card.innerHTML = `
          <div class="card shadow-sm p-3">
            <h5 class="card-title">${job.title}</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">👁️ Views: ${insights.views}</li>
              <li class="list-group-item">📥 Applications: ${insights.totalApplications}</li>
              <li class="list-group-item">💎 Premium Applications: ${insights.premiumCount}</li>
              <li class="list-group-item">⏱️ Posted ${insights.timeSincePosted}</li>
            </ul>
          </div>
        `;

            container.appendChild(card);
        } catch (err) {
            console.error(`Failed to load insights for job ${job._id}:`, err);
        }
    }
}

loadInsights();
function downloadInsightsCSV() {
  if (!allInsights.length) {
    alert("No data available to export.");
    return;
  }

  const header = ["Job Title", "Views", "Total Applications", "Premium Applications", "Posted"];
  const rows = allInsights.map(row =>
    [row.title, row.views, row.totalApplications, row.premiumCount, row.postedOn]
  );

  let csvContent = "data:text/csv;charset=utf-8," 
    + header.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "recruiter_insights.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


