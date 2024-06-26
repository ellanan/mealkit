/// <reference types="vite-plugin-svgr/client" />
import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { useMediaQuery } from "@chakra-ui/react";
import { Allotment } from "allotment";
import { Route, Switch, Redirect } from "react-router-dom";

import { ShoppingList } from "./components/groceries/ShoppingList";
import { ShoppingListModal } from "./components/groceries/ShoppingListModal";
import { Home } from "./components/home/Home";
import { MealPlan } from "./components/mealPlan/MealPlan";
import { MobileAppWrapper } from "./components/mobile/MobileAppWrapper";
import { MobileBottomNavbar } from "./components/mobile/MobileBottomNavbar";
import { MobileHome } from "./components/mobile/MobileHome";
import { MobileMealPlan } from "./components/mobile/MobileMealPlan";
import { MobileTopNavbar } from "./components/mobile/MobileTopNavbar";
import { CreateRecipe } from "./components/recipe/CreateRecipe";
import { CreateRecipeModal } from "./components/recipe/CreateRecipeModal";
import { InheritRecipesModal } from "./components/recipe/InheritRecipesModal";
import { RecipesInRecipesPage } from "./components/recipe/RecipesInRecipesPage";
import { SingleRecipeDetails } from "./components/recipe/SingleRecipeDetails";
import { SingleRecipeModal } from "./components/recipe/SingleRecipeModal";
import { InviteLoggedIn } from "./components/shareMealPlan/InviteLoggedIn";
import { InviteLoggedOut } from "./components/shareMealPlan/InviteLoggedOut";
import { ShareMealPlanModal } from "./components/shareMealPlan/ShareMealPlanModal";
import { Sidebar } from "./components/sidebar/Sidebar";
import { useAuthAccessTokenContext } from "./useAuthAccessTokenContext";

import carrotLogo from "./images/logo-carrot.svg";

import "allotment/dist/style.css";

const App = () => {
  const { isAuthenticated } = useAuth0();
  const { accessToken, isGettingAccessToken } = useAuthAccessTokenContext();

  const [isLargerThan850] = useMediaQuery("(min-width: 850px)");

  if (isGettingAccessToken) {
    return (
      <div className="w-full h-full flex items-center justify-center motion-safe:animate-bounce">
        <img src={carrotLogo} className="w-16" />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <Switch>
        <Route path="/invite" component={InviteLoggedOut} />
        <Route path="/login" component={Login} />

        <Route>{isLargerThan850 ? <Home /> : <MobileHome />}</Route>
      </Switch>
    );
  }

  return (
    <>
      <SingleRecipeModal />
      <InheritRecipesModal />
      <ShareMealPlanModal />
      {isLargerThan850 ? (
        !isAuthenticated ? (
          <Home />
        ) : (
          <>
            <CreateRecipeModal />
            <ShoppingListModal />
            <Allotment>
              <Allotment.Pane
                minSize={200}
                maxSize={Math.min(window.innerWidth / 3, 500)}
              >
                <Sidebar />
              </Allotment.Pane>
              <Allotment.Pane>
                <div className="flex flex-col h-full">
                  <Switch>
                    <Route path="/invite" component={InviteLoggedIn} />

                    <Redirect exact from="/" to="/mealplanner" />
                    <Route path="/mealplanner" component={MealPlan} />
                    <Route
                      exact
                      path="/recipes/:recipeId"
                      render={({ match }) => (
                        <SingleRecipeDetails recipeId={match.params.recipeId} />
                      )}
                    />
                    <Route
                      exact
                      path="/recipes"
                      component={RecipesInRecipesPage}
                    />
                    <Route exact path="/grocerylist" component={ShoppingList} />
                  </Switch>
                </div>
              </Allotment.Pane>
            </Allotment>
          </>
        )
      ) : !isAuthenticated ? (
        <MobileHome />
      ) : (
        <MobileAppWrapper>
          <MobileTopNavbar />
          <Switch>
            <Route path="/invite" component={InviteLoggedIn} />

            <Redirect exact from="/" to="/mealplanner" />
            <Route exact path="/mealplanner" component={MobileMealPlan} />
            <Route
              exact
              path="/recipes/:recipeId"
              render={({ match }) => (
                <SingleRecipeDetails recipeId={match.params.recipeId} />
              )}
            />
            <Route exact path="/createrecipe" component={CreateRecipe} />
            <Route exact path="/recipes" component={RecipesInRecipesPage} />
            <Route exact path="/grocerylist" component={ShoppingList} />
          </Switch>
          <MobileBottomNavbar />
        </MobileAppWrapper>
      )}
    </>
  );
};

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return null;
};

export default App;
