import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { Route, Switch } from 'react-router-dom';

import { MainHeader } from './components/MainHeader';
import { CreateRecipe } from './pages/CreateRecipe';
import { Recipes } from './pages/Recipes';
import { SingleRecipe } from './pages/SingleRecipe';
import { MealPlan } from './pages/MealPlan';
import { GroceryList } from './pages/GroceryList';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <MainHeader />
      <Switch>
        <Route exact path='/' component={MealPlan} />
        <Route exact path='/recipes' component={Recipes} />
        <Route exact path='/recipes/create-recipe' component={CreateRecipe} />
        <Route
          exact
          path='/recipes/:recipeId'
          render={({ match }) => (
            <SingleRecipe recipeId={match.params.recipeId} />
          )}
        />
        <Route exact path='/grocerylist' component={GroceryList} />
        <Route exact path='/login' component={Login} />
      </Switch>
      <Footer />
    </ApolloProvider>
  );
};

export default App;
