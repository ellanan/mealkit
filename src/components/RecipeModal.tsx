import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router';
import { SingleRecipeDetails } from '../pages/SingleRecipeDetails';

export const RecipeModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParameters = new URLSearchParams(location.search);
  const modalRecipeId = currentQueryParameters.get('modalRecipeId');
  const isOpen = !!modalRecipeId;

  return (
    <Modal
      onClose={() => {
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.delete('modalRecipeId');

        history.push({
          ...location,
          search: newQueryParams.toString(),
        });
      }}
      isOpen={isOpen}
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent
        minHeight='50vh'
        maxHeight='calc(100% - 8rem)'
        overflow='auto'
      >
        {modalRecipeId && <SingleRecipeDetails recipeId={modalRecipeId} />}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
