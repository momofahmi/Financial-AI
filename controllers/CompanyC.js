const Company = require('../models/Company');
const path = require('path');
const User = require('../models/User');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

// Add or Update Company Information
const addOrUpdateCompany = async (req, res) => {
    console.log('addOrUpdateCompany:', req.body);
    try {
        const { generalInfo, financialData } = req.body;

        if (!generalInfo || !generalInfo.companyName) {
            return res.status(400).json({ error: 'Company name is required in the generalInfo field.' });
        }

        // Find the company by name
        let company = await Company.findOne({ 'generalInfo.companyName': generalInfo.companyName });

        if (company) {

            // Update data in `generalInfo` only for the one provided not all and if not provided use the existing data
            company.generalInfo = {
                companyName: generalInfo.companyName || company.generalInfo.companyName,
                countryOfExchange: generalInfo.countryOfExchange || company.generalInfo.countryOfExchange,
                countryOfHeadquarters: generalInfo.countryOfHeadquarters || company.generalInfo.countryOfHeadquarters,
                trbcIndustryGroup: generalInfo.trbcIndustryGroup || company.generalInfo.trbcIndustryGroup,
                cfTemplate: generalInfo.cfTemplate || company.generalInfo.cfTemplate,
                consolidationBasis: generalInfo.consolidationBasis || company.generalInfo.consolidationBasis,
                scaling: generalInfo.scaling || company.generalInfo.scaling,
                period: generalInfo.period || company.generalInfo.period,
                exportDate: generalInfo.exportDate || company.generalInfo.exportDate,
            };
            
            

            // Update or add financial data
            if (financialData && financialData.length > 0) {
                financialData.forEach((newData) => {
                    const financialDataEntry = {
                        date: new Date(newData.date),
                        standardizedCurrency: newData.standardizedCurrency,
                        revenueFromGoodsServices: parseFloat(newData.revenueFromGoodsServices) || 0,
                        revenueFromBusinessActivitiesTotal: parseFloat(newData.revenueFromBusinessActivitiesTotal) || 0,
                        costOfOperatingRevenue: parseFloat(newData.costOfOperatingRevenue) || 0,
                        grossProfitIndustrials: parseFloat(newData.grossProfitIndustrials) || 0,
                        operatingExpensesTotal: parseFloat(newData.operatingExpensesTotal) || 0,
                        operatingProfitBeforeNonRecurring: parseFloat(newData.operatingProfitBeforeNonRecurring) || 0,
                        incomeBeforeTaxes: parseFloat(newData.incomeBeforeTaxes) || 0,
                        netIncomeAfterTax: parseFloat(newData.netIncomeAfterTax) || 0,
                        ebitda: parseFloat(newData.ebitda) || 0,
                    };

                    // Check if the date already exists in financialData
                    const existingData = company.financialData.find(
                        (data) => new Date(data.date).toISOString() === new Date(newData.date).toISOString()
                    );

                    if (existingData) {
                        // Update existing financial data
                        Object.assign(existingData, financialDataEntry);
                    } else {
                        // Add new financial data
                        company.financialData.push(financialDataEntry);
                    }
                });
            }

            // Save changes to MongoDB
            await company.save();
            return;
            //return res.status(200).json({ message: 'Company information updated successfully', company });
        }

        // If the company does not exist, create a new one
        company = new Company({
            generalInfo,
            financialData: financialData?.map((newData) => ({
                date: new Date(newData.date),
                standardizedCurrency: newData.standardizedCurrency,
                revenueFromGoodsServices: parseFloat(newData.revenueFromGoodsServices) || 0,
                revenueFromBusinessActivitiesTotal: parseFloat(newData.revenueFromBusinessActivitiesTotal) || 0,
                costOfOperatingRevenue: parseFloat(newData.costOfOperatingRevenue) || 0,
                grossProfitIndustrials: parseFloat(newData.grossProfitIndustrials) || 0,
                operatingExpensesTotal: parseFloat(newData.operatingExpensesTotal) || 0,
                operatingProfitBeforeNonRecurring: parseFloat(newData.operatingProfitBeforeNonRecurring) || 0,
                incomeBeforeTaxes: parseFloat(newData.incomeBeforeTaxes) || 0,
                netIncomeAfterTax: parseFloat(newData.netIncomeAfterTax) || 0,
                ebitda: parseFloat(newData.ebitda) || 0,
            })) || [],
        });
        await company.save();

        // Add the company to the user's list
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const idy = decoded.id;

        const user = await User.findOne({ _id: idy });
        if (!user.companies.includes(company._id)) {
            user.companies.push(company._id);
            await user.save();
        }

        return;
        //return res.status(201).json({ message: 'Company information added successfully', company });
    } catch (error) {
        console.error('Error in addOrUpdateCompany:', error.message);
        return res.status(500).json({ error: 'An error occurred while processing the request', details: error.message });
    }
};




