import crypto from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();

export const Encrypt = (data: object | string) => {
  const bytes = crypto.AES.encrypt(
    JSON.stringify(data),
    process.env.ENCRYPTION_TOKEN!
  ).toString();
  return bytes;
};

export const Decrypt = (encryptedData: object | string) => {
  const bytes = crypto.AES.decrypt(
    JSON.stringify(encryptedData),
    process.env.ENCRYPTION_TOKEN!
  ).toString(crypto.enc.Utf8);
  if (bytes) return JSON.parse(bytes);
  return bytes;
};