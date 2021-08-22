import React from "react";
import { SignupProps } from "./interfaces";
import {
  FormContainer,
  FormElement,
  FormInput,
  FormInputLabel,
  FormSubmitButton,
} from "./reusables";

const Signup: React.FC<SignupProps> = (props) => {
  const { ChangeSignupCred, username, password, confirm, Submit } = props;

  return (
    <React.Fragment>
      <FormContainer>
        <FormElement Submit={Submit}>

          <FormInputLabel label="Username" html_for="signup_username" />
          <FormInput
            name="signup_username"
            type="text"
            formType="username"
            placeholder="Username"
            value={username}
            Change={(event) => ChangeSignupCred(event, "username")}
          />

          <FormInputLabel label="Password" html_for="signup_password" />
          <FormInput
            name="signup_password"
            type="password"
            formType="password"
            placeholder="Password"
            value={password}
            Change={(event) => ChangeSignupCred(event, "password")}
          />

          <FormInputLabel label="Confirm" html_for="signup_confirm" />
          <FormInput
            name="signup_confirm"
            type="password"
            formType="confirm"
            placeholder="Confirm"
            value={confirm}
            Change={(event) => ChangeSignupCred(event, "password")}
          />
          <FormSubmitButton name='Create Account'/>

        </FormElement>
      </FormContainer>
    </React.Fragment>
  );
};

export default Signup;
