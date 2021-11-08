import { GoMarkGithub } from 'react-icons/go';
import { FaTwitter } from 'react-icons/fa';
import { GrLinkedin } from 'react-icons/gr';
import { GoInfo } from 'react-icons/go';
import { NavLink } from 'react-router-dom';

export const Footer = () => {
  return (
    <div className='flex flex-row items-center justify-center mt-auto w-full py-1 px-0'>
      <a
        className='p-3 text-22 hover:text-21'
        href='https://github.com/ellanan'
        target='_blank'
        rel='noreferrer'
      >
        <GoMarkGithub size={18} />
      </a>
      <a
        className='p-3 text-22 hover:text-21'
        href='https://twitter.com/ellanan_'
        target='_blank'
        rel='noreferrer'
      >
        <FaTwitter size={18} />
      </a>
      <a
        className='p-3 text-22 hover:text-21'
        href='https://www.linkedin.com/in/ella-nan-a8b39027/'
        target='_blank'
        rel='noreferrer'
      >
        <GrLinkedin size={18} />
      </a>
      <NavLink
        className='p-3 text-22 hover:text-21'
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append('attribution', 'visible');

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        <GoInfo size={18} />
      </NavLink>
    </div>
  );
};
