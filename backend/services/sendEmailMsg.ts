const nodemailer = require("nodemailer");

const template = require("../config/templatesEmail");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hoanglinhphal@gmail.com",
    pass: "Hoanglinh123",
  },
});

exports.sendEmail = async (email: String, type: String, host: String, data: any) => {
  try {
    const message = prepareTemplate(type, host, data);
    const config = {
      from: `Ve Xe Re>`,
      to: email,
      subject: message.subject,
      text: message.text,
    };
    return await transporter.sendMail(config);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const prepareTemplate = (type: String, host: String, data: any) => {
  let message;

  switch (type) {
    case "reset":
      message = template.resetEmail(host, data);
      break;

    case "reset-confirmation":
      message = template.confirmResetPasswordEmail();
      break;

    case "signup":
      message = template.signupEmail(data);
      break;

    case "newsletter-subscription":
      message = template.newsletterSubscriptionEmail();
      break;

    case "contact":
      message = template.contactEmail();
      break;

    case "trip-confirmation":
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = "";
  }

  return message;
};
