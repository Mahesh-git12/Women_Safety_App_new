const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password (not your main password!)
  },
});

async function sendEmail({ to, subject, text }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
