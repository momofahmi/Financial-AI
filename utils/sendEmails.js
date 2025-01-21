require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your App Password
    },
});

const sendEmail = async (options) => {
    console.log("📤 Sending email with Nodemailer...", options.message);

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.message,
        });

        console.log("✅ Email sent successfully:", info);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email.");
    }
};

module.exports = sendEmail;
