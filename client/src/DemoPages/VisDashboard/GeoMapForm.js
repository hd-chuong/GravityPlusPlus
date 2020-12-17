import React, {Fragment} from 'react';
import {Row, Col, Input, Label} from 'reactstrap';
import Creatable from 'react-select/creatable';

export default function GeoMapForm({choroplethFieldChange, attributeList}) {
    return (<Fragment>
        <Row className="form-group">
          <Label>Select the color field</Label>
          <Col md={2}>
            <Creatable 
                type="text" 
                options={attributeList.map((attr) => ({value: attr, label: attr}))}
                placeholder="Select joined field"
                name="choroplethField"
                onChange={(e) => choroplethFieldChange(e.value)}
            />
          </Col>
        </Row>
      </Fragment>
    )
};

