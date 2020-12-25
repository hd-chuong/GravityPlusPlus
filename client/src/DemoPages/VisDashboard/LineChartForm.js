import React, { Fragment } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
export default function PieChartForm({
  xFieldChange,
  yFieldChange,
  categoryFieldChange,
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
            placeholder="Categorical field"
          >
            <option key={-1} value={''}>
              Select an attribute
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
            placeholder="Quantitative field"
          >
            <option key={-1} value={''}>
              Select an attribute
            </option>
            {attributeList.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </Input>
        </Col>

        <Col>
          <Label>Select category (color) field</Label>
          <Input
            type="select"
            onChange={categoryFieldChange}
            name="categoryField"
            placeholder="Categorical field"
          >
            <option key={-1} value={''}>
              Select an attribute
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
