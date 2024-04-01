/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { NavLink } from "react-router-dom";

import { Setting } from "../sidebar/Setting";

import carrotLogo from "../../images/logo-carrot.svg";

export const MobileTopNavbar = () => {
  return (
    <div
      className="top-0 transition z-30 fixed w-full h-100px font-Raleway flex items-center justify-start bg-24 py-3 px-4"
      css={css`
        .scrolling-down & {
          transform: translateY(-100%);
        }
      `}
    >
      <NavLink
        to="/mealplanner"
        className="text-lg font-medium text-23 font-Montserrat flex h-5"
      >
        <img src={carrotLogo} className="w-5 h-5 mr-1.5" />
        MealKit
      </NavLink>
      <Setting />
    </div>
  );
};
