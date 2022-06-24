import nodemailer from "nodemailer";
import config from "./config";
const { GMAIL_USERNAME, GMAIL_PASS } = config;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASS,
  },
});

export default async (email: string, code: number) => {
  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: email,
      subject: "Paparazzo verification code",
      text: `${code} is your verification code for paparazzo registration`,
    });

    console.log("Mail sent: ", info.messageId);
    return { data: "Success", error: null };
  } catch (error) {
    console.log("error sending mail", error);
    return { data: null, error };
  }
};
