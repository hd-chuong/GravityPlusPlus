import React, {Component, Fragment} from 'react';
import Vega from '../Vega';
import {
    Row, Col,
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
        if (this.props.data === null || this.props.data === undefined) return (
            <Card className="main-card mb-3">
                <CardHeader>Chart View</CardHeader>
                <CardBody>View chart by choosing a vis node</CardBody>
            </Card>
        );
        const spec = this.props.spec;
        spec.data[0].values = this.props.data;
        return (
            <Card className="main-card mb-3">
                    <CardHeader>{this.props.title}</CardHeader>
                    <CardBody className="mx-auto">
                        <Vega 
                            spec={spec} 
                            data={this.props.data} 
                            config={{actions: {compiled: false, editor: false, source: false}}}
                        />
                    </CardBody>
            </Card>
        )
    }
}