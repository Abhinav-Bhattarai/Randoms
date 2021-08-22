import { Decrypt } from "../Cryptography/crypto.js";

export const LoginMiddleware = (req, res, next) => {
    const { Enc } = req.body;
    const Data = Decrypt(Enc);
    if (Data) {
        if (Data.Username.length > 5 && Password.length >= 8)
        req.body.Username = Data.Username;
        req.body.Password = 
        next();
    }
    return res.json({EncryptionChanged: true});
}