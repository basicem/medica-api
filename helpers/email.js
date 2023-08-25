const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

async function sendEmail({
  toEmail, subject, d, type
}) {
  const source = fs.readFileSync(`templates/${type}.handlebars`, "utf8");
  const template = handlebars.compile(source);
  const html = template(d);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: toEmail,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
