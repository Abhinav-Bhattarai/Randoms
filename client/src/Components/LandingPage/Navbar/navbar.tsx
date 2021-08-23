import React from "react";
import { AiFillApple } from "react-icons/ai";
import { IconContext } from "react-icons";
import "./navbar.scss";
import { NavLink } from "react-router-dom";

const Logo: React.FC<{ className: string }> = ({ className, children }) => {
  return (
    <IconContext.Provider value={{ className: `logo ${className}` }}>
      {children}
    </IconContext.Provider>
  );
};

const LogoSection: React.FC<{}> = (props) => {
  return (
    <React.Fragment>
      <main id="logo-container">
        <article id="logo-content">
          <Logo className="apple-logo">
            <AiFillApple />
          </Logo>
          <div id="logo-name">Randoms</div>
        </article>
      </main>
    </React.Fragment>
  );
};

const MidSection: React.FC<{}> = () => {
  return (
    <React.Fragment>
      <main id="mid-nav-section"></main>
    </React.Fragment>
  );
};

const Navigators: React.FC<{ name: string; addon: string }> = ({
  name,
  addon,
}) => {
  return (
    <React.Fragment>
      <div className={`${addon} navigators`}>
        <NavLink
          to={`${name.toLocaleLowerCase()}`}
          activeClassName={`active-${name.toLocaleLowerCase()}`}
          className="inner-navigators"
        >
          {name}
        </NavLink>
      </div>
    </React.Fragment>
  );
};

const NavigatorSection: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="navigator-section">{children}</main>
    </React.Fragment>
  );
};

const NavbarContainer: React.FC<{}> = ({ children }) => {
  return <nav id="navbar-container">{children}</nav>;
};

const Navbar = () => {
  return (
    <React.Fragment>
      <NavbarContainer>
        <LogoSection />
        <MidSection />
        <NavigatorSection>
          <Navigators addon="login-navigator" name="Login" />
          <Navigators addon="signup-navigator" name="Signup" />
        </NavigatorSection>
      </NavbarContainer>
    </React.Fragment>
  );
};

export default Navbar;
