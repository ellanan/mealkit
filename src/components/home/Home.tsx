import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import Typewritter from 'typewriter-effect';

import { Footer } from '../footer/Footer';
import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';
import { ReactComponent as MainBlob } from '../../images/mainblob.svg';

export const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex flex-col h-full w-full font-Montserrat'>
      <div className='flex items-center pl-12 pr-8 py-4'>
        <NavLink
          to='/'
          className='text-3xl font-medium text-23 font-Montserrat flex'
        >
          <CarrotLogo className='w-7 mr-1.5' />
          MealKit
        </NavLink>
        <button
          className='ml-auto rounded-full text-white text-base py-1 px-3 bg-23 hover:bg-25 font-medium'
          onClick={() => loginWithRedirect()}
        >
          Sign In
        </button>
      </div>

      <h1 className='text-14 text-4xl text-center font-extrabold font-Vollkorn px-4 pt-6 pb-12 mt-10 max-w-[19em] mx-auto'>
        Don't let food be something that "happens to you"
      </h1>

      <div className='flex items-center justify-center relative text-center mb-20'>
        <MainBlob className='absolute w-3/4 -top-[-16.5rem]' />
        <img
          className='w-6/12 rounded-full relative'
          src={require('../../images/healthy-vegetables-small.png').default}
          alt='healthy vegetables'
        />
        <span className='absolute text-14 text-3xl top-2/4 left-2/4 -translate-x-2/4 -translate-y-1/4'>
          What's for <br />
          <Typewritter
            options={{
              strings: ['breakfast?', 'lunch?', 'dinner?'],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </div>

      <div className='flex items-center justify-between my-6 mx-28'>
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-2'>
            Plan meals for the week
          </h1>
          <p>
            Easily plan your breakfasts, lunches and dinners by selecting from
            recipes in your library.
          </p>
        </div>
        <img
          className='mt-4 w-6/12 rounded-xl'
          src={require('../../images/meal-plan-example.jpg').default}
          alt=''
        />
      </div>

      <div className='flex items-center justify-between my-6 mx-28'>
        <img
          className='mt-4 w-6/12 rounded-xl'
          src={require('../../images/groceries-list-example.jpg').default}
          alt=''
        />
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-2'>
            Automated grocery list
          </h1>
          <p>
            Auto-generate your shopping list based on your meal plan for the
            selected date range.
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between my-6 mx-28'>
        <div className='max-w-[320px]'>
          <h1 className='text-14 text-2xl font-bold pb-2'>
            Collaborate on meal plans with family and friends
          </h1>
          <p>
            Share and view a single meal plan for housemates that cook together,
            or ones who are always asking "what's for breakfast/lunch/dinner?"
          </p>
        </div>
        <img
          className='mt-4 w-6/12 rounded-xl'
          src={require('../../images/share-plan-example.jpg').default}
          alt=''
        />
      </div>

      <div className='flex flex-col items-center justify-center min-h-[240px] bg-29 mt-8 pt-4'>
        <h1 className='text-14 text-sm font-semibold'>ATTRIBUTION</h1>
        <div className='flex items-center'>
          <ul className='p-2 text-xs text-14'>
            <li className='flex items-center'>
              <CarrotLogo className='w-5 mb-4' /> | Carrot logo created by Free
              ICONS Library |
              <a
                className='text-14 hover:text-25 hover:underline'
                href='https://icon-library.com/840638.svg.html'
                target='_blank'
                rel='noreferrer'
              >
                https://icon-library.com/840638.svg.html
              </a>
            </li>
            <li>attribution</li>
            <li>attribution</li>
            <li>attribution</li>
          </ul>
          <ul className='p-2 text-xs text-14'>
            <li className='flex items-center'>
              <CarrotLogo className='w-5 mb-4' /> Carrot logo created by Free
              ICONS Library
              <a
                className='text-14 hover:text-25 hover:underline'
                href='https://icon-library.com/840638.svg.html'
                target='_blank'
                rel='noreferrer'
              >
                https://icon-library.com/840638.svg.html
              </a>
            </li>
            <li>attribution</li>
            <li>attribution</li>
            <li>attribution</li>
          </ul>
        </div>
        <Footer />
      </div>
    </div>
  );
};
