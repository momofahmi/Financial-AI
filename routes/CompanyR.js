const express = require('express');
const multer = require('multer');
const {
    getAllUserCompanies,
    addOrUpdateCompany,
    uploadExcel,
    getCompanyByName,
    deleteCompanyByName,
} = require('../controllers/CompanyC');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Add or update company information manually
router.post('/company' ,addOrUpdateCompany);

// Upload Excel file and process it
router.post('/company/upload', upload.single('file'), uploadExcel);

// Route: Get Company Information
router.get('/company/get', getCompanyByName);

// Route: Delete Company Information
router.post('/company/delete', deleteCompanyByName);

router.get('/companies', getAllUserCompanies);



module.exports = router;
