import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../../generated/graphql';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';

export const ClearAllMealPlanEntries = () => {
  const [isDeleteMealEntriesOpen, setIsDeleteMealEntriesOpen] =
    useState<boolean>(false);
  const cancelDeleteMealEntrieseRef = useRef<any>();

  const { data, error: errorLoadingCurrentUserMealPlan } =
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
  if (errorLoadingCurrentUserMealPlan) {
    throw errorLoadingCurrentUserMealPlan;
  }

  const [
    deleteAllMealPlanEntries,
    { error: errorDeletingAllMealPlanEntries, loading },
  ] = useMutation<
    GraphQLTypes.DeleteAllMealPlanEntriesMutation,
    GraphQLTypes.DeleteAllMealPlanEntriesMutationVariables
  >(
    gql`
      mutation DeleteAllMealPlanEntries($mealPlanId: ID!) {
        deleteAllMealPlanEntries(mealPlanId: $mealPlanId)
      }
    `
  );
  if (errorDeletingAllMealPlanEntries) {
    throw errorDeletingAllMealPlanEntries;
  }

  return (
    <div className='flex items-center justify-center'>
      <button
        className='text-14 text-xs px-3 py-2 mt-3 border-1 rounded-md font-medium bg-12 hover:bg-11 hover:text-white'
        onClick={() => setIsDeleteMealEntriesOpen(true)}
      >
        Clear meal plan
      </button>

      <AlertDialog
        isOpen={isDeleteMealEntriesOpen}
        leastDestructiveRef={cancelDeleteMealEntrieseRef}
        onClose={() => setIsDeleteMealEntriesOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Clear Meal Plan
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to clear meal plan entries?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelDeleteMealEntrieseRef}
                size={'sm'}
                onClick={(e) => setIsDeleteMealEntriesOpen(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme='red'
                size={'sm'}
                ml={3}
                disabled={loading}
                onClick={async (e) => {
                  e.preventDefault();
                  await deleteAllMealPlanEntries({
                    variables: {
                      mealPlanId: data?.currentUser?.mealPlan?.id as string,
                    },
                    update: (cache) => {
                      if (!data?.currentUser?.mealPlan) return;
                      cache.modify({
                        id: cache.identify(data.currentUser.mealPlan),
                        fields: {
                          schedule() {
                            return [];
                          },
                        },
                      });
                    },
                  });

                  setIsDeleteMealEntriesOpen(false);
                }}
              >
                Clear All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};
