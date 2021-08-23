import React from "react";
import "./reusables.scss";
import {
  FormElementProps,
  FormHeaderProps,
  FormInputLabelProps,
  FormInputProps,
  FormSubmitButtonProps,
} from "./interfaces";
import { useHistory } from "react-router";

export const FormContainer: React.FC<{}> = ({ children }) => {
  return <main id="form-container">{children}</main>;
};

export const FormHeader: React.FC<FormHeaderProps> = ({ name }) => {
  return <header id="form-header">{name}</header>;
};

export const FormElement: React.FC<FormElementProps> = ({
  children,
  Submit,
  type
}) => {
  return (
    <React.Fragment>
      <form id="submit-form" onSubmit={(event) => Submit(event, type)}>
        {children}
      </form>
    </React.Fragment>
  );
};

export const FormInput: React.FC<FormInputProps> = (props) => {
  const { name, Change, type, value, placeholder, formType } = props;
  return (
    <input
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      spellCheck="false"
      className="form-input"
      onChange={(event) => Change(event, formType)}
      autoComplete="on"
    />
  );
};

export const FormInputLabel: React.FC<FormInputLabelProps> = (props) => {
  const { html_for, label } = props;
  return (
    <label htmlFor={html_for} id="form-input-label">
      {label}
    </label>
  );
};

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = (props) => {
  const { name } = props;
  return (
    <button id="form-submit-btn" type="submit">
      {name}
    </button>
  );
};

export const FormNavigationButton: React.FC<{
  name: string;
  navigateTo: string;
}> = ({ name, navigateTo }) => {
  const history = useHistory();
  const ChangeUrl = () => history.push(navigateTo);
  return (
    <button id="form-navigation-btn" onClick={ChangeUrl}>
      {name}
    </button>
  );
};
