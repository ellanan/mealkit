import { Route, Switch } from 'react-router-dom';
import SplitPane from 'react-split-pane';

import { Sidebar } from './components/sidebar/Sidebar';
import { CreateRecipe } from './components/recipe/CreateRecipe';
import { SingleRecipeDetails } from './components/recipe/SingleRecipeDetails';
import { MealPlan } from './components/mealPlan/MealPlan';
import { ShoppingList } from './components/groceries/ShoppingList';
import { Login } from './components/login/Login';
import { RecipeModal } from './components/recipe/RecipeModal';
import { CreateRecipeModal } from './components/recipe/CreateRecipeModal';
import { ShoppingListModal } from './components/groceries/ShoppingListModal';
import { AttributionModal } from './components/footer/AttributionModal';
import { LoginRedirect } from './components/login/LoginRedirect';
import { useAuthContext } from './useAuthContext';
import { ReactComponent as CarrotLogo } from './components/sidebar/images/logo-carrot.svg';

const App = () => {
  const { isLoggedIn, isLoggingIn } = useAuthContext();

  if (isLoggingIn) {
    return (
      <div className='w-full h-full flex items-center justify-center motion-safe:animate-bounce'>
        <CarrotLogo className='w-16' />
      </div>
    );
  }
  if (!isLoggedIn) {
    return <Login />;
  }
  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/loginRedirect' component={LoginRedirect} />
      <Route>
        <CreateRecipeModal />
        <RecipeModal />
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
              <Route exact path='/grocerylist' component={ShoppingList} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </div>
        </SplitPane>
      </Route>
    </Switch>
  );
};

export default App;
