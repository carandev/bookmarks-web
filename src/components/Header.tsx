import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import { useEffect } from "react";
import UsersService from "../services/UsersService";
import useUserStore from "../utils/useUserStore";

const Header = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { currentUser, setUser } = useUserStore();
  const usersService = new UsersService();

  const callApi = async () => {
    try {
      if (user && user.sub) {
        const token = await getAccessTokenSilently();
        setUser(await usersService.getUser(user.sub, token));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  return (
    <header>
      <h1>Marcadores Web para {currentUser?.name}</h1>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </header>
  );
};

export default Header;
