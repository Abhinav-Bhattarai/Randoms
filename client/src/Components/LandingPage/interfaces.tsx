import React from "react";

export interface LoginProps {
  ChangeLoginCred: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "username" | "password"
  ) => void;
  username: string;
  password: string;
  Submit: (event: React.FormEvent, type: string) => void;
}

export interface SignupProps {
  ChangeSignupCred: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "username" | "password" | "confirm"
  ) => void;
  username: string;
  password: string;
  confirm: string;
  Submit: (event: React.FormEvent, type: string) => void;
}

export interface FormElementProps {
  Submit: (event: React.FormEvent, type: string) => void;
  type: 'signup' | 'login';
}

export interface FormHeaderProps {
  name: string;
}

export interface FormInputProps {
  name: string;
  type: "password" | "text";
  value: string;
  placeholder: string;
  Change: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "username" | "password" | "confirm"
  ) => void;
  formType: "username" | "password" | "confirm";
}

export interface FormInputLabelProps {
  html_for: string;
  label: string;
}

export interface FormSubmitButtonProps {
  name: string;
}
