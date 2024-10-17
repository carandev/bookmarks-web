import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import { useEffect } from "react";
import UsersService from "../services/UsersService";
import useUserStore from "../utils/useUserStore";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { ModeToggle } from "./utils/mode-toggle";

const Header = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { currentUser, setUser } = useUserStore();
  const usersService = new UsersService();

  const callApi = async () => {
    try {
      if (user && user.sub) {
        const token = await getAccessTokenSilently();
        const userFromApi = await usersService.getUser(user.sub, token);
        setUser(userFromApi);
        toast.info(`Bienvenido ${user.nickname}!`);
      }
    } catch (error) {
      toast.error("Ocurrió un error: ", {
        description: error.message,
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  return (
    <Card className="flex justify-between items-center p-4 rounded-none">
      <h1>Marcadores Web {currentUser && "para " + currentUser?.name}</h1>
      <div className="flex gap-4">
        <ModeToggle />
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
    </Card>
  );
};

export default Header;
