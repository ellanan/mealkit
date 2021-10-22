/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { Sidebar } from './components/Sidebar';
import { CreateRecipe } from './pages/CreateRecipe';
import { Recipes } from './pages/Recipes';
import { SingleRecipeDetails } from './pages/SingleRecipeDetails';
import { MealPlan } from './pages/MealPlan';
import { ShoppingList } from './pages/ShoppingList';
import { Login } from './pages/Login';
import SplitPane from 'react-split-pane';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <SplitPane
          split='vertical'
          defaultSize={200}
          maxSize={Math.min(window.innerWidth / 3, 500)}
          minSize={100}
        >
          <Sidebar />
          <div>
            <Switch>
              <Route exact path='/' component={MealPlan} />
              <Route exact path='/recipes' component={Recipes} />
              <Route
                exact
                path='/recipes/create-recipe'
                component={CreateRecipe}
              />
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
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
