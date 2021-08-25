import axios from "axios";
import { useState } from "react";
import { Decrypt, Encrypt } from "../Cryptography/crypto";

interface configDataType {
  Username: string;
  Password: string;
  Confirm?: string;
}

interface confData {
  authToken: string;
  userName: string;
  userID: string;
}

interface Config {
  onComplete: (data: confData, error: boolean) => void;
  onError: (type: boolean) => void;
}

const useSubmitForm = (config: Config) => {
  const { onComplete, onError } = config;
  const [loading, setLoading] = useState<boolean | null>(null);

  const SubmitForms = async (...formContent: Array<string>) => {
    setLoading(true);
    const uri = formContent[formContent.length - 1];
    const type = uri.split("/")[1];
    let configData: configDataType = {
      Username: formContent[0],
      Password: formContent[1],
    };
    if (type === "signup") {
      configData = { ...configData, Confirm: formContent[2] };
    }
    const EncryptedData = Encrypt(configData);
    const { data } = await axios.post(uri, { Enc: EncryptedData });
    if (data.Error === false) {
      const DecryptedData = Decrypt(data.Enc);
      if (DecryptedData) {
        const conf = {
          authToken: DecryptedData.authToken,
          userName: formContent[0],
          userID: DecryptedData.userID,
        };
        setLoading(false);
        onComplete(conf, false);
        return;
      }
      setLoading(false);
      return;
    } else {
      onError(true);
      return;
    }
  };

  return { loading, SubmitForms };
};

export default useSubmitForm;
