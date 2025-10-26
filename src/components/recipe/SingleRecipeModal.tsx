import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router-dom";

import { SingleRecipeDetails } from "./SingleRecipeDetails";

export const SingleRecipeModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParameters = new URLSearchParams(location.search);
  const modalRecipeId = currentQueryParameters.get("modalRecipeId");

  const { isOpen, onClose } = useDisclosure({
    isOpen: !!modalRecipeId,
    onClose: () => {
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.delete("modalRecipeId");

      history.push({
        ...location,
        search: newQueryParams.toString(),
      });
    },
  });

  return (
    <Modal isOpen={isOpen} autoFocus={false} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        minHeight="50vh"
        maxHeight="calc(100% - 8rem)"
        overflow="auto"
      >
        {modalRecipeId && (
          <SingleRecipeDetails recipeId={modalRecipeId} onClose={onClose} />
        )}
      </ModalContent>
    </Modal>
  );
};
