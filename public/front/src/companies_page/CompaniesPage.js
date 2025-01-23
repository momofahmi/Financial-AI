import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CompaniesPage.css";
import CompanyDetails from "./CompanyDetails";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]); // State to store companies
  const [sectors, setSectors] = useState([]); // State to store unique sectors
  const [selectedSector, setSelectedSector] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch companies data on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/company/getAll"
        );
        setCompanies(response.data); // Set the fetched companies
        // Extract unique sectors
        const uniqueSectors = Array.from(
          new Set(response.data.map((company) => company.generalInfo.sector))
        );
        setSectors(uniqueSectors);
        setError(null);
      } catch (err) {
        setError("Failed to fetch companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSectorChange = (event) => {
    const sector = event.target.value;
    setSelectedSector(sector);
    setSearchTerm(""); // Reset search term when sector changes
  };

  const filteredCompanies = companies.filter((company) => {
    return (
      (!selectedSector || company.generalInfo.sector === selectedSector) &&
      company.generalInfo.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const handleShowDetails = (company) => {
    setSelectedCompany(company);
  };

  const handleCloseDetails = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="companies-page-container">
      <div>
        <label htmlFor="sector-select">Select Company Sector:</label>
        <select id="sector-select" onChange={handleSectorChange}>
          <option value="">--Select Company Sector To See Companies--</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {selectedSector && (
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      )}

      {loading && <p>Loading companies...</p>}
      {error && <p className="error">{error}</p>}

      {filteredCompanies.length > 0 && selectedSector && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Revenue</th>
                <th>Gross Profit</th>
                <th>Company Quarter Growth</th>
                <th>Sector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr key={index}>
                  <td>{company.generalInfo.companyName}</td>
                  <td>
                    {
                      company.financialData.at(company.financialData.length - 1)
                        .revenueFromGoodsServices
                    }
                  </td>
                  <td>
                    {
                      company.financialData.at(company.financialData.length - 1)
                        .grossProfitIndustrials
                    }
                  </td>
                  <td>{company.generalInfo.growth}</td>
                  <td>{company.generalInfo.sector}</td>
                  <td>
                    <button onClick={() => handleShowDetails(company)}>
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedCompany && (
            <CompanyDetails
              company={selectedCompany}
              onClose={handleCloseDetails}
            />
          )}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && selectedSector && (
        <p>No companies found for the selected sector.</p>
      )}
    </div>
  );
};

export default CompaniesPage;
