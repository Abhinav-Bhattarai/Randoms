import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { MainPageGuard } from "./Guards/MainPage";
import { LandingPageGuard } from "./Guards/LandingPage";
import useAuthenticate from "./Hooks/useAuthenticate";
import Spinner from "./Components/UI/Spinner/spinner";

const AsyncLandingPage = React.lazy(
  () => import("./Containers/LandingPage/landingPage")
);
const AsyncMainPage = React.lazy(
  () => import("./Containers/MainPage/mainPage")
);

function App() {
  const {auth_status, ChangeAuth} = useAuthenticate();

  if (auth_status === null) return <React.Fragment></React.Fragment>;

  const ChangeAuthentication = (type: boolean) => ChangeAuth(type);

  return (
    <React.Fragment>
      <BrowserRouter basename="/">
        <LandingPageGuard auth_status={auth_status}>
          <Suspense fallback={<Spinner/>}>
            <AsyncLandingPage ChangeAuthentication={ChangeAuthentication}/>
          </Suspense>
        </LandingPageGuard>
        <MainPageGuard auth_status={auth_status}>
          <Suspense fallback={<Spinner/>}>
            <AsyncMainPage ChangeAuthentication={ChangeAuthentication}/>
          </Suspense>
        </MainPageGuard>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
