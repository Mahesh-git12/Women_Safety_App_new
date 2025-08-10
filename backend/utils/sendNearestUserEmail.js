const nodemailer = require('nodemailer');

async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
  // Debug logs for Vercel to check what's being passed
  console.log('Email Data:', {
    toEmail,
    helperName,
    senderName,
    senderEmail,
    latitude,
    longitude
  });

  // Fallbacks to avoid empty values breaking HTML
  const safeHelperName = helperName || 'Helper';
  const safeSenderName = senderName || 'Someone in need';
  const safeSenderEmail = senderEmail || 'no-reply@example.com';
  const safeLat = latitude || '0';
  const safeLng = longitude || '0';

  // Build Google Maps directions link
  const locationURL = `https://www.google.com/maps/dir/?api=1&destination=${safeLat},${safeLng}`;

  // Make sure EMAIL_USER & EMAIL_PASS exist
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('? Missing EMAIL_USER or EMAIL_PASS in environment variables.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Women Safety App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '?? SOS Alert - You were selected as a nearest helper!',
    html: `
      <p>Hi <b>${safeHelperName}</b>,</p>
      <p><b>${safeSenderName}</b> (<a href="mailto:${safeSenderEmail}">${safeSenderEmail}</a>) 
         has selected you as the nearest helper via the Women Safety App.</p>
      <p>Requester location: 
         <a href="${locationURL}" target="_blank" rel="noopener noreferrer">
         ?? Open Directions in Google Maps
         </a>
      </p>
      <p>Please check your app and respond quickly!</p>
      <hr>
      <small>This is an automated alert from Women Safety App. Replying to this email will contact the requester directly.</small>
    `,
    replyTo: safeSenderEmail
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('? Email sent:', info.response);
  } catch (error) {
    console.error('? Error sending email:', error);
  }
}

module.exports = sendNearestUserEmailNotification;


// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// async function sendNearestUserEmailNotification(toEmail, helperName, senderName, senderEmail, latitude, longitude) {
//   const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
//   const mailOptions = {
//     from: `"Women Safety App" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: 'SOS Alert ?? You were selected as a nearest helper!',
//     html: `
//       <p>Hi <b>${helperName}</b>,</p>
//       <p><b>${senderName}</b> (<a href="mailto:${senderEmail}">${senderEmail}</a>) has selected you as the nearest helper via the Women Safety App.</p>
//       <p>Requester location: <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" target="_blank">
// Open Directions in Google Maps
// </a> (${latitude}, ${longitude})</p>

//       <p>Please check your app and respond quickly!</p>
//       <hr>
//       <small>This is an automated alert from Women Safety App. Replying to this email will contact the requester directly.</small>
//     `,
//     replyTo: senderEmail
//   };
//   return transporter.sendMail(mailOptions);
// }

// module.exports = sendNearestUserEmailNotification;
