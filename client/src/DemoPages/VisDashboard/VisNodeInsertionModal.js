import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardFooter,
} from 'reactstrap';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import VisForm from './VisForm';
class VisNodeInsertionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <span className="d-inline-block">
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className="modal-lg"
        >
          <CardHeader className="card-header-tab">
            <div className="card-header-title">Add a visualisation node</div>
          </CardHeader>
          <ModalBody>
            <VisForm
              datagraph={this.props.datagraph}
              datasets={this.props.datasets}
              addVisNode={this.props.addVisNode}
              toggle={this.props.toggle}
            />
          </ModalBody>
        </Modal>
      </span>
    );
  }
}

export default VisNodeInsertionModal;
