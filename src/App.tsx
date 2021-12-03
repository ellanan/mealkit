import { Route, Switch, Redirect } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import { useMediaQuery } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

import { Sidebar } from './components/sidebar/Sidebar';
import { SingleRecipeDetails } from './components/recipe/SingleRecipeDetails';
import { MealPlan } from './components/mealPlan/MealPlan';
import { ShoppingList } from './components/groceries/ShoppingList';
import { RecipesInRecipesPage } from './components/recipe/RecipesInRecipesPage';
import { SingleRecipeModal } from './components/recipe/SingleRecipeModal';
import { CreateRecipeModal } from './components/recipe/CreateRecipeModal';
import { ShoppingListModal } from './components/groceries/ShoppingListModal';
import { ShareMealPlanModal } from './components/shareMealPlan/ShareMealPlanModal';
import { AttributionModal } from './components/footer/AttributionModal';
import { MobileMealPlan } from './components/mobile/MobileMealPlan';
import { MobileTopNavbar } from './components/mobile/MobileTopNavbar';
import { MobileBottomNavbar } from './components/mobile/MobileBottomNavbar';
import { CreateRecipe } from './components/recipe/CreateRecipe';
import { InviteLoggedOut } from './components/shareMealPlan/InviteLoggedOut';
import { InviteLoggedIn } from './components/shareMealPlan/InviteLoggedIn';
import { InheritRecipesModal } from './components/recipe/InheritRecipesModal';
import { Home } from './components/home/Home';
import { MobileHome } from './components/mobile/MobileHome';
import { ReactComponent as CarrotLogo } from './images/logo-carrot.svg';
import { useAuthAccessTokenContext } from './useAuthAccessTokenContext';

const App = () => {
  const { isAuthenticated } = useAuth0();
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
                  <Route
                    exact
                    path='/recipes'
                    component={RecipesInRecipesPage}
                  />
                  <Route exact path='/grocerylist' component={ShoppingList} />
                </Switch>
              </div>
            </SplitPane>
          </>
        )
      ) : !isAuthenticated ? (
        <MobileHome />
      ) : (
        <div className='flex flex-col h-full'>
          <MobileTopNavbar />
          <Switch>
            <Route path='/invite' component={InviteLoggedIn} />

            <Redirect exact from='/' to='/mealplanner' />
            <Route exact path='/mealplanner' component={MobileMealPlan} />
            <Route
              exact
              path='/recipes/:recipeId'
              render={({ match }) => (
                <SingleRecipeDetails recipeId={match.params.recipeId} />
              )}
            />
            <Route exact path='/createrecipe' component={CreateRecipe} />
            <Route exact path='/recipes' component={RecipesInRecipesPage} />
            <Route exact path='/grocerylist' component={ShoppingList} />
          </Switch>
          <MobileBottomNavbar />
        </div>
      )}
    </>
  );
};

export default App;
