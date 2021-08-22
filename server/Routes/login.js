import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
import { LoginMiddleware } from '../Middleware/LoginMiddleware.js';
import RegisterModel from '../Model/register-model.js';
const router = express.Router();
// JWT => { Username: string; _id: string; }

const CheckPasswordHash = async(password, hashedPassword) => {
    const data = await bcrypt.compare(password, hashedPassword);
    if(data) return data;
}

const CheckFromDB = async(Username, Password) => {
    const response = await RegisterModel.find({Username});
    if (response){
        if (response.Password === Password){
            return { status: true, data: { _id: response._id, Password: response.Password } };
        }
        return { status: false, data: null };
    }
    return { status: false, data: null };
};

const Create_JWT_Token = (data) => {
    const token = jwt.sign(JSON.stringify(data), process.env.JWT_AUTH_TOKEN);
    return token;
}

router.post('/', LoginMiddleware, async(req, res) => {
    let { Username, Password } = req.body;
    const statusCode = await CheckFromDB(Username, Password);
    Password = await CheckPasswordHash(Password, statusCode.data.Password);
    if (statusCode.status) {
        const authToken = Create_JWT_Token({Username, _id: statusCode.data._id});

    }

})

export default router;
