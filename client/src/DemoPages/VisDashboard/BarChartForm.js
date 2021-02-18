import React, { Fragment } from 'react';
import { Row, Col, Input, Label } from 'reactstrap';
export default function BarChartForm({
  xFieldChange,
  yFieldChange,
  attributeList,
}) {
  return (
    <Fragment>
      <Row className="form-group">
        <Col>
          <Label>Select x axis field</Label>
          <Input
            type="select"
            onChange={xFieldChange}
            name="xField"
            placeholder="Select x axis field"
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
          <Label>Select y axis field</Label>
          <Input
            type="select"
            onChange={yFieldChange}
            name="yField"
            placeholder="Select y axis field"
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
