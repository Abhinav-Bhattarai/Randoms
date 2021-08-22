import React from "react";

export const MainPageGuard: React.FC<{ auth_status: boolean }> = (props) => {
  const { auth_status, children } = props;
  if (auth_status === true) return <React.Fragment>{children}</React.Fragment>;
  return null;
};
