import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import Typewritter from 'typewriter-effect';

import { Footer } from '../footer/Footer';
import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';
import { ReactComponent as MainBlob } from '../home/images/mainblob.svg';

export const MobileHome = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex flex-col h-full w-full font-Montserrat'>
      <div className='flex items-center p-6'>
        <NavLink
          to='/mealplanner'
          className='text-3xl font-medium text-23 font-Montserrat flex'
        >
          <CarrotLogo className='w-7 h-7 mr-1.5' />
          MealKit
        </NavLink>
        <button
          className='ml-auto rounded-full text-white text-base py-1 px-3 bg-23 hover:bg-25 font-medium'
          onClick={() => loginWithRedirect()}
        >
          Sign In
        </button>
      </div>

      <h1 className='text-14 text-4xl text-center font-extrabold font-Vollkorn px-4 pt-4 pb-12 mt-10 max-w-[19em] mx-auto'>
        Don't let food be something that "happens to you"
      </h1>

      <div className='flex items-center justify-center relative text-center mb-20'>
        <MainBlob className='absolute w-3/4 -top-[-16.5rem]' />
        <img
          className='w-9/12 relative'
          src={require('../home/images/healthy-vegetables.png').default}
          alt='healthy vegetables'
        />
        <span className='absolute text-14 text-base top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/4'>
          What's for
          <Typewritter
            options={{
              strings: ['breakfast?', 'lunch?', 'dinner?'],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </div>

      <div className='flex flex-col items-center justify-center my-6 mx-10'>
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-4'>
            Plan meals for the week
          </h1>
          <p className='text-lg'>
            Easily plan your breakfasts, lunches and dinners by selecting from
            recipes in your library.
          </p>
        </div>
        <img
          className='mt-6 w-10/12 rounded-xl'
          src={require('../home/images/meal-plan-example.jpg').default}
          alt=''
        />
      </div>

      <div className='flex flex-col items-center justify-center my-6 mx-10'>
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-4'>
            Auto generate grocery list
          </h1>
          <p className='text-lg'>
            Auto-generate your shopping list based on meals planned in the
            selected date range.
          </p>
        </div>
        <img
          className='mt-6 w-10/12 rounded-xl'
          src={require('../home/images/groceries-list-example.jpg').default}
          alt=''
        />
      </div>

      <div className='flex flex-col items-center justify-center my-6 mx-10'>
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-4'>
            Collaborate with family and friends
          </h1>
          <p className='text-lg'>
            Share and view a single meal plan for housemates that cook together,
            or ones who are always asking "what's for breakfast/lunch/dinner?"
          </p>
        </div>
        <img
          className='mt-6 w-10/12 rounded-xl'
          src={require('../home/images/share-plan-example.svg').default}
          alt=''
        />
      </div>

      <div className='flex flex-col items-center min-h-[240px] bg-29 mt-24 relative'>
        <img
          src={require('../home/images/footer-wave.svg').default}
          alt=''
          className='transform -translate-y-full absolute top-[1px]'
        />
        <h1 className='text-14 text-sm font-semibold mt-8'>ATTRIBUTIONS</h1>
        <div className='flex items-center justify-start'>
          <ul className='text-xs text-14 mt-4'>
            <li className='flex items-center'>
              <a
                className='text-14 px-4 py-2 hover:text-25 hover:underline'
                href='https://icon-library.com/840638.svg.html'
              >
                1. Carrot logo created by Free ICONS Library
              </a>
            </li>

            <li className='flex items-center'>
              <a
                className='text-14 px-4 py-2 hover:text-25 hover:underline'
                href='https://www.freepik.com/photos/background'
              >
                2. Healthy vegetables created by jcomp - www.freepik.com
              </a>
            </li>

            <li className='flex items-center'>
              <a
                className='text-14 px-4 py-2 hover:text-25 hover:underline'
                href='https://www.freepik.com/vectors/food'
              >
                3. Family cooking together created by pch.vector -
                www.freepik.com
              </a>
            </li>
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};
