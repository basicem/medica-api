const sgMail = require("@sendgrid/mail");

const sendEmailSendgrid = async (to, from, subject, text, html) => {
  try {
    await sgMail.send({
      to, from, subject, text, html
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendEmailConsole = async (to, from, subject, text, html) => {
  console.log("Console email backend: ", to, from, subject, text, html);
};

const emailBackendFactory = () => {
  const backend = process.env.EMAIL_BACKEND;
  switch (backend) {
    case "console":
      return sendEmailConsole;
    case "sendgrid":
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      return sendEmailSendgrid;
    default:
      throw new Error(`Invalid email backend: ${backend}`);
  }
};

const sendEmail = emailBackendFactory();

module.exports = { sendEmail };
