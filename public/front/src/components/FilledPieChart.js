import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "30 Days", value: 25, color: "#FB8C00" },
  { name: "60 Days", value: 10, color: "#E53935" },
  { name: "90 Days", value: 30, color: "#1E88E5" },
  { name: "90+ Days", value: 35, color: "#43A047" },
];

const FulledPieChart = () => {
  return (
    <PieChart width={250} height={250}>
      <Pie data={data} cx="50%" cy="50%" radius={1} dataKey="value">
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default FulledPieChart;
