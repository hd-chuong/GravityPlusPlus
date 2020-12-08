import React, { Fragment } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Nav, NavLink, NavItem, TabContent, TabPane, CardFooter} from 'reactstrap';
import {Form, FormGroup, Label, Input, Row, Col} from 'reactstrap'; 
import Select from 'react-select';

import classnames from 'classnames';
import {AggregationMethods} from '../../../utils/VegaSpecsBuilder';
import AttributeExtractor from '../../../utils/AttributeExtractor';

class VegaBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vega: {
                type: "aggregate",
                fields: [],
                ops: [],
                groupby: []
            }
        };
        this.buildVega = this.buildVega.bind(this);
        
    }

    buildVega(newChange)
    {
        this.setState({vega: {...this.state.vega, ...newChange}} , 
            () => {this.props.updateVegaSpecs(this.state.vega)});
    }
    render() {
        return (<Fragment>
                <Row className="form-group">
                    <Col>
                        <Row className="form-group">
                            <Label for="aggregation" md={4}>Functions</Label>
                            <Col>
                                <Select 
                                    isMulti options={
                                        AggregationMethods.map((method) => ({value: method, label: method})) 
                                    }
                                    hideSelectedOptions={false}
                                    onChange={(newMethods) => this.buildVega({ops: newMethods.map(item=> item.value)}) }
                                />
                            </Col>
                        </Row>
                        
                        <Row className="form-group">
                            <Label for="column" md={4}>Fields</Label>
                            <Col>
                                <Select 
                                    isMulti options={
                                        this.props.currentData && AttributeExtractor(this.props.currentData[0]).map((key) => ({value: key, label: key})) 
                                    }
                                    hideSelectedOptions={false}
                                    onChange={(newFields) => this.buildVega({fields: newFields.map(item=> item.value)}) }
                                />
                            </Col>
                        </Row>

                        <Row className="form-group">
                            <Label for="column" md={4}>Group by</Label>
                            <Col>
                                <Select 
                                    isMulti options={
                                        this.props.currentData && AttributeExtractor(this.props.currentData[0]).map((key) => ({value: key, label: key})) 
                                    }
                                    onChange={(groupby) => this.buildVega({groupby: groupby.map(item=> item.value)} ) }
                                />
                            </Col>
                        </Row>
                    </Col>
                                    
                    <Col className="form-group">
                        <Input 
                            type="textarea" 
                            rows={8} 
                            name="vega-specs" 
                            id="vega-specs" 
                            placeholder="Vega specification"
                            value={JSON.stringify(this.state.vega, undefined, 4)}

                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default VegaBuilder;
