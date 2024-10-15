import { Route, Switch } from "wouter";
import Header from "./components/Header";
import Bookmarks from "./pages/Bookmarks";
import Home from "./pages/Home";
import CreateBookmark from "./pages/CreateBookmark";
import ProtectedRoute from "./components/utils/ProtectedRoute";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
