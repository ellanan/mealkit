import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { NavLink } from "react-router-dom";

export const MealPlanTopBar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  return (
    <div className="flex items-center justify-start mt-4">
      <Button
        className="text-11 my-0 mx-5 rounded-full border-solid border-1 border-gray-300 focus:shadow-none hover:bg-gray-100 bg-transparent transition-all duration-150 hover:scale-105"
        onClick={(e) => {
          e.preventDefault();
          props.setStartDate(props.today.startOf("week"));
        }}
        size={"sm"}
      >
        Today
      </Button>

      <Button
        className="bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12 transition-all duration-150 hover:scale-110"
        onClick={() => {
          props.setStartDate(props.startDate.minus({ weeks: 1 }));
        }}
      >
        <ChevronLeftIcon w={6} h={6} />
      </Button>

      <Button
        className="ml-0.5 bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12 transition-all duration-150 hover:scale-110"
        onClick={() => {
          props.setStartDate(props.startDate.plus({ weeks: 1 }));
        }}
      >
        <ChevronRightIcon w={6} h={6} />
      </Button>

      <span className="flex items-center justify-start text-13 my-0 mx-6 font-medium text-xl">
        {`${props.interval[0].monthLong} ${props.interval[0].year}`}
      </span>

      <NavLink
        className="flex flex-row items-center ml-auto mr-5 rounded-full text-white text-sm py-1 px-3 bg-23 transition-all duration-150 hover:scale-105 font-medium uppercase tracking-wide"
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append("shoppingList", "visible");

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        Groceries
      </NavLink>
    </div>
  );
};
