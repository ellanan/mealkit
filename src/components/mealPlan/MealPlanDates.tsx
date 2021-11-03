/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import classnames from 'classnames';
import { DateTime } from 'luxon';

export const MealPlanDates = (props: {
  today: DateTime;
  interval: DateTime[];
}) => {
  return (
    <div
      className='flex flex-shrink-0 overflow-y-scroll'
      css={css`
        /* accommodate for the content below having as scrollbar;
             we need a scrollbar to take up the same amount of width, but we don't want to show it */
        ::-webkit-scrollbar {
          background: transparent;
        }
      `}
    >
      {props.interval.map((day) => {
        return (
          <div
            className='relative flex-grow py-3 px-5 text-14'
            key={day.toISO()}
            css={css`
              &:not(:last-child):after {
                content: '';
                display: block;
                width: 1px;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0;
                background-image: linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0),
                  #f1e6e2 30%,
                  #f1e6e2
                );
              }
            `}
          >
            <div className='flex flex-col items-center justify-center'>
              <span className='text-xs uppercase'>{day.weekdayShort}</span>
              <span
                className={classnames(
                  'flex items-center justify-center rounded-3xl p-4 h-7 w-7',
                  props.today.hasSame(day, 'day') && 'bg-[#f88c5a] text-white'
                )}
              >
                {day.day}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
