import React, { useState, useMemo } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  ListItemText,
  Select,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CompanyDetails = ({ company, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [financialDataForDate, setFinancialDataForDate] = useState(null); // State for financial data at selected date

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const { generalInfo, financialData } = company;

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const generateColor = (index) => {
    const colors = ["#FF8042", "#00C49F", "#0088FE", "#FFBB28", "#FF4444"];
    return colors[index % colors.length];
  };

  const availableMetrics = useMemo(() => {
    if (!financialData || financialData.length === 0) return [];
    const sampleData = financialData[0];
    return Object.keys(sampleData)
      .filter((key) => key !== "date")
      .map((key, index) => ({
        key: key,
        label: formatKey(key),
        color: generateColor(index),
      }));
  }, [financialData]);

  const handleMetricChange = (event) => {
    setSelectedMetrics(event.target.value);
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    const dataForDate = financialData.find((data) => data.date === date);
    setFinancialDataForDate(dataForDate || null);
  };

  const availableDates = financialData.map((data) => data.date);

  return (
    <div className="company-details-container">
      <div className="company-header">
        <h2>{generalInfo.companyName}</h2>
      </div>
      <AppBar position="static">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Financials" />
          <Tab label="Key Metrics" />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0} className="tab-content">
        <h3>Company Overview</h3>
        {Object.entries(generalInfo).map(([key, value]) => (
          <p key={key}>
            <strong>{formatKey(key)}:</strong> {value || "N/A"}
          </p>
        ))}
      </TabPanel>
      <TabPanel value={activeTab} index={1} className="tab-content">
        <h3>Financial Snapshot</h3>
        <FormControl style={{ marginBottom: "1rem", minWidth: 200 }}>
          <InputLabel>Metrics</InputLabel>
          <Select
            multiple
            value={selectedMetrics}
            onChange={handleMetricChange}
            renderValue={(selected) =>
              availableMetrics
                .filter((metric) => selected.includes(metric.key))
                .map((metric) => metric.label)
                .join(", ")
            }
          >
            {availableMetrics.map((metric) => (
              <MenuItem key={metric.key} value={metric.key}>
                <Checkbox checked={selectedMetrics.includes(metric.key)} />
                <ListItemText primary={metric.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LineChart
          width={600}
          height={300}
          data={financialData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {availableMetrics
            .filter((metric) => selectedMetrics.includes(metric.key))
            .map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
              />
            ))}
        </LineChart>
      </TabPanel>
      <TabPanel value={activeTab} index={2} className="tab-content">
        <h3>Select Financial Date</h3>

        <FormControl style={{ marginBottom: "1rem", minWidth: 200 }}>
          <Select value={selectedDate} onChange={handleDateChange} displayEmpty>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {availableDates.map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {financialDataForDate && (
          <div>
            <h4>Financial Data for {selectedDate}</h4>
            {Object.entries(financialDataForDate).map(([key, value]) => (
              <p key={key}>
                <strong>{formatKey(key)}:</strong> {value || "N/A"}
              </p>
            ))}
          </div>
        )}
      </TabPanel>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className="tab-content">
          {children}
        </Box>
      )}
    </div>
  );
};

export default CompanyDetails;
