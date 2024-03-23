import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router';

import { ShoppingList } from './ShoppingList';

export const ShoppingListModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParams = new URLSearchParams(location.search);
  const modalShoppingList = currentQueryParams.has('shoppingList');

  return (
    <Modal
      onClose={() => {
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.delete('shoppingList');

        history.push({ ...location, search: newQueryParams.toString() });
      }}
      isOpen={modalShoppingList}
      autoFocus={false}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent
        minHeight='50vh'
        maxHeight='calc(100% - 8rem)'
        minWidth='min(40vw, 300px)'
        overflow='auto'
      >
        {modalShoppingList && <ShoppingList />}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
