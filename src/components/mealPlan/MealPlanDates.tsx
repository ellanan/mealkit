/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import classnames from "classnames";
import { DateTime } from "luxon";

export const MealPlanDates = (props: {
  today: DateTime;
  interval: DateTime[];
}) => {
  return (
    <div
      className="flex flex-shrink-0 overflow-y-scroll"
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
            className="relative flex-grow pt-3 px-5 text-14"
            key={day.toISO()}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs uppercase">{day.weekdayShort}</span>
              <span
                className={classnames(
                  "flex items-center justify-center rounded-3xl p-4 h-7 w-7 mt-0.5",
                  props.today.hasSame(day, "day") && "bg-23 text-white",
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
