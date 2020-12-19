import React from 'react';
import ReactJson from 'react-json-view';
import { Card, CardBody, CardHeader } from 'reactstrap';

const JSONEditor = ({json, onDiscard, onSave}) => {
    return (
        <Card className="main-card mb-3">
                <CardHeader>JSON View
                </CardHeader>
                <CardBody>
                    <ReactJson src={json}/>
                </CardBody>
        </Card>
    );
}

export default JSONEditor;