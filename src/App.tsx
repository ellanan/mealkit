import {
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from 'react-router-dom';
import SplitPane from 'react-split-pane';
import { Button, useMediaQuery } from '@chakra-ui/react';

import { Sidebar } from './components/sidebar/Sidebar';
import { SingleRecipeDetails } from './components/recipe/SingleRecipeDetails';
import { MealPlan } from './components/mealPlan/MealPlan';
import { ShoppingList } from './components/groceries/ShoppingList';
import { RecipesInRecipesPage } from './components/recipe/RecipesInRecipesPage';
import { Login } from './components/login/Login';
import { SingleRecipeModal } from './components/recipe/SingleRecipeModal';
import { CreateRecipeModal } from './components/recipe/CreateRecipeModal';
import { ShoppingListModal } from './components/groceries/ShoppingListModal';
import { AttributionModal } from './components/footer/AttributionModal';
import { MobileMealPlan } from './components/mobile/MobileMealPlan';
import { MobileTopNavbar } from './components/mobile/MobileTopNavbar';
import { MobileBottomNavbar } from './components/mobile/MobileBottomNavbar';
import { MobileRecipesInRecipesPage } from './components/mobile/MobileRecipesInRecipesPage';
import { CreateRecipe } from './components/recipe/CreateRecipe';
import { ReactComponent as CarrotLogo } from './images/logo-carrot.svg';
import { useAuthAccessTokenContext } from './useAuthAccessTokenContext';
import { InheritRecipesModal } from './components/recipe/InheritRecipesModal';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from './generated/graphql';

const App = () => {
  const { accessToken, isGettingAccessToken } = useAuthAccessTokenContext();

  const [isLargerThan850] = useMediaQuery('(min-width: 850px)');

  if (isGettingAccessToken) {
    return (
      <div className='w-full h-full flex items-center justify-center motion-safe:animate-bounce'>
        <CarrotLogo className='w-16' />
      </div>
    );
  }
  if (!accessToken) {
    return (
      <Switch>
        <Route path='/invite' component={InviteLoggedOut} />
        <Route component={Login} />
      </Switch>
    );
  }
  return (
    <>
      <SingleRecipeModal />
      <InheritRecipesModal />
      {isLargerThan850 ? (
        <>
          <CreateRecipeModal />
          <ShoppingListModal />
          <AttributionModal />
          <SplitPane
            split='vertical'
            defaultSize={200}
            maxSize={Math.min(window.innerWidth / 3, 500)}
            minSize={200}
          >
            <Sidebar />
            <div className='flex flex-col h-full'>
              <Switch>
                <Route path='/invite' component={InviteLoggedIn} />

                <Redirect exact from='/' to='/mealplanner' />
                <Route path='/mealplanner' component={MealPlan} />
                <Route
                  exact
                  path='/recipes/:recipeId'
                  render={({ match }) => (
                    <SingleRecipeDetails recipeId={match.params.recipeId} />
                  )}
                />
                <Route exact path='/recipes' component={RecipesInRecipesPage} />
                <Route exact path='/grocerylist' component={ShoppingList} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </div>
          </SplitPane>
        </>
      ) : (
        <div className='flex flex-col h-full'>
          <MobileTopNavbar />
          <Switch>
            <Route exact path='/mealplanner' component={MobileMealPlan} />
            <Route
              exact
              path='/recipes/:recipeId'
              render={({ match }) => (
                <SingleRecipeDetails recipeId={match.params.recipeId} />
              )}
            />
            <Route exact path='/createrecipe' component={CreateRecipe} />
            <Route
              exact
              path='/recipes'
              component={MobileRecipesInRecipesPage}
            />
            <Route exact path='/grocerylist' component={ShoppingList} />
            <Route exact path='/login' component={Login} />
          </Switch>
          <MobileBottomNavbar />
        </div>
      )}
    </>
  );
};

export default App;

const InviteLoggedOut = () => {
  const { isGettingAccessToken } = useAuthAccessTokenContext();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const mealPlanId = queryParams.get('mealPlanId');

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
    <div className='w-full h-full flex items-center justify-center motion-safe:animate-bounce'>
      <CarrotLogo className='w-16' />
    </div>
  );
};

const InviteLoggedIn = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const mealPlanId = queryParams.get('mealPlanId');

  const [joinMealPlan] = useMutation<
    GraphQLTypes.JoinMealPlanMutation,
    GraphQLTypes.JoinMealPlanMutationVariables
  >(
    gql`
      mutation JoinMealPlan($mealPlanId: ID!) {
        joinMealPlan(mealPlanId: $mealPlanId) {
          id
        }
      }
    `,
    {
      variables: {
        mealPlanId: mealPlanId as string,
      },
    }
  );

  return (
    <div className='w-full h-full flex items-center justify-center'>
      Some body invite you to a meal plan. You wanna join?
      <Button
        onClick={() => {
          joinMealPlan().then(() => {
            history.push('/mealplanner');
          });
        }}
      >
        Yes, Join Meal Plan
      </Button>
    </div>
  );
};
