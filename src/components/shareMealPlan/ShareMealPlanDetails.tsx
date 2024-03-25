import { useState, useEffect } from "react";

import { useQuery, gql } from "@apollo/client";
import { FiLink2 } from "react-icons/fi";

import * as GraphQLTypes from "../../generated/graphql";

export const ShareMealPlanDetails = () => {
  const [copySuccessMessage, setCopySuccessMessage] = useState("");

  const { data, error: errorLoadingUserMealPlan } =
    useQuery<GraphQLTypes.CurrentUserMealPlanQuery>(gql`
      query CurrentUserMealPlan {
        currentUser {
          id
          mealPlan {
            id
          }
        }
      }
    `);
  if (errorLoadingUserMealPlan) {
    throw errorLoadingUserMealPlan;
  }

  const mealPlanUrl = `${window.location.origin}/invite?mealPlanId=${data?.currentUser?.mealPlan?.id}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopySuccessMessage("");
    }, 1000);
    return () => clearTimeout(timer);
  }, [copySuccessMessage]);

  return (
    <div className="flex flex-col text-14 text-lg p-5">
      <span className="flex items-center font-semibold">
        <FiLink2 size={18} className="min-w-[20px] mr-2" />
        <h1>Invite with link</h1>
      </span>

      <span className="flex items-center w-full mt-4">
        <input
          className="text-sm bg-12 p-2 min-w-[70%]"
          type="text"
          value={mealPlanUrl}
        />
        <button
          className="font-Raleway text-white font-semibold rounded-lg text-sm ml-auto p-2 bg-green-400 hover:bg-green-300"
          onClick={() => {
            navigator.clipboard.writeText(mealPlanUrl);
            setCopySuccessMessage("Copied to clipboard!");
          }}
        >
          Copy Link
        </button>
      </span>

      <p className="text-sm text-green-400 text-center min-h-[20px]">
        {copySuccessMessage}
      </p>

      <span className="text-sm mt-4">
        Anyone with link can join your meal plan
      </span>
    </div>
  );
};
