import crypto from "crypto-js";

export const Encrypt = (data) => {
  const bytes = crypto.AES.encrypt(
    JSON.stringify(data),
    process.env.ENCRYPTION_TOKEN
  ).toString();
  return bytes;
};

export const Decrypt = (encryptedData) => {
  const bytes = crypto.AES.decrypt(
    encryptedData,
    process.env.ENCRYPTION_TOKEN
  ).toString(crypto.enc.Utf8);
  if (bytes) return JSON.parse(bytes);
  return bytes;
};