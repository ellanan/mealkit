import _ from 'lodash';
import { useQuery, useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { gqlRecipeFragment } from '../mealPlan/AddRecipeToMealPlanForm';

export const InheritRecipesModal = () => {
  const { isAuthenticated } = useAuth0();
  const [deniedInheritence, setDeniedInheritence] = useState(false);

  const today = useMemo(() => DateTime.now(), []);

  const { data: checkUserRecipes, error: errorLoadingUserRecipes } =
    useQuery<GraphQLTypes.CheckUserRecipesQuery>(gql`
      query CheckUserRecipes {
        currentUser {
          id
          mealPlan {
            recipes {
              id
              name
            }
            id
          }
        }
      }
    `);
  if (errorLoadingUserRecipes) {
    throw errorLoadingUserRecipes;
  }

  const [inheritRecipes, { error: errorLoadingInheritRecipes }] = useMutation<
    GraphQLTypes.InitWithDataMutation,
    GraphQLTypes.InitWithDataMutationVariables
  >(
    gql`
      mutation InitWithData($startDate: String!, $endDate: String!) {
        initWithData(startDate: $startDate) {
          id
          schedule(startDate: $startDate, endDate: $endDate) {
            id
            date
            mealType
            recipe {
              ...RecipeFragment
            }
          }
        }
      }
      ${gqlRecipeFragment}
    `
  );
  if (errorLoadingInheritRecipes) {
    throw errorLoadingInheritRecipes;
  }

  // useDisclosure is a custom hook used to help handle common open, close, or toggle scenarios.
  // It can be used to control feedback component such as Modal, AlertDialog, Drawer, etc.
  const { isOpen, onClose } = useDisclosure({
    isOpen:
      !deniedInheritence &&
      isAuthenticated &&
      checkUserRecipes?.currentUser?.mealPlan?.recipes?.length === 0,
    onClose: () => {
      setDeniedInheritence(true);
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} autoFocus={false}>
      <ModalOverlay />
      <ModalContent minHeight='20vh' minWidth='40vw' overflow='auto'>
        <ModalHeader>
          <h1 className='text-14 text-xl'>Welcome</h1>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <p className='text-14 text-lg'>
            Would you like to add starter recipes?
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            className='text-white rounded-2xl min-w-[60px] mr-2 bg-23 hover:bg-25 hover:text-white'
            onClick={(e) => {
              e.preventDefault();
              inheritRecipes({
                variables: {
                  startDate: today.toISODate(),
                  endDate: today.plus({ days: 7 }).toISODate(),
                },
                update(cache, response) {
                  if (!checkUserRecipes?.currentUser?.mealPlan) return;
                  cache.modify({
                    id: cache.identify(checkUserRecipes.currentUser.mealPlan),
                    fields: {
                      schedule(existingSchedule) {
                        return existingSchedule.concat(
                          response.data?.initWithData?.schedule
                        );
                      },
                      recipes(existingRecipes) {
                        return existingRecipes.concat(
                          _.uniqBy(
                            response.data?.initWithData?.schedule.map(
                              ({ recipe }) => recipe
                            ),
                            'id'
                          )
                        );
                      },
                    },
                  });
                },
              });
              onClose();
            }}
          >
            Yes
          </Button>
          <Button
            className='text-14 rounded-2xl min-w-[60px] ml-2 '
            onClick={onClose}
          >
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
