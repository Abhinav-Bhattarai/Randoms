import { Decrypt } from "../Cryptography/crypto.js";

export const LoginMiddleware = (req, res, next) => {
  try {
    const { Enc } = req.body;
    const Data = Decrypt(Enc);
    if (Data) {
      if (Data.Username.length > 5 && Data.Password.length >= 8) {
        const regex = /[0-9]/;
        if (regex.exec(Data.Password) !== null) {
          req.body.Username = Data.Username;
          req.body.Password = Data.Password;
          next();
        } else {
          return res.json({ Error: true });
        }
      } else {
        return res.json({ Error: true });
      }
    } else {
      return res.json({ EncryptionChanged: true, Error: true });
    }
  } catch {
    return res.json({ Error: true });
  }
};
