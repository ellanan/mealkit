import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router';

import { CreateRecipe } from '../../pages/CreateRecipe';

export const CreateRecipeModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParams = new URLSearchParams(location.search);
  const modalCreateRecipe = currentQueryParams.has('modalCreateRecipe');

  return (
    <Modal
      onClose={() => {
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.delete('modalCreateRecipe');

        history.push({
          ...location,
          search: newQueryParams.toString(),
        });
      }}
      isOpen={modalCreateRecipe}
      autoFocus={false}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent
        minHeight='50vh'
        maxHeight='calc(100% - 8rem)'
        minWidth='60vw'
        overflow='auto'
      >
        {modalCreateRecipe && <CreateRecipe />}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
