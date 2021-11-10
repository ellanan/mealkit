import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router';

export const AttributionModal = () => {
  const history = useHistory();
  const location = useLocation();
  const currentQueryParams = new URLSearchParams(location.search);
  const modalAttribution = currentQueryParams.has('attribution');

  return (
    <Modal
      isOpen={modalAttribution}
      autoFocus={false}
      onClose={() => {
        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.delete('attribution');

        history.push({
          ...location,
          search: newQueryParams.toString(),
        });
      }}
    >
      <ModalOverlay />
      <ModalContent className='text-14'>
        <ModalHeader>Attribution</ModalHeader>
        <ModalCloseButton />
        <ModalBody className='text-xs mb-6'>
          Carrot logo created by Free ICONS Library <br />
          <a
            className='text-14 hover:text-25 hover:underline'
            href='https://icon-library.com/840638.svg.html'
            target='_blank'
            rel='noreferrer'
          >
            https://icon-library.com/840638.svg.html
          </a>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
