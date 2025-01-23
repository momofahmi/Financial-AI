import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Jan 01", AP: 400, AR: 30 },
  { name: "Jan 03", AP: 600, AR: 50 },
  { name: "Jan 05", AP: 200, AR: 20 },
  { name: "Jan 07", AP: 500, AR: 40 },
  { name: "Jan 09", AP: 700, AR: 35 },
  { name: "Jan 11", AP: 300, AR: 15 },
];

const CustomBarChart = () => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="AP" fill="#8884d8" />
    <Bar dataKey="AR" fill="#82ca9d" />
  </BarChart>
);

export default CustomBarChart;
