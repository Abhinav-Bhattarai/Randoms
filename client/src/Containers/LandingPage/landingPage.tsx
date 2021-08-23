import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useState } from "react";
import Spinner from "../../Components/UI/Spinner/spinner";
import useSubmitForm from "../../Hooks/useSubmitForm";
import { useEffect } from "react";
import Navbar from "../../Components/LandingPage/Navbar/navbar";

interface ContainerProps {
  ChangeAuthentication: (type: boolean) => void;
}

const AsyncLoginPage = React.lazy(
  () => import("../../Components/LandingPage/login")
);
const AsyncSignupPage = React.lazy(
  () => import("../../Components/LandingPage/signup")
);

const CheckLoginCredentials = (username: string, password: string) => {
  if (username.length > 5 && password.length > 7) return true;
  return false;
};

const CheckSignupCredentials = (
  username: string,
  password: string,
  confirm: string
) => {
  if (username.length > 5 && password.length > 7 && password === confirm)
    return true;
  return false;
};

const CheckRegex = (password: string) => {
  const regex = /[0-9]/;
  if (regex.exec(password) !== null) return true;
  return false;
};

const LandingPage: React.FC<ContainerProps> = (props) => {
  const [username_login, setLoginUsername] = useState<string>("");
  const [password_login, setLoginPassword] = useState<string>("");
  const [username_signup, setSignupUsername] = useState<string>("");
  const [password_signup, setSignupPassword] = useState<string>("");
  const [confirm_signup, setSignupConfirm] = useState<string>("");

  const { loading, SubmitForms } = useSubmitForm({
    onComplete: (data, error) => {
      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userID", data.userID);
      localStorage.setItem("userName", data.userName);
      props.ChangeAuthentication(true);
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const ChangeLoginCredential = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "username" | "password"
  ) => {
    const value = event.target.value;
    // remove space in the value attribute;
    value.replace(/\s+/g, "");
    switch (type) {
      case "username":
        setLoginUsername(value);
        break;
      default:
        setLoginPassword(value);
        break;
    }
  };

  const ChangeSignupCredential = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "username" | "password" | "confirm"
  ) => {
    const value = event.target.value;
    // remove space in the value attribute;
    value.replace(/\s+/g, "");
    switch (type) {
      case "username":
        setSignupUsername(value);
        break;
      case "password":
        setSignupPassword(value);
        break;
      default:
        setSignupConfirm(value);
        break;
    }
  };

  const SubmitCredentials = (event: React.FormEvent, type: string) => {
    event.preventDefault();
    if (type === "login") {
      const CredentialValidity = CheckLoginCredentials(
        username_login,
        password_login
      );
      const RegexValidity = CheckRegex(password_login);
      if (CredentialValidity && RegexValidity) {
        SubmitForms(username_login, password_login, "/login");
      }
    } else if (type === "signup") {
      const CredentialValidity = CheckSignupCredentials(
        username_signup,
        password_signup,
        confirm_signup
      );
      const RegexValidity = CheckRegex(password_signup);
      if (CredentialValidity && RegexValidity) {
        SubmitForms(
          username_signup,
          password_signup,
          confirm_signup,
          "/signup"
        );
      }
    }
  };

  useEffect(() => {}, [loading]);

  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route
          path="/login"
          exact
          render={() => {
            return (
              <Suspense fallback={<Spinner />}>
                <AsyncLoginPage
                  Submit={SubmitCredentials}
                  username={username_login}
                  password={password_login}
                  ChangeLoginCred={ChangeLoginCredential}
                />
              </Suspense>
            );
          }}
        />
        <Route
          path="/signup"
          exact
          render={() => {
            return (
              <Suspense fallback={<Spinner />}>
                <AsyncSignupPage
                  username={username_signup}
                  password={password_signup}
                  confirm={confirm_signup}
                  Submit={SubmitCredentials}
                  ChangeSignupCred={ChangeSignupCredential}
                />
              </Suspense>
            );
          }}
        />
        <Route
          render={() => {
            return (
              <Suspense fallback={<Spinner />}>
                <AsyncLoginPage
                  username={username_login}
                  password={password_login}
                  ChangeLoginCred={ChangeLoginCredential}
                  Submit={SubmitCredentials}
                />
              </Suspense>
            );
          }}
        />
      </Switch>
    </React.Fragment>
  );
};

export default LandingPage;
