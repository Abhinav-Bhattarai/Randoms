import React from "react";
import { IconContext, IconType } from "react-icons";
import { FaVideo } from 'react-icons/fa';
import { AiFillForward } from 'react-icons/ai';
import {
  LogoSection,
  MidSection,
  NavbarContainer,
  NavigatorSection,
} from "../../LandingPage/Navbar/navbar";
import './navbar.scss';

interface NavigatorsPROPS {
  navigatorName: string;
  bgColor: string;
  LogoRef: IconType;
  Click: () => void;
};

const NavigatorLogo: React.FC<{}> = ({ children }) => {
  return (
    <IconContext.Provider value={{ className: 'navigator-logo' }}>
      { children }
    </IconContext.Provider>
  )
}

const Navigators: React.FC<NavigatorsPROPS> = (props) => {
  const { navigatorName, bgColor, LogoRef, Click } = props;
  return (
    <React.Fragment>
      <main id='navigator' onClick={Click} style={{backgroundColor: bgColor}}>
        <NavigatorLogo>
          <LogoRef/>
        </NavigatorLogo>
        <div id='navigator-name'>{ navigatorName }</div>
      </main>
    </React.Fragment>
  )
}

interface NavbarProps {
  ClickNext: () => void;
  ClickStart: () => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { ClickNext, ClickStart } = props;
  return (
    <React.Fragment>
      <NavbarContainer>
        <LogoSection />
        <MidSection />
        <NavigatorSection>
          <Navigators Click={ClickStart} LogoRef={FaVideo} bgColor='#07ca4c' navigatorName='Start'/>
          <Navigators Click={ClickNext} LogoRef={AiFillForward} bgColor='#ff385c' navigatorName='Next'/>
        </NavigatorSection>
      </NavbarContainer>
    </React.Fragment>
  );
};

export default React.memo(Navbar);
