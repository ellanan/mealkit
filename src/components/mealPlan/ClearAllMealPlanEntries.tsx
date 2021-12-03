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
import { MdNoMealsOuline } from 'react-icons/md';
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
    <>
      <button
        className='flex items-center justify-center text-14 text-sm py-2 hover:bg-12'
        onClick={() => setIsDeleteMealEntriesOpen(true)}
      >
        <MdNoMealsOuline size={12} className='min-w-[20px] mr-2' />
        Clear Meal Plan
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
    </>
  );
};
