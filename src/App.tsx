import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { MainHeader } from './components/MainHeader';
import { CreateRecipe } from './pages/CreateRecipe';
import { Recipes } from './pages/Recipes';
import { SingleRecipeDetails } from './pages/SingleRecipeDetails';
import { MealPlan } from './pages/MealPlan';
import { GroceryList } from './pages/GroceryList';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <MainHeader />
        <Switch>
          <Route exact path='/' component={MealPlan} />
          <Route exact path='/recipes' component={Recipes} />
          <Route exact path='/recipes/create-recipe' component={CreateRecipe} />
          <Route
            exact
            path='/recipes/:recipeId'
            render={({ match }) => (
              <SingleRecipeDetails recipeId={match.params.recipeId} />
            )}
          />
          <Route exact path='/grocerylist' component={GroceryList} />
          <Route exact path='/login' component={Login} />
        </Switch>
        <Footer />
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
