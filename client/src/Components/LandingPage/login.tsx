import React from "react";
import { LoginProps } from "./interfaces";
import {
  FormContainer,
  FormElement,
  FormHeader,
  FormInput,
  FormInputLabel,
  FormNavigationButton,
  FormSubmitButton,
} from "./reusables";

const Login: React.FC<LoginProps> = (props) => {
  const { ChangeLoginCred, username, password, Submit } = props;
  return (
    <React.Fragment>
      <FormContainer>
        <FormHeader name='Login'/>
        <FormElement type='login' Submit={Submit}>
          <FormInputLabel label="Username" html_for="login_username" />
          <FormInput
            name="login_username"
            type="text"
            formType="username"
            placeholder='Username'
            value={username}
            Change={(event) => ChangeLoginCred(event, "username")}
          />
          
          <FormInputLabel label="Password" html_for="login_password" />
          <FormInput
            name="login_password"
            type="password"
            formType='password'
            placeholder='Password'
            value={password}
            Change={(event) => ChangeLoginCred(event, 'password')}
          />
          <FormSubmitButton name='Login'/>
        </FormElement>
        <FormNavigationButton navigateTo='/signup' name='Create new Account'/>
      </FormContainer>
    </React.Fragment>
  );
};

export default Login;