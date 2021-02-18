import React, { Fragment } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
export default function ScatterplotForm({
  xFieldChange,
  yFieldChange,
  categoryFieldChange,
  shapeFieldChange,
  attributeList,
}) {
  return (
    <Fragment>
      <Row className="form-group">
        <Col>
          <Label>Select x field</Label>
          <Input
            type="select"
            onChange={xFieldChange}
            name="xField"
            placeholder="Select x field"
          >
            <option key={-1} value={''}>
              Select x field
            </option>
            {attributeList.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Input>
        </Col>
        <Col>
          <Label>Select y field</Label>
          <Input
            type="select"
            onChange={yFieldChange}
            name="yField"
            placeholder="Select y field"
          >
            <option key={-1} value={''}>
              Select y field
            </option>
            {attributeList.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Input>
        </Col>

        <Col>
        <Label>Select color (categorical) field</Label>
          <Input
            type="select"
            onChange={categoryFieldChange}
            name="categoryField"
            placeholder="Select category (color) field"
          >
            <option key={-1} value={''}>
              Select color attribute
            </option>
            {attributeList.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Input>
        </Col>

        <Col>
        <Label>Select shape (categorical) field</Label>
          <Input
            type="select"
            onChange={shapeFieldChange}
            name="shapeField"
            placeholder="Select shape (categorical) field"
          >
            <option key={-1} value={''}>
              Select color attribute
            </option>
            {attributeList.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Input>
        </Col>
      </Row>
    </Fragment>
  );
}
