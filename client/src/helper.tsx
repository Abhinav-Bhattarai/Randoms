import axios from 'axios';

export interface AuthenticationInterface {
  status: boolean;
  error: boolean;
}

export const CheckAuthentication = async (auth_token: string,userID: string): Promise<any> => {
  const { data }: { data: AuthenticationInterface } = await axios.get(`/checkAuth/${auth_token}/${userID}`);
  if (data.error === false) {
    return data.status;
  }
  return false;
};

export const CheckLocalStorage = () => {
  const userID = localStorage.getItem("userID");
  const auth_token = localStorage.getItem("authToken");
  if (userID && auth_token) {
    return { userID, auth_token };
  }
  return null;
};
