import { Route, Switch } from 'react-router-dom';
import SplitPane from 'react-split-pane';

import { Sidebar } from './components/nav/Sidebar';
import { CreateRecipe } from './components/recipe/CreateRecipe';
import { SingleRecipeDetails } from './components/recipe/SingleRecipeDetails';
import { MealPlan } from './components/mealPlan/MealPlan';
import { ShoppingList } from './components/groceries/ShoppingList';
import { RecipesInRecipesPage } from './components/recipe/RecipesInRecipesPage';
import { Login } from './components/login/Login';
import { SingleRecipeModal } from './components/recipe/SingleRecipeModal';
import { CreateRecipeModal } from './components/recipe/CreateRecipeModal';
import { ShoppingListModal } from './components/groceries/ShoppingListModal';
import { AttributionModal } from './components/footer/AttributionModal';
import { ReactComponent as CarrotLogo } from './images/logo-carrot.svg';
import { useAuthAccessTokenContext } from './useAuthAccessTokenContext';

const App = () => {
  const { accessToken, isGettingAccessToken } = useAuthAccessTokenContext();

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
            <Route exact path='/create-recipe' component={CreateRecipe} />
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
  );
};

export default App;
