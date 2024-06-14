import { render } from "preact";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./app";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./msal";
import { useMsal } from "@azure/msal-react";

export const msalInstance = new PublicClientApplication(msalConfig);
export const acquireAccessToken = (
  msalInstance: PublicClientApplication,
): string => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside of the context of MsalProvider
     */
  }
  const request = {
    scopes: ["User.Read"],
    account: activeAccount || accounts[0],
  };

  msalInstance
    .acquireTokenSilent({
      scopes: ["User.Read"],
      account: request.account,
    })
    .then((response) => {
      if (response) {
        return response.accessToken;
      }
    });
  return "";
};
msalInstance.initialize().then(() => {
  // Default to using the first account if no account is active on page load
  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const { accounts } = useMsal();
      console.log(accounts);
      msalInstance.setActiveAccount(accounts[0]);
    }
  });

  render(
    <Router>
      <App pca={msalInstance} />
    </Router>,
    document.getElementById("app")!,
  );
});
