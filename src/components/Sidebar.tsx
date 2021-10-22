/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

import { Recipes } from '../pages/Recipes';
import { Footer } from './Footer';

const Li = styled.li`
  padding: 1em;
`;

export const Sidebar = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff2ec;
        border-right: 1px solid #ffddcd;
        height: 100%;
      `}
    >
      <NavLink to='/'>
        <h1>MealKit</h1>
      </NavLink>
      <Recipes />
      <ul
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          font-weight: 500;
          font-family: 'Raleway', sans-serif;

          /* .main-nav-link {
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
          } */
        `}
      >
        {/* <Li>
          <NavLink
            to='/recipes'
            className='main-nav-link'
            activeClassName='active'
          >
            Recipes
          </NavLink>
        </Li> */}
        {/* <Li>
          <NavLink
            to='/login'
            className='main-nav-link'
            activeClassName='active'
            css={css`
              height: 100%;
              margin-top: auto;
            `}
          >
            Login
          </NavLink>
        </Li> */}
      </ul>
      <Footer />
    </div>
  );
};
