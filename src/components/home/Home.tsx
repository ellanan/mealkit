/** @jsxImportSource @emotion/react */
import { useAuth0 } from "@auth0/auth0-react";
import { css } from "@emotion/react";
import { MdDownload } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Typewritter from "typewriter-effect";

import { Footer } from "../footer/Footer";

import veggies1Image from "./images/bg-veggies/veggies1.png";
import footerWaveImage from "./images/footer-wave.svg";
import groceriesListExampleImage from "./images/groceries-list-example.png";
import healthyVegImage from "./images/healthy-vegetables.png";
import MainBlob from "./images/mainblob.svg";
import mealPlanExampleMobileImage from "./images/meal-plan-example-mobile.png";
import sharePlanExampleImage from "./images/share-plan-example.svg";
import CarrotLogo from "../../images/logo-carrot.svg";

export const Home = () => {
  const { loginWithRedirect } = useAuth0();

  // Electron
  const platform =
    navigator?.platform ?? (navigator as any).userAgentData.platform;
  const isMac = platform.indexOf("Mac") > -1;
  const isWindows = platform.indexOf("Win") > -1;

  return (
    <div className="flex flex-col h-full w-full font-Montserrat">
      <div className="flex items-center pl-12 pr-8 py-6">
        <NavLink
          to="/mealplanner"
          className="text-3xl font-medium text-23 font-Montserrat flex"
        >
          <CarrotLogo className="w-7 h-7 mr-1.5" />
          MealKit
        </NavLink>
        <button
          className="ml-auto rounded-full text-white text-base py-1 px-3 bg-23 hover:bg-25 font-medium"
          onClick={() => loginWithRedirect()}
        >
          Sign In
        </button>
      </div>

      <h1 className="text-14 text-5xl text-center font-extrabold font-Vollkorn px-4 pt-6 pb-12 mt-10 max-w-[19em] mx-auto">
        Don't let food be something that "happens to you"
      </h1>

      <div className="relative flex items-center justify-center text-center mb-20">
        <MainBlob className="absolute w-3/4" />
        <img
          className="relative w-5/12"
          src={healthyVegImage}
          alt="healthy vegetables"
        />
        <span className="absolute text-14 text-3xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/4">
          What's for <br />
          <Typewritter
            options={{
              strings: ["breakfast?", "lunch?", "dinner?"],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </div>

      <div className="flex items-center justify-center my-28 mb-16 mx-auto w-full">
        <div className="max-w-[320px]">
          <h1 className="text-14 text-4xl font-bold pb-5">
            Plan meals for the week
          </h1>
          <p className="text-lg">
            Easily plan your breakfasts, lunches and dinners by selecting from
            recipes in your library.
          </p>
        </div>
        <img
          className="mt-6 w-7/12 max-w-[800px] rounded-xl"
          src={mealPlanExampleMobileImage}
          alt=""
        />
      </div>

      <div className="relative flex items-center justify-center gap-[20vw] mt-52 mb-16 mx-auto w-full">
        <div className="relative mt-6 w-[300px] pr-4 rounded-xl translate-x-[120px] xl:translate-x-0">
          <img
            className="absolute w-11/12 right-0 transform translate-x-[83%] translate-y-[-15%]"
            css={css`
              @media (max-width: 1280px) {
                && {
                  transform: rotateY(180deg) translateX(55%) translateY(-15%);
                  right: auto;
                  left: 0;
                }
              }
            `}
            src={veggies1Image}
            alt=""
          />
          <img
            className="relative md:translate-x-[14%]"
            src={groceriesListExampleImage}
            alt=""
          />
        </div>
        <div className="relative max-w-[320px] backdrop-filter brightness-150 md:ml-14">
          <h1 className="text-14 text-4xl font-bold pb-5">
            Auto generate grocery list
          </h1>
          <p className="text-lg">
            Auto-generate your shopping list based on meals planned in the
            selected date range.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center my-16 mx-auto w-full">
        <div className="max-w-[320px]">
          <h1 className="text-14 text-4xl font-bold pb-5">
            Collaborate with family and friends
          </h1>
          <p className="text-lg">
            Share and view a single meal plan for housemates that cook together,
            or ones who are always asking "what's for breakfast/lunch/dinner?"
          </p>
        </div>
        <img
          className="mt-6 w-6/12 max-w-[800px] rounded-xl"
          src={sharePlanExampleImage}
          alt=""
        />
      </div>

      {(isMac || isWindows) && (
        <div className="flex flex-col items-center justify-center mx-auto w-full text-15 font-Montserrat mt-10">
          {isMac ? (
            <>
              <a
                className="text-white text-lg font-bold min-h-[60px] px-8 rounded-md bg-17 flex justify-center items-center ease-out duration-[400ms] active:bg-[#ffe9df] active:text-[#b5b0ad]"
                css={css`
                  &:hover {
                    box-shadow: inset 0 0 0 2px #ffffff;
                  }
                `}
                href="https://github.com/ellanan/mealkit/releases/download/0.1.0/MealKit-0.1.0.dmg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdDownload className="inline-block -ml-1 mr-1" size="28" />
                Download for Mac
              </a>
              <a
                className="text-14 mt-4 text-sm font-bold mb-[1px] hover:mb-0 border-b-1 hover:border-b-2 border-14"
                href="https://github.com/ellanan/mealkit/releases/download/0.1.0/MealKit.0.1.0.exe"
                target="_blank"
                rel="noopener noreferrer"
              >
                Also available on Windows
              </a>
            </>
          ) : (
            <>
              <a
                className="text-white text-lg font-bold min-h-[60px] px-8 rounded-md bg-17 flex justify-center items-center ease-out duration-[400ms] active:bg-[#ffe9df] active:text-[#b5b0ad]"
                css={css`
                  &:hover {
                    box-shadow: inset 0 0 0 2px #ffffff;
                  }
                `}
                href="https://github.com/ellanan/mealkit/releases/download/0.1.0/MealKit.0.1.0.exe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdDownload className="inline-block -ml-1 mr-1" size="28" />
                Download for Windows
              </a>
              <a
                className="text-14 mt-4 text-sm font-bold mb-[1px] hover:mb-0 border-b-1 hover:border-b-2 border-14"
                href="https://github.com/ellanan/mealkit/releases/download/0.1.0/MealKit-0.1.0.dmg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Also available on Mac
              </a>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col items-center bg-29 mt-24 pb-4 relative text-[#b06537]">
        <img
          src={footerWaveImage}
          alt=""
          className="transform -translate-y-full absolute top-[1px]"
        />
        <h1 className="text-sm font-semibold mt-5">
          MealKit is created by Ella Nan
        </h1>
        <div className="flex items-center">
          <ul className="p-2 text-xs leading-5 flex flex-col items-center">
            <li className="flex ">
              <a
                className="px-4 hover:text-25 hover:underline"
                href="https://icon-library.com/840638.svg.html"
                target="_blank"
                rel="noreferrer"
              >
                Carrot logo created by Free ICONS Library
              </a>
            </li>
            <li className="flex items-center">
              <a
                className="px-4 hover:text-25 hover:underline"
                href="https://www.freepik.com/photos/background"
              >
                Healthy vegetables created by jcomp - www.freepik.com
              </a>
            </li>
            <li className="flex items-center">
              <a
                className="px-4 hover:text-25 hover:underline"
                href="https://www.freepik.com/vectors/food"
              >
                Family cooking together created by pch.vector - www.freepik.com
              </a>
            </li>

            <li className="flex items-center">
              <a
                className="px-4 hover:text-25 hover:underline"
                href="https://www.freepik.com/vectors/food"
              >
                Background vegetables created by macrovector - www.freepik.com
              </a>
            </li>
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};
