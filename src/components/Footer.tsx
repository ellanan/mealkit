/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GoMarkGithub } from 'react-icons/go';
import { FaTwitter } from 'react-icons/fa';
import { GrLinkedin } from 'react-icons/gr';

export const Footer = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: auto;
        width: 100%;
        padding-bottom: 0.6rem;

        & > a {
          color: #e7a47ac6;
          &:hover {
            color: #e7a47a;
          }
        }
      `}
    >
      <a
        href='https://github.com/ellanan'
        target='_blank'
        rel='noreferrer'
        css={css`
          padding: 10px;
        `}
      >
        <GoMarkGithub size={18} />
      </a>
      <a
        href='https://twitter.com/ellanan_'
        target='_blank'
        rel='noreferrer'
        css={css`
          padding: 10px;
        `}
      >
        <FaTwitter size={18} />
      </a>
      <a
        href='https://www.linkedin.com/in/ella-nan-a8b39027/'
        target='_blank'
        rel='noreferrer'
        css={css`
          padding: 10px;
        `}
      >
        <GrLinkedin size={18} />
      </a>
    </div>
  );
};
