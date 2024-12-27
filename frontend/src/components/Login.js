import React, { useEffect } from "react";

import "firebaseui/dist/firebaseui.css"; // FirebaseUI styles
import * as firebaseui from "firebaseui";
import { GoogleAuthProvider } from "firebase/auth";
// import { auth } from "../utils/firebase";
import { getAuth } from "firebase/auth";
import { app } from "../utils/firebase";

const Login = () => {
    useEffect(() => {
        console.log("Initializing Firebase UI");
    const uiConfig = {
      signInSuccessUrl: "/home", // Redirect URL after successful login
        signInOptions: [GoogleAuthProvider.PROVIDER_ID],
        signInFlow: 'popup',
        callbacks: {
            signInSuccessWithAuthResult: (authResult,redirectUrl) => {
                console.log("Authentication successful", authResult);
            console.log("Redirect URL:", redirectUrl);
                return true; // Return true to redirect
            }
        }
    };

    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(getAuth(app));
    ui.start("#firebaseui-auth-container", uiConfig);

    // return () => {
    //     ui.reset();
    //   };
  }, []);

  return <div id="firebaseui-auth-container"></div>;
};

export default Login;
