import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const companies = [
    {
      id: 1,
      generalInfo: {
        companyName: "Tech Corp",
        countryOfExchange: "USA",
        countryOfHeadquarters: "USA",
        trbcIndustryGroup: "Technology",
        cfTemplate: "Template 1",
        consolidationBasis: "Full",
        scaling: "Large",
        period: "Annual",
        exportDate: "2024-12-01T00:00:00Z",
        growth: "15%",
        sector: "Finance",
      },
      financialData: [
        {
          date: "2020-01-01",
          revenueFromGoodsServices: 5000,
          asd: 500,
          grossProfitIndustrials: 2000,
        },
        {
          date: "2021-01-01",
          revenueFromGoodsServices: 5500,
          asd: 550,
          grossProfitIndustrials: 2500,
        },
      ],
    },
    {
      id: 2,
      generalInfo: {
        companyName: "Finance Inc.",
        countryOfExchange: "UK",
        countryOfHeadquarters: "UK",
        trbcIndustryGroup: "Finance",
        cfTemplate: "Template 2",
        consolidationBasis: "Partial",
        scaling: "Medium",
        period: "Quarterly",
        exportDate: "2024-11-01T00:00:00Z",
        growth: "7%",
        sector: "Automobile",
      },
      financialData: [
        {
          date: "2020-01-01",
          revenueFromGoodsServices: 3000,
          asd: 300,
          grossProfitIndustrials: 1500,
        },
        {
          date: "2021-01-01",
          revenueFromGoodsServices: 3200,
          asd: 350,
          grossProfitIndustrials: 1600,
        },
      ],
    },
    {
      id: 3,
      generalInfo: {
        companyName: "a",
        countryOfExchange: "USA",
        countryOfHeadquarters: "USA",
        trbcIndustryGroup: "Technology",
        cfTemplate: "Template 1",
        consolidationBasis: "Full",
        scaling: "Large",
        period: "Annual",
        exportDate: "2024-12-01T00:00:00Z",
        growth: "22%",
        sector: "Finance",
      },
      financialData: [
        {
          date: "2020-01-01",
          revenueFromGoodsServices: 7000,
          asd: 700,
          grossProfitIndustrials: 3000,
        },
        {
          date: "2021-01-01",
          revenueFromGoodsServices: 7500,
          asd: 750,
          grossProfitIndustrials: 3500,
        },
      ],
    },
  ];

  const growthLeaderboard = [...companies]
    .sort(
      (a, b) =>
        parseFloat(b.generalInfo.growth.replace("%", "")) -
        parseFloat(a.generalInfo.growth.replace("%", ""))
    )
    .slice(0, 10);

  const revenueLeaderboard = [...companies]
    .map((company) => ({
      ...company,
      revenue2021: company.financialData.find((data) =>
        data.date.startsWith("2021")
      ).revenueFromGoodsServices,
    }))
    .sort((a, b) => b.revenue2021 - a.revenue2021)
    .slice(0, 10);

  const grossProfitLeaderboard = [...companies]
    .map((company) => ({
      ...company,
      grossProfit2021: company.financialData.find((data) =>
        data.date.startsWith("2021")
      ).grossProfitIndustrials,
    }))
    .sort((a, b) => b.grossProfit2021 - a.grossProfit2021)
    .slice(0, 10);

  const renderLeaderboard = (title, leaderboard, metricKey, metricLabel) => (
    <div className="leaderboard">
      <h2 className="leaderboard-title">{title}</h2>
      <div className="leaderboard-list">
        {leaderboard.map((company, index) => (
          <div key={index} className={`leaderboard-item rank-${index + 1}`}>
            <span className="company-rank">{index + 1}.</span>
            <span className="company-name">
              {company.generalInfo.companyName}
            </span>
            <span className="company-metric">
              {metricLabel}: {company[metricKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-row">
        {renderLeaderboard(
          "Growth Leaderboard",
          growthLeaderboard,
          "generalInfo.growth",
          "Growth"
        )}
        {renderLeaderboard(
          "Revenue Leaderboard",
          revenueLeaderboard,
          "revenue2021",
          "Revenue (2021)"
        )}
        {renderLeaderboard(
          "Gross Profit Leaderboard",
          grossProfitLeaderboard,
          "grossProfit2021",
          "Gross Profit (2021)"
        )}
      </div>
    </div>
  );
};

export default Dashboard;
