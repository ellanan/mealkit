import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import Typewritter from 'typewriter-effect';

import { Footer } from '../footer/Footer';
import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';

export const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='flex flex-col h-full w-full font-Montserrat'>
      <div className='flex items-center mx-8 mt-6'>
        <NavLink
          to='/'
          className='text-3xl font-medium text-23 font-Montserrat flex'
        >
          <CarrotLogo className='w-7 mr-1.5' />
          MealKit
        </NavLink>
        <button
          className='ml-auto rounded-full text-white text-base py-1 px-3 bg-28 hover:bg-23 font-medium'
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
      </div>
      <div className='flex items-center justify-center relative text-center m-4'>
        <img
          className='w-7/12 rounded-full'
          src={require('../../images/healthy-vegetables-small.jpg').default}
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
      <div className='flex items-center justify-start my-4 mx-12 text-14 text-3xl font-medium'>
        <h1>Plan</h1>
        <img
          className='mt-4 w-5/12 rounded-xl ml-6'
          src={require('../../images/meal-planner2.jpg').default}
          alt=''
        />
      </div>
      <div className='flex items-center justify-end my-4 mx-12 text-14 text-3xl font-medium'>
        <img
          className='mt-4 w-5/12 rounded-xl mr-6'
          src={require('../../images/shop.jpg').default}
          alt=''
        />
        <h1>Shop</h1>
      </div>
      <div className='flex items-center justify-start my-4 mx-12 text-14 text-3xl font-medium'>
        <h1>Cook</h1>
        <img
          className='mt-4 w-5/12 rounded-xl ml-6'
          src={require('../../images/cook.jpg').default}
          alt=''
        />
      </div>
      <div className='flex items-center justify-end my-4 mx-12 text-14 text-3xl font-medium'>
        <img
          className='mt-4 w-5/12 rounded-xl mr-6'
          src={require('../../images/enjoy.jpg').default}
          alt=''
        />
        <h1>Enjoy</h1>
      </div>
      <Footer />
    </div>
  );
};
