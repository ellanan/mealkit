import { useAuth0 } from "@auth0/auth0-react";
import { IoLogOutOutline } from "react-icons/io5";

export const SignOut = () => {
  const { isAuthenticated, logout } = useAuth0();

  return isAuthenticated ? (
    <button
      className="flex items-center justify-center text-14 text-sm py-2 mb-4 hover:bg-12"
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      <IoLogOutOutline size={15} className="min-w-[20px] mr-2" />
      Sign Out
    </button>
  ) : null;
};
