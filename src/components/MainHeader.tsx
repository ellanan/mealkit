// /** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';

export const MainHeader = () => {
  return (
    <nav>
      <h1>MealKit</h1>
      <ul>
        <li>
          <NavLink to='/'>home</NavLink>
        </li>
        <li>
          <NavLink to='/createrecipe'>create recipe</NavLink>
        </li>
        <li>
          <NavLink to='/recipes'>recipes</NavLink>
        </li>
        <li>
          <NavLink to='/mealplan'>meal plan</NavLink>
        </li>
        <li>
          <NavLink to='/grocerylist'>grocery list</NavLink>
        </li>
        <li>
          <NavLink to='/login'>login</NavLink>
        </li>
      </ul>
    </nav>
  );
};
