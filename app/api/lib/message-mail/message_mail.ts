import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export async function SendMessage(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_API_KEY,
    },
  });

  await transporter.sendMail({
    from: " Buyit <seanimayi@10518424.brevosend.com>",
    to,
    subject,
    text,
  });
}
