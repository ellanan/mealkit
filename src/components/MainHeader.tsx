/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

const Li = styled.li`
  padding: 1em;
`;

export const MainHeader = () => {
  return (
    <nav
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
      `}
    >
      <NavLink to='/'>
        <h1>MealKit</h1>
      </NavLink>
      <ul
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        `}
      >
        <Li>
          <NavLink to='/createrecipe'>create recipe</NavLink>
        </Li>
        <Li>
          <NavLink to='/recipes'>recipes</NavLink>
        </Li>
        <Li>
          <NavLink to='/mealplan'>meal plan</NavLink>
        </Li>
        <Li>
          <NavLink to='/grocerylist'>grocery list</NavLink>
        </Li>
        <Li>
          <NavLink to='/login'>login</NavLink>
        </Li>
      </ul>
    </nav>
  );
};
