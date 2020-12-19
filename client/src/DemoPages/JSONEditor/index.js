import React from 'react';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { Card, CardBody, CardHeader, Nav, Button, NavItem } from 'reactstrap';

const JSONEditor = ({json, onSpecChange, onSave}) => {
    const [initialJSON, setInitialJSON] = useState(json);
    const [editedJSON, setEditedJSON] = useState(json);

    return (
        <Card className="main-card mb-3">
                <CardHeader className="card-header-tab">JSON View
                    <Nav>
                        <NavItem>
                            <Button 
                                color="dark" 
                                className="float-right"
                                onClick={() => {
                                    setEditedJSON(initialJSON);
                                    onSpecChange(initialJSON);
                                }
                                }> Reset
                            </Button>
                        </NavItem> 
                        {" "}   
                        <NavItem>
                            <Button 
                                color="primary" 
                                className="float-right"
                                onClick={() => {
                                    onSave(editedJSON); 
                                    setInitialJSON(editedJSON); }}
                            > Save
                            </Button>
                        </NavItem>
                    </Nav>

                </CardHeader>
                <CardBody>
                    <ReactJson 
                        src={editedJSON} 
                        onEdit={({updated_src}) => {
                            setEditedJSON(updated_src); 
                            onSpecChange(updated_src);}
                        }
                    />
                </CardBody>
        </Card>
    );
}

export default JSONEditor;