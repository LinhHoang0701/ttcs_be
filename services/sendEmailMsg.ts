import nodemailer from 'nodemailer';

import {confirmResetPasswordEmail, contactEmail, newsletterSubscriptionEmail, resetEmail, signupEmail, tripConfirmationEmail} from "../config/templatesEmail";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bookingbuskma@gmail.com",
    pass: "Hoanglinh123..",
  },
});

interface Message {
  subject: any;
  text: any;
}

export const sendEmail = async (email: String, type: String, host: String, data: any = undefined) => {
  try {
    const message = prepareTemplate(type, host, data);
    const config: any = {
      from: `Ve Xe Re`,
      to: email,
      subject: message.subject,
      text: message.text,
    };
    return await transporter.sendMail(config);
  } catch (error: any) {
    throw new Error(error)
  }
};

const prepareTemplate = (type: String, host: String, data: any) => {
  let message: Message;

  switch (type) {
    case "reset":
      message = resetEmail(host, data);
      break;

    case "reset-confirmation":
      message = confirmResetPasswordEmail();
      break;

    case "signup":
      message = signupEmail(data);
      break;

    case "newsletter-subscription":
      message = newsletterSubscriptionEmail();
      break;

    case "contact":
      message = contactEmail();
      break;

    case "trip-confirmation":
      message = tripConfirmationEmail(data);
      break;

    default:
      message = "" as any;
  }

  return message;
};
