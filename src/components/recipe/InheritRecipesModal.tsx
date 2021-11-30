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
import { useQuery, useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { useState, useMemo } from 'react';
import { DateTime } from 'luxon';

export const InheritRecipesModal = () => {
  const { isAuthenticated } = useAuth0();
  const [deniedInheritence, setDeniedInheritence] = useState(false);

  const today = useMemo(() => DateTime.now(), []);

  const { data: checkUserRecipes, error: errorLoadingUserRecipes } =
    useQuery<GraphQLTypes.CheckUserRecipesQuery>(gql`
      query CheckUserRecipes {
        currentUser {
          id
          recipes {
            id
            name
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
              id
              name
              imageUrl
            }
          }
        }
      }
    `
  );
  if (errorLoadingInheritRecipes) {
    throw errorLoadingInheritRecipes;
  }

  const { isOpen, onClose } = useDisclosure({
    isOpen:
      !deniedInheritence &&
      isAuthenticated &&
      checkUserRecipes?.currentUser?.recipes?.length === 0,
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
            Would you like to inherit some recipes to get started?
          </p>
        </ModalBody>

        <ModalFooter>
          <Button
            className='text-14 rounded-2xl min-w-[60px] mr-2 bg-18 hover:bg-25 hover:text-white'
            onClick={(e) => {
              e.preventDefault();
              inheritRecipes({
                variables: {
                  startDate: today.toISODate(),
                  endDate: today.plus({ days: 7 }).toISODate(),
                },
                // update(cache, { data }) {
                //   cache.modify({
                //     fields: {},
                //   });
                // },
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
