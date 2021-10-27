import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { Route, Switch } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import SplitPane from 'react-split-pane';

import { Sidebar } from './components/Sidebar';
import { CreateRecipe } from './pages/CreateRecipe';
import { SingleRecipeDetails } from './pages/SingleRecipeDetails';
import { MealPlan } from './pages/MealPlan';
import { ShoppingList } from './pages/ShoppingList';
import { Login } from './pages/Login';
import { RecipeModal } from './components/RecipeModal';
import { CreateRecipeModal } from './components/CreateRecipeModal';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <CreateRecipeModal />
        <RecipeModal />
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
      </ChakraProvider>
    </ApolloProvider>
  );
};

export default App;
