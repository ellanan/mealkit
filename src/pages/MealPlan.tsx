/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime, Interval } from 'luxon';

export const MealPlan = () => {
  const startDate = DateTime.now().startOf('week');
  const endDate = startDate.endOf('week');

  const interval = Interval.fromDateTimes(startDate, endDate)
    .splitBy({ days: 1 })
    .map((d: Interval) => d.start);

  console.log(interval);

  return (
    <>
      <h1>meal plan</h1>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h2>
          {interval[0].monthLong} {interval[0].year}
        </h2>
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          `}
        >
          {interval.map((day) => (
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                border: 1px solid #000;
              `}
              key={day.toISO()}
            >
              <span>{day.weekdayShort}</span>
              <span>{day.day}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
