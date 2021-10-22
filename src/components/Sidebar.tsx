/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';

import { Recipes } from '../pages/Recipes';
import { Footer } from './Footer';

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
        padding-top: 1rem;
        font-family: 'Raleway', sans-serif;
      `}
    >
      <NavLink to='/'>
        <h1
          css={css`
            font-size: 18px;
            font-weight: 500;
            font-family: 'Montserrat', sans-serif;
            color: #f59769;
          `}
        >
          MealKit
        </h1>
      </NavLink>
      <div
        css={css`
          overflow: auto;

          scrollbar-width: thin;
          scrollbar-color: #e7a47a60 transparent;
          ::-webkit-scrollbar {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            border-bottom: 4px solid #fff2ec;
            border-left: 4px solid #fff2ec;
            border-right: 4px solid #fff2ec;
            border-top: 4px solid #fff2ec;
            border-radius: 8px;
            background: #e7a47a60;
            min-height: 40 px;
          }
        `}
      >
        <Recipes />
      </div>
      <ul
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          font-weight: 500;
        `}
      >
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
