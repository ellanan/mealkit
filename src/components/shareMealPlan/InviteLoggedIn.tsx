import { useLocation, useHistory } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { Button } from '@chakra-ui/react';

export const InviteLoggedIn = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const mealPlanId = queryParams.get('mealPlanId');

  const [joinMealPlan] = useMutation<
    GraphQLTypes.JoinMealPlanMutation,
    GraphQLTypes.JoinMealPlanMutationVariables
  >(
    gql`
      mutation JoinMealPlan($mealPlanId: ID!) {
        joinMealPlan(mealPlanId: $mealPlanId) {
          id
        }
      }
    `,
    {
      variables: {
        mealPlanId: mealPlanId as string,
      },
    }
  );

  return (
    <div className='flex flex-col items-center justify-center w-full h-full text-14'>
      {location.pathname === '/invite' &&
      mealPlanId !== 'null' &&
      mealPlanId?.length === 25 &&
      window.location.search.length === 37 ? (
        <div>
          <span className='text-xl'>
            Your friend invited you to a meal plan. Would you like to join?
          </span>
          <div className='flex flex-col items-center justify-center'>
            <Button
              className='mt-8 mb-3 bg-green-400 text-white hover:bg-green-500'
              onClick={() => {
                joinMealPlan().then(() => {
                  history.push('/mealplanner');
                });
                if (mealPlanId === undefined || mealPlanId === null) {
                  throw new Error('mealPlanId is undefined');
                }
              }}
            >
              Yes, join meal plan
            </Button>
            <Button
              className='mb-3'
              onClick={() => {
                return history.push('/mealplanner');
              }}
            >
              No, start my own meal plan
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <span className='text-xl mb-8'>
            It does not look like you were invited to a valid meal plan.
          </span>
          <Button
            className='mb-2 bg-green-400 text-white hover:bg-green-500'
            onClick={() => {
              return history.push('/mealplanner');
            }}
          >
            Go back to my meal plan
          </Button>
        </div>
      )}
    </div>
  );
};
