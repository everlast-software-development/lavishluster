import nodemailer from 'nodemailer';
import { config } from './config.js';

let transporter = null;

export const mailerConfigured = () =>
  Boolean(config.smtp.host && config.inquiry.to && config.inquiry.from);

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
  }
  return transporter;
}

const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').slice(0, 200);

export async function sendInquiry(data) {
  const kind = data.type === 'consultation' ? 'Consultation request' : 'Enquiry';
  const text = [
    `${kind} from the Lavish Luster website`,
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `Subject: ${data.subject}`,
    `Consent given: ${data.consent ? 'yes' : 'no'}`,
    '',
    data.message,
  ].filter((l) => l !== null).join('\n');

  await getTransporter().sendMail({
    to: config.inquiry.to,
    from: config.inquiry.from,
    replyTo: `${oneLine(data.name)} <${data.email}>`,
    subject: `[${kind}] ${oneLine(data.subject)}`,
    text,
  });
}
