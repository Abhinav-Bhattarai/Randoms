import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import RegisterModel from "../Model/register-model.js";
import { Encrypt } from "../Cryptography/crypto.js";
import { SignupMiddleware } from "../Middleware/SignupMiddleware.js";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const HashPassword = async (Password) => {
  const hash = await bcrypt.hash(Password, 10);
  return hash;
};

export const GenerateAuthToken = (data) => {
  const token = jwt.sign(JSON.stringify(data), process.env.JWT_AUTH_TOKEN);
  return token;
};

router.post("/", SignupMiddleware, async (req, res) => {
  // try {
    let { Username, Password } = req.body;
    Password = await HashPassword(Password);
    const config = {
      Username,
      Password
    };
    const postData = new RegisterModel(config);
    const postResponse = await postData.save();
    const tokenConfig = {
      Username: postResponse.Username,
      _id: postResponse._id,
    }
    const token = GenerateAuthToken(tokenConfig);
    const responseConfig = { authToken: token, userID: postResponse._id };
    const EncryptedResponseConfig = Encrypt(responseConfig);
    return res.json({ Enc: EncryptedResponseConfig, Error: false });
  // } catch {
  //   return res.json({ Error: true });
  // }
});


export default router;
