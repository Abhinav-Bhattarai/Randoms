import { Decrypt } from "../Cryptography/crypto.js";

export const SignupMiddleware = (req, res, next) => {
  try {
    const Data = Decrypt(req.body.Enc);
    if (Data) {
      if (
        Data.Username.length > 5 &&
        Data.Password.length > 7 &&
        Data.Password === Data.Confirm
      ) {
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
      return res.json({ Error: true });
    }
  } catch {
    return res.json({ Error: true });
  }
};
