import crypto from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();

export const Encrypt = (data: object | string) => {
  console.log(data);
  const bytes = crypto.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_ENCRYPTION_TOKEN!
  ).toString();
  console.log(bytes);
  return bytes;
};

export const Decrypt = (encryptedData: string) => {
  const bytes = crypto.AES.decrypt(
    encryptedData,
    process.env.REACT_APP_ENCRYPTION_TOKEN!
  ).toString(crypto.enc.Utf8);
  if (bytes) return JSON.parse(bytes);
  return bytes;
};