// Upload Excel File and Process It
const uploadExcel = async (req, res) => {
    try {
        const filePath = req.file.path; // File uploaded by user
        const pythonScriptPath = path.join(__dirname, '../python_scripts/process_excel.py');
        const python = spawn('python3', [pythonScriptPath, filePath]);

        let data = '';
        python.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        python.stderr.on('data', (error) => {
            console.error('Python Error:', error.toString());
        });

        python.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Python script execution failed' });
            }

            // Parse JSON result from Python script
            const result = JSON.parse(data);
            const { general_info, financial_data } = result;

            const transformedGeneralInfo = {
                companyName: general_info['Company Name'],
                countryOfExchange: general_info['Country of Exchange'],
                countryOfHeadquarters: general_info['Country of Headquarters'],
                trbcIndustryGroup: general_info['TRBC Industry Group'],
                cfTemplate: general_info['CF Template'],
                consolidationBasis: general_info['Consolidation Basis'],
                scaling: general_info['Scaling'],
                period: general_info['Period'],
                exportDate: new Date(general_info['Export Date']),
            };

            if (!transformedGeneralInfo.companyName) {
                return res.status(400).json({ error: 'Company name is required in the Excel file.' });
            }

            // Find the company
            let company = await Company.findOne({ 'generalInfo.companyName': transformedGeneralInfo.companyName });

            if (company) {
                // Update generalInfo
                company.generalInfo = transformedGeneralInfo;

                // Update or add financial data
                financial_data.forEach((newData) => {
                    const financialDataEntry = {
                        date: new Date(newData.Date),
                        standardizedCurrency: newData['Standardized Currency'],
                        revenueFromGoodsServices: newData['Revenue from Goods & Services'],
                        revenueFromBusinessActivitiesTotal: newData['Revenue from Business Activities - Total'],
                        costOfOperatingRevenue: newData['Cost of Operating Revenue'],
                        grossProfitIndustrials: newData['Gross Profit - Industrials/Property - Total'],
                        operatingExpensesTotal: newData['Operating Expenses - Total'],
                        operatingProfitBeforeNonRecurring: newData['Operating Profit before Non-Recurring Income/Expense'],
                        incomeBeforeTaxes: newData['Income before Taxes'],
                        netIncomeAfterTax: newData['Net Income after Tax'],
                        ebitda: newData['Earnings before Interest, Taxes, Depreciation & Amortization (EBITDA)'],
                    };

                    const existingDataIndex = company.financialData.findIndex(
                        (data) => new Date(data.date).toISOString() === new Date(newData.Date).toISOString()
                    );

                    if (existingDataIndex !== -1) {
                        company.financialData[existingDataIndex] = financialDataEntry;
                    } else {
                        company.financialData.push(financialDataEntry);
                    }

                });

                // Use `updateOne` to persist changes
                await Company.updateOne(
                    { _id: company._id },
                    { $set: { generalInfo: company.generalInfo, financialData: company.financialData } }
                );
                const token = req.cookies.token;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const idy = decoded.id;
            
                const user = await User.findOne({ _id: idy });
                user.companies.push(company._id);
                await user.save();
                return res.status(200).json({ message: 'Company information updated successfully', company });
            }

            // If the company does not exist, create a new one
            company = new Company({
                generalInfo: transformedGeneralInfo,
                financialData: financial_data.map((newData) => ({
                    date: new Date(newData.Date),
                    standardizedCurrency: newData['Standardized Currency'],
                    revenueFromGoodsServices: newData['Revenue from Goods & Services'],
                    revenueFromBusinessActivitiesTotal: newData['Revenue from Business Activities - Total'],
                    costOfOperatingRevenue: newData['Cost of Operating Revenue'],
                    grossProfitIndustrials: newData['Gross Profit - Industrials/Property - Total'],
                    operatingExpensesTotal: newData['Operating Expenses - Total'],
                    operatingProfitBeforeNonRecurring: newData['Operating Profit before Non-Recurring Income/Expense'],
                    incomeBeforeTaxes: newData['Income before Taxes'],
                    netIncomeAfterTax: newData['Net Income after Tax'],
                    ebitda: newData['Earnings before Interest, Taxes, Depreciation & Amortization (EBITDA)'],
                })),
            });

            await company.save();
            const token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const idy = decoded.id;
            
            const user = await User.findOne({ _id: idy });
            console.log('user:', user);
            user.companies.push(company._id);
            await user.save();
            console.log('user:', user);
            console.log('company uploaded');
            res.status(201).json({ message: 'Company information added successfully', company });
        });
    } catch (error) {
        console.error('Error in uploadExcel:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the file', details: error.message });
    }
};


