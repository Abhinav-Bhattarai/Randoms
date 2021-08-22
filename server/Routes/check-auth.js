import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

const CheckJWT = (authToken, userID) => {
    const data = jwt.verify(authToken, process.env.JWT_AUTH_TOKEN);
    if (data) {
        if (data.userID === userID){
            return {status: true, error: false};
        }
        return { status: false, error: false };
    }
    return { status: false, error: true };
}

router.get('/:authToken/:userID', (req, res) => {
    try {
        const { authToken, userID } = req.params;
        const AuthStatus = CheckJWT(authToken, userID);
        return res.json(AuthStatus)
    } catch {
        return res.json({status: false, error: true});
    }
})

export default router;