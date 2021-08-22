import React from "react";
import './reusables.scss';
import {
  FormElementProps,
  FormInputLabelProps,
  FormInputProps,
  FormSubmitButtonProps,
} from "./interfaces";

export const FormContainer: React.FC<{}> = ({ children }) => {
  return <main id="form-container">{children}</main>;
};

export const FormElement: React.FC<FormElementProps> = ({ children }) => {
  return (
    <React.Fragment>
      <form id="submit-form">{children}</form>
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
      autoComplete='on'
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
    return <button id='form-submit-btn'>{ name }</button>
};