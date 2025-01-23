import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DragAndDrop from "../components/DragAndDrop";
import DisputedLineChart from "../components/LineChart";
import "./Forecast.css";

const Forecast = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState("");
  const [chartData, setChartData] = useState([]);
  const [resultOptions, setResultOptions] = useState([]);

  const handleFileUpload = (data) => {
    // Simulate backend call to fetch results based on uploaded data
    // Replace this with a real API call
    const simulatedResults = [
      {
        label: "Revenues",
        data: [
          { year: "2014", Value: 100 },
          { year: "2015", Value: 105 },
          { year: "2016", Value: 119 },
          { year: "2017", Value: 123 },
          { year: "2018", Value: 135 },
          { year: "2019", Value: 128 },
          { year: "2020", Value: 142 },
          { year: "2021", Value: 141 },
          { year: "2022", Value: 154 },
          { year: "2023", Value: 172 },
          { year: "2024", Value: 158 },
          { year: "2025", Value: 168, Prediction: 168 },
          { year: "2026", Prediction: 176 },
          { year: "2027", Prediction: 182 },
          { year: "2028", Prediction: 193 },
        ],
      },
      {
        label: "Operating Profit",
        data: [
          { year: "2014", Value: 65 },
          { year: "2015", Value: 75 },
          { year: "2016", Value: 130 },
          { year: "2017", Value: 140 },
          { year: "2018", Value: 150 },
          { year: "2019", Value: 145 },
          { year: "2020", Value: 155 },
          { year: "2021", Value: 160 },
          { year: "2022", Value: 170 },
          { year: "2023", Value: 180 },
          { year: "2024", Value: 170 },
          { year: "2025", Value: 180, Prediction: 180 },
          { year: "2026", Prediction: 190 },
          { year: "2027", Prediction: 200 },
          { year: "2028", Prediction: 210 },
        ],
      },
    ];

    setResultOptions(simulatedResults);
    setActiveStep(1);
  };

  const handleResultSelect = (event) => {
    const selected = event.target.value;
    setSelectedResult(selected);
    const selectedData =
      resultOptions.find((result) => result.label === selected)?.data || [];
    setChartData(selectedData);
  };

  const steps = ["Upload File", "View Forecast"];

  return (
    <div className="forecast-container">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <div className="step-content">
          <h4>Upload your Excel file to generate forecasts</h4>
          <DragAndDrop
            setLoading={setIsLoading}
            onFileUpload={handleFileUpload}
          />
        </div>
      )}

      {activeStep === 1 && (
        <div className="step-content">
          <FormControl fullWidth>
            <InputLabel id="result-select-label">Select Result</InputLabel>
            <Select
              labelId="result-select-label"
              value={selectedResult}
              onChange={handleResultSelect}
            >
              {resultOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {chartData.length > 0 && (
            <div className="chart-container">
              <DisputedLineChart
                data={chartData}
                xKey="year"
                lines={[
                  { key: "Value", color: "#4A90E2" },
                  { key: "Prediction", color: "#FF5733" },
                ]}
              />
            </div>
          )}

          <Button
            className="back-button"
            variant="contained"
            color="primary"
            onClick={() => setActiveStep(0)}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default Forecast;
