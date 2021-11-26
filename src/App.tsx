import { Route, Switch } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import { useMediaQuery } from '@chakra-ui/react';

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

const App = () => {
  const { accessToken, isGettingAccessToken } = useAuthAccessTokenContext();

  const [isLargerThan850] = useMediaQuery('(min-width: 850px');

  if (isGettingAccessToken) {
    return (
      <div className='w-full h-full flex items-center justify-center motion-safe:animate-bounce'>
        <CarrotLogo className='w-16' />
      </div>
    );
  }
  if (!accessToken) {
    return <Login />;
  }
  return (
    <>
      {isLargerThan850 ? (
        <>
          <CreateRecipeModal />
          <SingleRecipeModal />
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
                <Route exact path='/' component={MealPlan} />
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
            <Route exact path='/' component={MobileMealPlan} />
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
