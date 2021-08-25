import { useEffect, useState } from "react";
import { CheckAuthentication, CheckLocalStorage } from "../helper";

const useAuthenticate = () => {
  const [auth_status, setAuthStatus] = useState<boolean | null>(null);

  const ChangeAuth = (type: boolean) => {
    setAuthStatus(type);
  };

  useEffect(() => {
    const ExecuteAuthentication = async () => {
      const LocalStorageData = CheckLocalStorage();
      if (LocalStorageData) {
        const status = await CheckAuthentication(
          LocalStorageData.auth_token,
          LocalStorageData.userID
        );
        setAuthStatus(status);
      } else {
        setAuthStatus(false);
      }
    };
    ExecuteAuthentication();
  }, []);

  return { auth_status, ChangeAuth };
};

export default useAuthenticate;
