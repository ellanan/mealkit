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
          font-weight: 500;
          font-family: 'Raleway', sans-serif;

          .main-nav-link {
            position: relative;
            &.active {
              &:after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0px;
                width: 100%;
                height: 2px;
                background-color: #444;
              }
            }
          }
        `}
      >
        <Li>
          <NavLink
            to='/'
            exact
            className='main-nav-link'
            activeClassName='active'
          >
            Meal Plan
          </NavLink>
        </Li>
        <Li>
          <NavLink
            to='/recipes'
            className='main-nav-link'
            activeClassName='active'
          >
            Recipes
          </NavLink>
        </Li>
        <Li>
          <NavLink
            to='/grocerylist'
            className='main-nav-link'
            activeClassName='active'
          >
            Shopping List
          </NavLink>
        </Li>
        <Li>
          <NavLink
            to='/login'
            className='main-nav-link'
            activeClassName='active'
          >
            Login
          </NavLink>
        </Li>
      </ul>
    </nav>
  );
};
