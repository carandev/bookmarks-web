import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Auth0ProviderWithRedirect from "./components/utils/Auth0ProviderWithRedirect.tsx";

createRoot(document.getElementById("root")!).render(
  <Auth0ProviderWithRedirect>
    <App />
  </Auth0ProviderWithRedirect>,
);
