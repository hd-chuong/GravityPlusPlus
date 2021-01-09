import React, { Component, Fragment } from 'react';

// import { Row, Col, Button, CardHeader, Card, CardBody } from 'reactstrap';

// import AttributeExtractor from '../../../utils/AttributeExtractor';

export default class ParamTable extends Component {

  render() {
    const keys = this.props.keys;
    const values = this.props.values; 
    // const keys = AttributeExtractor(this.props.params);
    // const values = keys.map(key => this.props.params[key]);
    return (
        <div className="table-responsive">
          <table className="align-middle mb-0 table table-borderless table-striped table-hover">
            <tbody>
              {keys.map((key, i) => (<tr><td>{key}</td><td>{values[i]}</td></tr>))}
            </tbody>
          </table>
        </div>
    );
  }
}
