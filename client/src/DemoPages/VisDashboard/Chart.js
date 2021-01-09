import React, { Component, Fragment } from 'react';
import Vega from '../Vega';
import {
  Row,
  Col,
  Button,
  CardHeader,
  Card,
  CardBody,
  Progress,
  TabContent,
  TabPane,
} from 'reactstrap';

export default class Chart extends Component {
  render() {
    if (!this.props.data || !this.props.spec)
      return (
        <Card className="main-card mb-3">
          <CardHeader>Chart View</CardHeader>
          <CardBody>View chart by choosing a vis node</CardBody>
        </Card>
      );
    return (
      <Card className="main-card mb-3">
        <CardHeader>{this.props.title}</CardHeader>
        <CardBody className="mx-auto">
          <Vega spec={this.props.spec} data={this.props.data} signals={this.props.signals}/>
        </CardBody>
      </Card>
    );
  }
}
