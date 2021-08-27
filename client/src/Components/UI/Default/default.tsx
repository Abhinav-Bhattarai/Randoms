import React from "react";
import DefaultLogo from "../../../assets/default.svg";

const Default = () => {
  return (
    <React.Fragment>
      <img src={DefaultLogo} width="404px" height="404px" alt="def" />
      <div
        style={{
          fontWeight: "bold",
          color: "grey",
          fontSize: "20px",
          marginTop: "-70px",
        }}
      >
        Start calling Randoms
      </div>
    </React.Fragment>
  );
};

export default Default;
