import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import { LoginMiddleware } from "../Middleware/LoginMiddleware.js";
import RegisterModel from "../Model/register-model.js";
import { Encrypt } from "../Cryptography/crypto.js";
const router = express.Router();
// JWT => { Username: string; _id: string; }

const CheckPasswordHash = async (password, hashedPassword) => {
  const data = await bcrypt.compare(password, hashedPassword);
  return data;
};

const CheckFromDB = async (Username, Password) => {
  const response = await RegisterModel.find({ Username });
  if (response) {
    const PasswordCheck = await CheckPasswordHash(Password, response.Password);
    if (PasswordCheck) {
      return { status: true, id: response._id };
    }
    return { status: false, id: null };
  }
  return { status: false, id: null };
};

const Create_JWT_Token = (data) => {
  const token = jwt.sign(JSON.stringify(data), process.env.JWT_AUTH_TOKEN, {
    expiresIn: 86400,
    algorithm: "RS512",
  });
  return token;
};

router.post("/", LoginMiddleware, async (req, res) => {
  let { Username, Password } = req.body;
  const statusCode = await CheckFromDB(Username, Password);
  if (statusCode.status) {
    const authToken = Create_JWT_Token({ Username, _id: statusCode.id });
    const EncryptedData = Encrypt({
      authToken,
      userID: statusCode.id
    });
    return res.json({ Enc: EncryptedData, Error: false });
  } else {
    return res.json({ Error: true });
  }
});

export default router;
