import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export const sendPasswordResetOtp = async ({ to, name, otp }) => {
  await transporter.sendMail({
    from: `"AgentPro" <${env.senderEmail}>`,
    to,
    subject: "Your password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hi ${name || "there"},</p>
        <p>Use this OTP to reset your AgentPro password. It expires in 15 minutes.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #7c3aed;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Your AgentPro password reset OTP is ${otp}. It expires in 15 minutes.`,
  });
};
