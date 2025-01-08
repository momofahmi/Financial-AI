const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    generalInfo: {
        companyName: { type: String, required: true }, // This is required
        countryOfExchange: { type: String },
        countryOfHeadquarters: { type: String },
        trbcIndustryGroup: { type: String },
        cfTemplate: { type: String },
        consolidationBasis: { type: String },
        scaling: { type: String },
        period: { type: String },
        exportDate: { type: Date },
    },
    financialData: [
        {
            date: { type: Date },
            standardizedCurrency: { type: String },
            revenueFromGoodsServices: { type: Number },
            revenueFromBusinessActivitiesTotal: { type: Number },
            costOfOperatingRevenue: { type: Number },
            grossProfitIndustrials: { type: Number },
            operatingExpensesTotal: { type: Number },
            operatingProfitBeforeNonRecurring: { type: Number },
            incomeBeforeTaxes: { type: Number },
            netIncomeAfterTax: { type: Number },
            ebitda: { type: Number },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
