import { AppState, Auth0Provider, User } from "@auth0/auth0-react";
import { useLocation } from "wouter";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const Auth0ProviderWithRedirect = ({ children }) => {
  const [_location, setLocation] = useLocation();

  const onRedirectCallback = (appState?: AppState, _user?: User) => {
    setLocation((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider
      clientId={clientId}
      domain={domain}
      authorizationParams={{
        redirect_uri: window.location.href,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithRedirect;
