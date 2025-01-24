const companyTableBody = document.getElementById("companyTableBody");
const companyInfoDiv = document.getElementById("companyInfo");

// On page load, fetch all companies
window.addEventListener("DOMContentLoaded", loadCompanies);

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = "/login.html";
    } else {
      alert("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred during logout. Please try again.");
  }
});
async function loadCompanies() {
  try {
    const response = await fetch("/apicomp/companies");
    if (!response.ok) {
      throw new Error("Failed to fetch companies");
    }

    const companies = await response.json();
    companyTableBody.innerHTML = "";

    companies.forEach((company) => {
      const name = company.generalInfo?.companyName || "Unnamed";

      const row = document.createElement("tr");
      row.classList.add("border-b");

      row.innerHTML = `
            <td class="p-4">${name}</td>
            <td class="p-4 text-center">
              <button
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                data-company-name="${name}"
              >
                View
              </button>
            </td>
          `;

      const viewButton = row.querySelector("button");
      viewButton.addEventListener("click", () => {
        fetchCompanyInfo(name);
      });

      companyTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading companies:", error);
    companyTableBody.innerHTML = `
          <tr>
            <td colspan="2" class="p-4 text-red-500">Error loading companies</td>
          </tr>
        `;
  }
}

async function fetchCompanyInfo(companyName) {
  try {
    const response = await fetch(
      `/apicomp/company/get?companyName=${encodeURIComponent(companyName)}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch company info");
    }

    // Render the company information, including buttons
    renderCompanyInfo(data.company);
  } catch (error) {
    console.error(error);
    const companyInfoDiv = document.getElementById("companyInfo");
    companyInfoDiv.classList.remove("hidden"); // Show the section
    companyInfoDiv.innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

function renderCompanyInfo(company) {
  const companyInfoDiv = document.getElementById("companyInfo");

  // Remove the "hidden" class to reveal the details section
  companyInfoDiv.classList.remove("hidden");

  // Clear previous content
  companyInfoDiv.innerHTML = "";

  // Add buttons and combobox dynamically
  const buttonsHTML = `
    <div class="mb-4 flex space-x-4">
      <button
        id="button1"
        class="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        data-content="tab1Content"
      >
        Overview
      </button>
      <button
        id="button2"
        class="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        data-content="tab2Content"
      >
        Financial Data
      </button>
    </div>

    <div id="tab1Content" class="tab-content">
      <!-- Company Details -->
      <h2 class="text-xl font-bold mb-2">${company.generalInfo.companyName}</h2>
      <p><strong>Country of Exchange:</strong> ${
        company.generalInfo.countryOfExchange || "N/A"
      }</p>
      <p><strong>Country of Headquarters:</strong> ${
        company.generalInfo.countryOfHeadquarters || "N/A"
      }</p>
      <p><strong>TRBC Industry Group:</strong> ${
        company.generalInfo.trbcIndustryGroup || "N/A"
      }</p>
      <p><strong>Cf Template:</strong> ${
        company.generalInfo.cfTemplate || "N/A"
      }</p>
      <p><strong>Consolidation Basis:</strong> ${
        company.generalInfo.consolidationBasis || "N/A"
      }</p>
      <p><strong>Scaling:</strong> ${company.generalInfo.scaling || "N/A"}</p>
      <p><strong>Period:</strong> ${company.generalInfo.period || "N/A"}</p>
      <p><strong>Export Date:</strong> ${
        company.generalInfo.exportDate || "N/A"
      }</p>
    </div>

    <div id="tab2Content" class="tab-content hidden">
      <!-- Financial Chart Section -->
      <h3 class="text-lg font-bold mb-4">Select Metrics to Display in the Chart</h3>
      <select id="graphMetrics" class="w-full p-2 border rounded" multiple>
        <option value="revenueFromGoodsServices">Revenue from Goods Services</option>
        <option value="revenueFromBusinessActivitiesTotal">Revenue from Business Activities Total</option>
        <option value="costOfOperatingRevenue">Cost Of Operating Revenue</option>
        <option value="grossProfitIndustrials">Gross Profit Industrials</option>
        <option value="operatingExpensesTotal">Operating Expenses Total</option>
        <option value="operatingProfitBeforeNonRecurring">Operating Profit Before Non Recurring</option>
        <option value="incomeBeforeTaxes">Income Before Taxes</option>
        <option value="netIncomeAfterTax">Net Income After Tax</option>
        <option value="ebitda">Ebitda</option>
      </select>

      <!-- Chart Container -->
      <div style="position: relative; width: 100%; height: 16rem; max-height: 400px;">
        <canvas id="financialChart"></canvas>
      </div>
    </div>
  `;

  companyInfoDiv.innerHTML = buttonsHTML;

  const tab1Content = document.getElementById("tab1Content");
  const tab2Content = document.getElementById("tab2Content");

  // Tab switching logic
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");

  // Tab switching logic
  button1.addEventListener("click", () => {
    tab1Content.classList.remove("hidden");
    tab2Content.classList.add("hidden");

    button1.classList.add("bg-blue-500", "text-white");
    button1.classList.remove("bg-gray-200", "text-gray-600");
    button2.classList.add("bg-gray-200", "text-gray-600");
    button2.classList.remove("bg-blue-500", "text-white");
  });

  button2.addEventListener("click", () => {
    tab2Content.classList.remove("hidden");
    tab1Content.classList.add("hidden");

    button2.classList.add("bg-blue-500", "text-white");
    button2.classList.remove("bg-gray-200", "text-gray-600");
    button1.classList.add("bg-gray-200", "text-gray-600");
    button1.classList.remove("bg-blue-500", "text-white");
  });
  // Add event listener to update the chart based on metric selection
  document
    .getElementById("graphMetrics")
    .addEventListener("change", () =>
      createFinancialChart(company.financialData)
    );
}

function createFinancialChart(financialData) {
  const ctx = document.getElementById("financialChart");
  const metricsSelect = document.getElementById("graphMetrics");

  // Destroy any previously created chart instance
  if (window.financialChartInstance) {
    window.financialChartInstance.destroy();
  }

  // Get selected metrics
  const selectedMetrics = Array.from(metricsSelect.selectedOptions).map(
    (option) => option.value
  );

  if (selectedMetrics.length === 0) {
    ctx.parentNode.innerHTML =
      "<p class='text-gray-500 text-center'>Please select at least one metric to display on the chart.</p>";
    return;
  }

  const labels = financialData.map((data) => data.date);
  const datasets = selectedMetrics.map((metric) => ({
    label: metric.replace(/([A-Z])/g, " $1"),
    data: financialData.map((data) => data[metric] || 0),
    borderColor: getRandomColor(),
    tension: 0.4,
    fill: false,
  }));

  window.financialChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels, // Date labels
      datasets, // Financial data
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Flexible but safe height/width adjustment
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Values",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

function getRandomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}
