const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

router.post('/check-credentials', authController.checkCredentials);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp', otpController.verifyOTP);

module.exports = router;

