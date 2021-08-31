import React from "react";
import DefaultLogo from "../../../assets/default.svg";

const Default = () => {
  return (
    <React.Fragment>
      <img src={DefaultLogo} width="80%" height="80%" alt="def" />
      <div
        style={{
          fontWeight: "bold",
          color: "grey",
          fontSize: "18px",
          marginTop: "-60px",
        }}
      >
        Start calling Randoms
      </div>
    </React.Fragment>
  );
};

export default Default;
