import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../../generated/graphql';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { VscAccount } from 'react-icons/vsc';
import { RiUserSettingsLine } from 'react-icons/ri';
import { useState, useRef } from 'react';

import { Login } from '../login/Login';

export const Setting = () => {
  const { user } = useAuth0();

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
    <div className='flex items-center justify-center pt-3 pb-5'>
      <Popover closeOnBlur={true} closeOnEsc={true}>
        <PopoverTrigger>
          <button className='rounded-full text-white py-2 px-2 bg-28 hover:bg-23'>
            <RiUserSettingsLine size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='focus:shadow-none'
          maxWidth='280'
          minWidth='240'
          shadow='lg'
          borderRadius='10px'
        >
          <div className='flex flex-col items-center justify-center my-6 text-14'>
            {user?.image !== null || undefined ? (
              <img
                className='w-14 h-14 rounded-full'
                src={user?.picture}
                alt=''
              />
            ) : (
              <VscAccount className='text-23' size={22} />
            )}
            <span className='mt-2 text-lg font-medium'>
              {user?.name?.includes('@')
                ? user?.email?.substring(0, user.email.lastIndexOf('@'))
                : user?.name}
            </span>
            <span className='mt-1 text-sm'>{user?.email}</span>
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
                            mealPlanId: data?.currentUser?.mealPlan
                              ?.id as string,
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

            <Login />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
