import preactLogo from "../public/img/preact.svg";
import viteLogo from "../public/img/vite.svg";
import "../public/css/app.css";
import { MsalProvider, useAccount, useMsal } from "@azure/msal-react";
import { Route, Routes } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import ApiClient from "./services/apibase";

interface Props {
  pca: PublicClientApplication;
}

const queryClient = new QueryClient();

export function App({ pca }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={pca}>
        <Routes>
          <Route path="/forecast" element={<Weather />} />
          <Route path="/" element={<Unauth />} />
        </Routes>
      </MsalProvider>
    </QueryClientProvider>
  );
}
function Unauth() {
  const { instance, accounts, inProgress } = useMsal();
  if (inProgress === "login")
    return <span>Login is currently in progress...</span>;
  else if (accounts.length == 0) {
    return (
      <>
        <span>There are currently no users signed in!</span>
        <button onClick={() => instance.loginPopup()}>Login</button>
      </>
    );
  } else {
    return (
      <a href="/forecast">
        <button class="btn btn-primary rounded">Get Forecast</button>
      </a>
    );
  }
}
function Weather() {
  const client = new ApiClient();
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const { data: tokenResponse } = useQuery({
    queryKey: ["token"],
    queryFn: () =>
      instance.acquireTokenSilent({
        scopes: ["api://de3dbee6-48b1-467c-b814-b8340dcf9d3a/.default"],
        account: account ?? undefined,
      }),
    enabled: !!account,
  });
  client.accessToken = tokenResponse?.accessToken;
  const { data } = useQuery({
    queryKey: ["forecast"],
    queryFn: () => {
      return client.fetchAsync("weatherForecast");
    },
    enabled: !!tokenResponse,
  });

  return (
    <>
      <div>
        <table class="table table-dark table-bordered rounded rounded full">
          <thead>
            <tr>
              <td>DATE A RU</td>
              <td>tempC</td>
              <td>tempF</td>
              <td>summary</td>
            </tr>
          </thead>
          <tbody>
            {}
            {data?.map((forecast: any) => (
              <tr>
                <td>{forecast.date}</td>
                <td>{forecast.temperatureC}</td>
                <td>{forecast.temperatureF}</td>
                <td>{forecast.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div class="card">
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  );
}
