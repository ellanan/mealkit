import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';
import { Route, Switch } from 'react-router-dom';

import { MainHeader } from './components/MainHeader';
import { Home } from './pages/Home';
import { CreateRecipe } from './pages/CreateRecipe';
import { Recipes } from './pages/Recipes';
import { MealPlan } from './pages/MealPlan';
import { GroceryList } from './pages/GroceryList';
import { Login } from './pages/Login';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <MainHeader />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/createrecipe'>
          <CreateRecipe />
        </Route>
        <Route path='/recipes'>
          <Recipes />
        </Route>
        <Route path='/mealplan'>
          <MealPlan />
        </Route>
        <Route path='/grocerylist'>
          <GroceryList />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
      </Switch>
      <Footer />
    </ApolloProvider>
  );
};

export default App;
