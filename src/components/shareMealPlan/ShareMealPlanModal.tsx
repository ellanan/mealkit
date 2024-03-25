import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router";

import { ShareMealPlanDetails } from "../../components/shareMealPlan/ShareMealPlanDetails";

export const ShareMealPlanModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParams = new URLSearchParams(location.search);
  const modalShareMealPlan = currentQueryParams.has("modalShareMealPlan");

  const { isOpen, onClose } = useDisclosure({
    isOpen: !!modalShareMealPlan,
    onClose: () => {
      const newQueryParams = new URLSearchParams(location.search);
      newQueryParams.delete("modalShareMealPlan");

      history.push({
        ...location,
        search: newQueryParams.toString(),
      });
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} autoFocus={false}>
      <ModalOverlay />
      <ModalContent
        minHeight="20vh"
        maxHeight="calc(100% - 8rem)"
        minWidth="40vw"
        overflow="auto"
      >
        {modalShareMealPlan && <ShareMealPlanDetails />}
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
