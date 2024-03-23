import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useHistory } from "react-router-dom";

import CarrotLogo from "../../images/logo-carrot.svg?react";
import { useAuthAccessTokenContext } from "../../useAuthAccessTokenContext";

export const InviteLoggedOut = () => {
  const { isGettingAccessToken } = useAuthAccessTokenContext();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const mealPlanId = queryParams.get("mealPlanId");

  useEffect(() => {
    if (isAuthenticated) {
      // auth0 removes query params. add it back so the logged in invite page can access it
      history.push(`/invite?mealPlanId=${mealPlanId}`);
      return;
    }

    loginWithRedirect({
      redirectUri: `${window.location.origin}/invite?mealPlanId=${mealPlanId}`,
    });
  }, [
    isGettingAccessToken,
    loginWithRedirect,
    mealPlanId,
    isAuthenticated,
    history,
  ]);

  return (
    <div className="w-full h-full flex items-center justify-center motion-safe:animate-bounce">
      <CarrotLogo className="w-16" />
    </div>
  );
};
