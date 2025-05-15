import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { getVerificationEmail } from "./emailTemplate";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // Use App Password!
  },
});

export async function sendVerificationEmail(name: string, email: string, verificationCode: string) {
  const html = getVerificationEmail(name, verificationCode);
  const info = await transporter.sendMail({
    from: `"ACM Thapar Student Chapter" <${process.env.SMTP_EMAIL}>`, // Proper formatting
    to: email,
    subject: "Verify your Account!",
    html
  });

  console.log("Message sent: %s", info.messageId);
}