// Controller: Get Company Information
const getCompanyByName = async (req, res) => {
    try {
        const { companyName } = req.query;
        //console.log("company name", companyName);
        if (!companyName) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        // Find the company by name
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const idy = decoded.id;
         //console.log("id", idy);
        const user = await User.findOne({ _id: idy });
         //console.log("user", user);
        const companyList = await user.companies;
        //console.log('companyList:', companyList);
       // const company = await Company.find({ _id: { $in: companyList } });
       // console.log('company:', company);
       const company = await Company.findOne({ 'generalInfo.companyName': companyName, _id: { $in: companyList } });
        //console.log('company:', company);
         //console.log('companyLşist:', companyList);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        //console.log("hey yoooo")
        return res.status(200).json({
            message: 'Company information retrieved successfully',
            company,
        });
    } catch (error) {
        console.error('Error in getCompanyByName:', error.message);
        res.status(500).json({ error: 'Failed to fetch company information', details: error.message });
    }
};




// Controller: Get all user companies
const getAllUserCompanies = async (req, res) => {
  try {
    // 1. Get user ID from JWT token
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 2. Find the user and populate the 'companies' field
    const user = await User.findById(userId).populate('companies', 'generalInfo');  // or 'generalInfo.companyName'


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //console.log(user.companies);

    // 3. Return the list of all companies
    res.status(200).json(user.companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller: Delete Company Information (your existing function)
// Controller: Delete Company By Name
const deleteCompanyByName = async (req, res) => {
    try {
      const { companyName } = req.body;
      if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
      }
  
      // Get user id from token
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // 1) Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // 2) Find the company doc by name (that belongs to the user)
      const company = await Company.findOne({
        'generalInfo.companyName': companyName,
        _id: { $in: user.companies }, 
      });
      if (!company) {
        return res.status(404).json({ message: 'Company not found or does not belong to user' });
      }
  
      // 3) Delete the Company document from the database
      await Company.deleteOne({ _id: company._id });
  
      // 4) Pull the reference from the user’s companies array
      await User.updateOne(
        { _id: user._id },
        { $pull: { companies: company._id } }
      );
  
      return res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error in deleteCompanyByName:', error.message);
      return res.status(500).json({ 
        error: 'Failed to delete company information', 
        details: error.message 
      });
    }
  };
  


module.exports = {
    getAllUserCompanies,
    addOrUpdateCompany,
    uploadExcel,
    getCompanyByName,
    deleteCompanyByName,
};
