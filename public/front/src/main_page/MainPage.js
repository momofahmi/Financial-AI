import "./MainPage.css";
import logo from "./../photos/pana.svg";
import { useState } from "react";
import analysisIcon from "../photos/analysis2.svg";
import adaptationIcon from "../photos/adaptation.svg";
import integrationIcon from "../photos/integration2.svg";
import reportingIcon from "../photos/reporting3.svg";
import NavigationBar from "../navigation_bar/NavigationBar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const MainPage = ({ openSignupModal, openSigninModal, goToDashboard }) => {
  const pieData = [
    { name: "Scenario Planning", value: 30 },
    { name: "AI Predictions", value: 25 },
    { name: "Real-Time Insights", value: 20 },
    { name: "Risk Assessment", value: 25 },
  ];

  const barData1 = [
    { name: "Scenario Planning", Value: 50 },
    { name: "AI Predictions", Value: 70 },
    { name: "Real-Time Insights", Value: 60 },
    { name: "Risk Assessment", Value: 80 },
  ];

  const barData2 = [
    { name: "Accuracy", Value: 90 },
    { name: "Efficiency", Value: 80 },
    { name: "Speed", Value: 85 },
    { name: "Coverage", Value: 75 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="main-page">
      <main className="hero-section">
        <div className="hero-text">
          <h1>Empower Your Financial Future with AI-Driven Insights</h1>
        </div>
        <div className="hero-image">
          <img src={logo} alt="logo" />
        </div>
      </main>
      <section className="why-financial-ai">
        <h2>WHY FINANCIAL AI?</h2>
        <ul className="features-list">
          <li>
            The app assists users in creating and tracking budget plans. It uses
            financial data to provide insights into income, expenses, and cash
            flow, helping businesses manage their finances effectively.
          </li>
          <li>
            The app enables businesses to perform scenario analysis by
            forecasting best-case, worst-case, and likely outcomes. This helps
            companies plan for different financial conditions and make
            adjustments as needed.
          </li>
          <li>
            Employs advanced machine learning methods, including linear
            regression, decision trees, random forests, gradient boosting
            machines, neural networks, and reinforcement learning for more
            accurate cash flow predictions.
          </li>
          <li>
            The app can incorporate external economic indicators, industry
            trends, and company-specific factors to improve forecasting
            accuracy.
          </li>
          <li>
            It leverages various forecasting techniques such as straight-line
            forecasting, time series models, and AI-based models.
          </li>
        </ul>
      </section>
      {/* Updated Features Section */}
      <section className="features-of-financial-ai">
        <h2>FEATURES OF FINANCIAL AI</h2>
        <div className="charts-container">
          {/* Chart 1 */}
          <div className="chart-item">
            <h3>Feature Distribution</h3>
            <p>
              Each feature contributes to the app's ability to provide accurate
              financial insights. Scenario Planning and AI Predictions are major
              contributors.
            </p>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          {/* Chart 2 */}
          <div className="chart-item">
            <h3>Feature Strengths</h3>
            <p>
              Features like Risk Assessment and AI Predictions demonstrate
              strong performance metrics, ensuring optimal decision-making.
            </p>
            <BarChart
              width={300}
              height={300}
              data={barData1}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Value" fill="#82ca9d" />
            </BarChart>
          </div>
          {/* Chart 3 */}
          <div className="chart-item">
            <h3>Performance Metrics</h3>
            <p>
              Financial AI excels in accuracy, efficiency, and speed, offering
              superior performance compared to traditional models.
            </p>
            <PieChart width={300} height={300}>
              <Pie
                data={barData2}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#82ca9d"
                dataKey="Value"
              >
                {barData2.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          {/* Chart 4 */}
          <div className="chart-item">
            <h3>Performance Comparison</h3>
            <p>
              Comparing multiple features, accuracy and speed stand out as the
              top-performing aspects of Financial AI.
            </p>
            <BarChart
              width={300}
              height={300}
              data={barData2}
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Value" fill="#FFBB28" />
            </BarChart>
          </div>
        </div>
      </section>
      <section className="how-it-works">
        <h2>HOW IT WORKS</h2>
        <div className="steps-container">
          <div className="step">
            <img src={analysisIcon} alt="Preliminary Analysis" />
            <h3>Preliminary Analysis</h3>
            <p>We analyze your company structure and operations.</p>
          </div>
          <div className="step">
            <img src={adaptationIcon} alt="Adaptation" />
            <h3>Adaptation</h3>
            <p>Data belonging to company units are matched.</p>
          </div>
          <div className="step">
            <img src={integrationIcon} alt="Installation & Integration" />
            <h3>Installation & Integration</h3>
            <p>Installation training is provided to all business units.</p>
          </div>
          <div className="step">
            <img src={reportingIcon} alt="Reporting" />
            <h3>Reporting</h3>
            <p>Check your dashboards live on your reporting screens.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
