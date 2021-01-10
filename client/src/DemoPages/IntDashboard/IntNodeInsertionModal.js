import React, { Fragment, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  CardHeader,
} from 'reactstrap';
import {FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import Select from 'react-select';
import classnames from 'classnames';

const IntNodeInsertionModal = (props) => {
  const initialValues = {
    name: "",
    visNodes: []
  };

  const [snapshot, setSnapshot] = useState(initialValues);
  const handleSubmit = async (values) => {
    props.addIntNode(values.name, values.visNodes);
    props.toggle();
  }
  return (
    <span className="d-inline-block">
      <Modal
        isOpen={props.isOpen}
        toggle={props.toggle}
        className="modal-lg"
      >
        <CardHeader className="card-header-tab">
          <div className="card-header-title">Add an interaction node</div>
        </CardHeader>
        <ModalBody>
          <Formik
            initialValues={snapshot}
            onSubmit={handleSubmit}
          >
            {
              formik => (
                <Form>
                  <Row className="form-group">
                    <Label md={3}>Enter the node name</Label>
                    <Col md={9}>
                      <Input type="text" onChange={formik.handleChange} name="name" />
                    </Col>
                  </Row>

                  <Row className="form-group">
                    <Label md={3}>Select visualisation node</Label>
                    <Col md={9}>
                      <Select
                        isMulti
                        options={props.visgraph.nodes.map(node => ({
                          value: node.id,
                          label: node.data.label
                        }))
                        }
                        onChange={(val) => {                          
                          formik.values.visNodes = val.map(node => node.value)}
                        }
                        hideSelectedOptions={false}
                      />
                    </Col>
                  </Row>

                  <div>
                    <Button
                      type="submit"
                      disabled={formik.isSubmitting}
                      color="primary"
                      className="float-right"
                    >
                      Create Node
                    </Button>
                  </div>
                </Form>
              )
            }
          </Formik>
        </ModalBody>
      </Modal>
    </span>
  );
}

export default IntNodeInsertionModal;
