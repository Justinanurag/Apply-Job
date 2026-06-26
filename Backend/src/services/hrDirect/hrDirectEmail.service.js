import { Resend } from "resend";
import axios from "axios";
import { env } from "../../config/env.js";

let resendClient = null;

const getResend = () => {
  if (!env.resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured. Add it to Backend/.env");
  }
  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }
  return resendClient;
};

const fetchResumeAttachment = async (resumeUrl, resumeName) => {
  const response = await axios.get(resumeUrl, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  const filename = resumeName || "resume.pdf";
  return {
    filename,
    content: Buffer.from(response.data).toString("base64"),
  };
};

export const sendHrApplicationEmail = async ({
  to,
  subject,
  body,
  replyTo,
  resumeUrl,
  resumeName,
}) => {
  const resend = getResend();
  const from = env.resendFromEmail || env.senderEmail;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL or SENDER_EMAIL must be configured");
  }

  const payload = {
    from: `AgentPro <${from}>`,
    to: [to],
    subject,
    text: body,
    replyTo: replyTo || from,
  };

  if (resumeUrl) {
    payload.attachments = [await fetchResumeAttachment(resumeUrl, resumeName)];
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }

  return data;
};
