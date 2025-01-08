const { SMTPClient } = require('emailjs');

const SMPT_HOST = "smtp.mailersend.net";
const SMPT_PORT = "587";
const SMPT_MAIL = "MS_XUBRKF@trial-pq3enl6oqw0l2vwr.mlsender.net";
const SMPT_APP_PASS = "Xdv3TNpMAxsBeYo2";

const sendEmail = async (options) => {
  console.log("Sending email with emailjs.", options.message);
  try {
    const client = new SMTPClient({
      user: SMPT_MAIL,
      password: SMPT_APP_PASS,
      host: SMPT_HOST,
      port: SMPT_PORT,
      timeout: 10000,
      tls: true,
      debug: true,
      authentication: ['LOGIN'],
    });

    const messageToSend = {
      from: SMPT_MAIL,
      to: options.to,
      subject: options.subject,
      text: options.message,
    };

    //await client.sendAsync(messageToSend);
    //console.log("Email sent successfully using emailjs.");
  } catch (error) {
    console.error("Error sending email with emailjs:", error);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;

