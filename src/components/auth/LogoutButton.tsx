import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";
import { DoorClosed } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      variant="outline"
    >
      <DoorClosed className="mr-2 h-4 w-4" />
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
