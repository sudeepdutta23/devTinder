// mailer.js
const nodemailer = require('nodemailer');

// 1. Create a transporter
const Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.APP_GMAIL_EMAIL, // your Gmail
    pass: process.env.APP_GMAIL_PASSWORD    // your 16-char App Password
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.APP_GMAIL_EMAIL,
    to,
    subject,
    text
  };

  Transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
}

module.exports = { sendEmail };
