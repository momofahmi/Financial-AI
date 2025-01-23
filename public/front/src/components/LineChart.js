import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DisputedLineChart = () => {
  // Sample data for the chart
  const data = [
    { year: "2014", disputed: 5, resolved: 10 },
    { year: "2015", disputed: 8, resolved: 7 },
    { year: "2016", disputed: 6, resolved: 8 },
    { year: "2017", disputed: 9, resolved: 12 },
    { year: "2018", disputed: 7, resolved: 11 },
    { year: "2019", disputed: 9, resolved: 12 },
    { year: "2020", disputed: 7, resolved: 11 },
  ];

  // Line definitions
  const lines = [
    { key: "disputed", color: "#FF8042" },
    { key: "resolved", color: "#0088FE" },
  ];

  // Key for the x-axis
  const xKey = "year";

  // Validate props and handle edge cases
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available to display the chart.</p>;
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return (
      <p>
        No lines specified for the chart. Please provide valid line definitions.
      </p>
    );
  }

  if (!xKey) {
    return <p>No xKey provided for the chart. Please specify a valid xKey.</p>;
  }

  return (
    <div>
      <h3>Disputed and Resolved Invoices</h3>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default DisputedLineChart;
