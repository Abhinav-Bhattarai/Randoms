import React from "react";

export const LandingPageGuard: React.FC<{ auth_status: boolean }> = (props) => {
  const { auth_status, children } = props;
  if (auth_status === false) return <React.Fragment>{children}</React.Fragment>;
  return null;
};
