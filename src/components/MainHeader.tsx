/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { CreateRecipe } from './CreateRecipe';

export const MainHeader = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <h1>MealKit</h1>
      <button>home</button>
      <CreateRecipe />
      <button>recipes</button>
      <button>meal plan</button>
      <button>grocery list</button>
      <button>login</button>
    </div>
  );
};
