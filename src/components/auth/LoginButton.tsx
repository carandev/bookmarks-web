import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { DoorOpen } from "lucide-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()}>
      <DoorOpen className="mr-2 h-4 w-4" />
      Iniciar sesión
    </Button>
  );
};

export default LoginButton;
