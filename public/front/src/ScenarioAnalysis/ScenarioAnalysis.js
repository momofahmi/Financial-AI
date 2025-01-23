import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ScenarioAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ScenarioAnalysis = () => {
  const companies = [
    {
      generalInfo: {
        companyName: "Tech Innovators",
        countryOfExchange: "USA",
        countryOfHeadquarters: "USA",
        trbcIndustryGroup: "Technology",
        cfTemplate: "Template A",
        consolidationBasis: "Standalone",
        scaling: "Large",
        period: "2023",
        exportDate: "2023-12-31",
      },
      financialData: [
        {
          date: "2023-01-01",
          revenueFromGoodsServices: 5000,
          grossProfitIndustrials: 2000,
        },
        {
          date: "2023-02-01",
          revenueFromGoodsServices: 5500,
          grossProfitIndustrials: 2500,
        },
      ],
    },
    // companiess....
  ];

  const [selectedCompany, setSelectedCompany] = useState("");
  const [chartData, setChartData] = useState(null);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setChartData(null);
  };

  const generateReport = () => {
    const company = companies.find(
      (c) => c.generalInfo.companyName === selectedCompany
    );

    if (company && company.financialData) {
      const labels = company.financialData.map((data) =>
        new Date(data.date).toLocaleDateString()
      );

      const dataset = Object.keys(company.financialData[0])
        .filter((key) => key !== "date")
        .map((key, index) => ({
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          data: company.financialData.map((data) => data[key]),
          borderColor: `hsl(${(index * 100) % 360}, 70%, 50%)`,
          borderWidth: 2,
          fill: false,
        }));

      setChartData({
        labels,
        datasets: dataset,
      });
    } else {
      alert("Please select a company with available financial data.");
    }
  };

  return (
    <div className="scenario-analysis">
      <div className="scenario-header">
        <h1>Company Analysis</h1>
      </div>
      <select
        className="scenario-select"
        value={selectedCompany}
        onChange={handleCompanyChange}
      >
        <option value="" disabled>
          Select a Company
        </option>
        {companies.map((company) => (
          <option
            key={company.generalInfo.companyName}
            value={company.generalInfo.companyName}
          >
            {company.generalInfo.companyName}
          </option>
        ))}
      </select>

      {selectedCompany && (
        <div className="scenario-content">
          <div className="scenario-details card">
            <h2>{selectedCompany} Overview</h2>
            <p>
              <strong>Attributes:</strong>
            </p>
            <table>
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  companies.find(
                    (c) => c.generalInfo.companyName === selectedCompany
                  ).generalInfo
                ).map(([key, value], index) => (
                  <tr key={index}>
                    <td>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </td>
                    <td>{value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {chartData && (
            <div className="scenario-chart card">
              <h3>Financial Trends</h3>
              <Line data={chartData} />
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <button className="generate-report-button" onClick={generateReport}>
          Generate
        </button>
      </div>
    </div>
  );
};

export default ScenarioAnalysis;
