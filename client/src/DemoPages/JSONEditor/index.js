import React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { Card, CardBody, CardHeader, Nav, Button, NavItem } from 'reactstrap';
import {toast} from 'react-toastify';
import toastOptions from '../config/toastOptions';
const JSONEditor = ({ json, onSpecChange, onSave }) => {
  const resetEditor = () => {
    toast.info("Reset spec", toastOptions);
    setEditedJSON(initialJSON);
    onSpecChange(initialJSON);
  };
  
  const saveEditor = () => {
    onSave(editedJSON);
    setInitialJSON(editedJSON);
  }
  const [initialJSON, setInitialJSON] = useState(json);
  const [editedJSON, setEditedJSON] = useState(json);

  if (!json)
    return (
      <Card className="main-card mb-3">
        <CardHeader className="card-header-tab">Spec View</CardHeader>
        <CardBody>View Vega specification by choosing a vis node</CardBody>
      </Card>
    );
  return (
    <Card className="main-card mb-3">
      <CardHeader className="card-header-tab">
        Spec View
        <Nav>
          <NavItem>
            <Button
              color="dark"
              className="float-right"
              onClick={resetEditor}
            >
              {' '}
              Reset
            </Button>
          </NavItem>{' '}
          <NavItem>
            <Button
              color="primary"
              className="float-right"
              onClick={saveEditor}
            >
              {' '}
              Save
            </Button>
          </NavItem>
        </Nav>
      </CardHeader>
      <CardBody>
        <ReactJson
          src={editedJSON}
          onEdit={({ updated_src }) => {
            setEditedJSON(updated_src);
            onSpecChange(updated_src);
          }}
          onAdd={({ updated_src }) => {
            setEditedJSON(updated_src);
            onSpecChange(updated_src);
          }}
          onDelete={({ updated_src }) => {
            setEditedJSON(updated_src);
            onSpecChange(updated_src);
          }}
        />
      </CardBody>
    </Card>
  );
};

export default JSONEditor;
