import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import RegisterModel from "../Model/register-model.js";
import { Encrypt } from "../Cryptography/crypto.js";
import { SignupMiddleware } from "../Middleware/SignupMiddleware.js";
const router = express.Router();

const HashPassword = async (Password) => {
  const hash = await bcrypt.hash(Password, 10);
  return hash;
};

const GenerateAuthToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_AUTH_TOKEN, {
    expiresIn: 84600,
    algorithm: "RS512",
  });
  return token;
};

router.post("/", SignupMiddleware, async (req, res) => {
  let { Username, Password } = req.body;
  Password = HashPassword(Password);
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
  const responseConfig = { token, userID: postResponse._id };
  const EncryptedResponseConfig = Encrypt(responseConfig);
  return res.json({ Enc: EncryptedResponseConfig });
});

export default router;
