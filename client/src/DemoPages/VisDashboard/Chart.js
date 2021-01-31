import React, { Component, Fragment } from 'react';
import Vega from '../Vega';
import {
  CardTitle,
  Card,
  CardBody,
} from 'reactstrap';

export default class Chart extends Component {
  render() {
    if (!this.props.data || !this.props.spec)
      return (
        <Card className="main-card mb-3">
          <CardBody>
            <CardTitle>Chart View</CardTitle>
            View chart by choosing a vis node
          </CardBody>
        </Card>
      );
    
    return (
      <Card className="main-card mb-2">
        <CardBody>
          <CardTitle>{this.props.title}</CardTitle>
        </CardBody>
        <CardBody className="mx-auto h-100">
          <Vega 
            spec={this.props.spec} 
            data={this.props.data} 
            signals={this.props.signals}
          />
        </CardBody>
      </Card>
    );
  }
}
