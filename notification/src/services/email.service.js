import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 1,
  maxMessages: 20,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({ email, name }) => {
  const { welcomeTemplate } = await import("../templates/welcome.template.js");

  const template = welcomeTemplate(name);

  return transporter.sendMail({
    from: config.EMAIL_USER,
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendPaymentEmail = async ({
  email,
  name,
  orderId,
  amount,
  currency,
}) => {
  const { paymentTemplate } = await import("../templates/payment.template.js");

  const template = paymentTemplate({
    name,
    orderId,
    amount,
    currency,
  });

  return transporter.sendMail({
    from: config.EMAIL_USER,
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

export default transporter;
