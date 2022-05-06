exports.resetEmail = (host: String, resetToken: String) => {
    const message = {
      subject: "Reset Password",
      text:
        `${
          "You are receiving this because you have requested to reset your password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://"
        }${host}/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
  
    return message;
  };
  
  exports.confirmResetPasswordEmail = () => {
    const message = {
      subject: "Password Changed",
      text:
        `You are receiving this email because you changed your password. \n\n` +
        `If you did not request this change, please contact us immediately.`,
    };
  
    return message;
  };
  
  
  exports.signupEmail = (name: any) => {
    const message = {
      subject: "Account Registration",
      text: `Hi ${name.firstName} ${name.lastName}! Thank you for creating an account with us!.`,
    };
  
    return message;
  };
  
  exports.newsletterSubscriptionEmail = () => {
    const message = {
      subject: "Newsletter Subscription",
      text:
        `You are receiving this email because you subscribed to our newsletter. \n\n` +
        `If you did not request this change, please contact us immediately.`,
    };
  
    return message;
  };
  
  exports.contactEmail = () => {
    const message = {
      subject: "Contact Us",
      text: `We received your message! Our team will contact you soon. \n\n`,
    };
  
    return message;
  };
  
  
  exports.tripConfirmationEmail = (trip: any) => {
    const message = {
      subject: `Trip Confirmation ${trip._id}`,
      text:
        `Hi ${trip.user.firstName}! Thank you for your trip!. \n\n` +
        `We've received your trip and will contact you as soon as your package is shipped. \n\n`,
    };
  
    return message;
  };
  