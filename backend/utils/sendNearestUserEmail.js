const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your app's Gmail
    pass: process.env.EMAIL_PASS
  }
});

async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
  const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const mailOptions = {
    from: `"Women Safety App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'SOS Alert ? You were selected as a nearest helper!',
    html: `
      <p>Hi <b>${helperName}</b>,</p>
      <p><b>${senderName}</b> (<a href="mailto:${senderEmail}">${senderEmail}</a>) has selected you as the nearest helper via the Women Safety App.</p>
      <p>Requester location: <a href="${locationURL}">${latitude}, ${longitude}</a></p>
      <p>Please check your app and respond quickly!</p>
      <hr>
      <small>This is an automated alert from Women Safety App. Replying to this email will contact the requester directly.</small>
    `,
    replyTo: senderEmail // Ensures replies go right to the original requester
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendNearestUserEmailNotification;
