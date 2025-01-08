const OTP = require('../models/otpModel');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmails');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();

        const existingOTP = await OTP.findOne({ email });

        if (existingOTP) {
        existingOTP.otp = otp;
        await existingOTP.save();
        } else {
        await OTP.create({ email, otp });
        }

        await sendEmail({
            to: email,
            subject: 'Your OTP for verification',
            message: `Your OTP is: ${otp}`,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
          }

        if (otpRecord) {
            await User.findOneAndUpdate({ email }, { isVerified: true });
            await OTP.deleteOne({ email });
            res.status(200).json({ success: true, message: 'OTP verification successful' });
          } else {
            res.status(400).json({ success: false, error: 'Invalid OTP' });
          }
        } catch (error) {
          console.error('Error verifying OTP:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
        }
};
      
