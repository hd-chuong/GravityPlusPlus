import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const ModalExample = (props) => {
  return (<Modal isOpen={props.open}>
        <ModalBody>
            Export scene to pdf
        </ModalBody>
      </Modal>
  );
}

export default ModalExample;