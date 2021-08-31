import React from "react";
import { IconContext, IconType } from "react-icons";
import { FaVideo } from "react-icons/fa";
import { AiFillForward, AiFillCaretDown } from "react-icons/ai";
import {
  LogoSection,
  MidSection,
  NavbarContainer,
  NavigatorSection,
} from "../../LandingPage/Navbar/navbar";
import "./navbar.scss";

interface NavigatorsPROPS {
  navigatorName: string;
  bgColor: string;
  LogoRef: IconType;
  Click: () => void;
  blurData: number;
}

const NavigatorLogo: React.FC<{}> = ({ children }) => {
  return (
    <IconContext.Provider value={{ className: "navigator-logo" }}>
      {children}
    </IconContext.Provider>
  );
};

const Dropdown = () => {
  return (
    <React.Fragment>
      <div id="dropdown-container">
        <IconContext.Provider value={{ className: "dropdown" }}>
          <AiFillCaretDown />
        </IconContext.Provider>
      </div>
    </React.Fragment>
  );
};

const Navigators: React.FC<NavigatorsPROPS> = (props) => {
  const { navigatorName, bgColor, LogoRef, Click, blurData } = props;
  return (
    <React.Fragment>
      <main
        id="navigator"
        onClick={Click}
        style={{
          backgroundColor: bgColor,
          filter: `opacity(${blurData}%)`,
          cursor: blurData === 100 ? "pointer" : "context-menu",
        }}
      >
        <NavigatorLogo>
          <LogoRef />
        </NavigatorLogo>
        <div id="navigator-name">{navigatorName}</div>
      </main>
    </React.Fragment>
  );
};

interface NavbarProps {
  ClickNext: () => void;
  ClickStart: () => void;
  status: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { ClickNext, ClickStart, status } = props;
  return (
    <React.Fragment>
      <NavbarContainer>
        <LogoSection />
        <MidSection />
        <NavigatorSection>
          <Navigators
            Click={status === false ? ClickStart: () => {}}
            LogoRef={FaVideo}
            bgColor="#07ca4c"
            blurData={status === true ? 30 : 100}
            navigatorName="Start"
          />
          <Navigators
            Click={status === true ? ClickNext : () => {}}
            LogoRef={AiFillForward}
            bgColor="#ff385c"
            blurData={status === true ? 100 : 30}
            navigatorName="Next"
          />
          <Dropdown />
        </NavigatorSection>
      </NavbarContainer>
    </React.Fragment>
  );
};

export default React.memo(Navbar);
