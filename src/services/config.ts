import { IConfig } from "../types";

const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME,
  GMAIL_PASS: process.env.GMAIL_PASS,
} as IConfig;

export default config;
