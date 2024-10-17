import { Route, Switch } from "wouter";
import Header from "./components/Header";
import Bookmarks from "./pages/Bookmarks";
import Home from "./pages/Home";
import CreateBookmark from "./pages/CreateBookmark";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/utils/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bookmarks">
          <ProtectedRoute component={Bookmarks} />
        </Route>
        <Route path="/bookmarks/new">
          <ProtectedRoute component={CreateBookmark} />
        </Route>
        <Route>404: Página no encontrada!</Route>
      </Switch>
      <Toaster
        richColors
        toastOptions={{
          classNames: {
            error: "bg-red-400",
            success: "text-green-400",
            warning: "text-yellow-400",
            info: "bg-blue-400",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
