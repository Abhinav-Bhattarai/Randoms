import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
import { LoginMiddleware } from "../Middleware/LoginMiddleware.js";
import RegisterModel from "../Model/register-model.js";
import { Encrypt } from "../Cryptography/crypto.js";
import { GenerateAuthToken } from "./signup.js";
const router = express.Router();

const CheckPasswordHash = async (password, hashedPassword) => {
  const data = await bcrypt.compare(password, hashedPassword);
  console.log(data);
  return data;
};

const CheckFromDB = async (Username, Password) => {
  const response = await RegisterModel.findOne({ Username });
  if (response) {
    console.log(response);
    const PasswordCheck = await CheckPasswordHash(Password, response.Password);
    if (PasswordCheck) {
      return { status: true, id: response._id };
    }
    return { status: false, id: null };
  }
  return { status: false, id: null };
};


router.post("/", LoginMiddleware, async (req, res) => {
  let { Username, Password } = req.body;
  console.log(req.body);
  const statusCode = await CheckFromDB(Username, Password);
  if (statusCode.status) {
    const authToken = GenerateAuthToken({ Username, _id: statusCode.id });
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
