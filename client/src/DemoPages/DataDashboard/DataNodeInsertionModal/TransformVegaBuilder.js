import React, { Fragment } from 'react';
import {Label, Input, Row, Col} from 'reactstrap'; 
import Select from 'react-select/creatable';

import {AggregationMethods} from '../../../utils/VegaSpecsBuilder';
import AttributeExtractor from '../../../utils/AttributeExtractor';
import JSONView from 'react-json-view';
class TransformVegaBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vega: {
                type: "aggregate",
                fields: [],
                ops: [],
                groupby: []
            },
            vegaFilter: {
                type: "filter",
                expr: ""
            },
            type: "aggregate"
        };
        this.buildVega = this.buildVega.bind(this);
        
    }

    buildVega(newChange)
    {
        if (this.state.type === "filter")
        {
            this.setState({vegaFilter: {...this.state.vegaFilter, ...newChange}}, 
                () => {this.props.updateVegaSpecs(this.state.vegaFilter)});
        }
        else {
            this.setState({vega: {...this.state.vega, ...newChange}}, 
                () => {this.props.updateVegaSpecs(this.state.vega)});
    
        }
    }

    render() {
        return (<Fragment>
                <Row className="form-group">
                    <Label for="aggregation" md={2}>Types of transformation</Label>
                    <Col>
                        <Input type="select" onChange={(e) => this.setState({type: e.target.value})}>
                            <option value="aggregate">Aggregate</option>
                            <option value="filter">Filter</option>
                        </Input>
                    </Col>
                </Row>                
                <Row className="form-group">

                    {this.state.type === "filter" && (
                    <Col>
                        <Row className="form-group">
                            <Label md={4}>Expressions</Label>
                            <Col>
                                <Input type="text" placeholder="enter your filtering expression here" 
                                onChange={(e) => this.buildVega({expr: e.target.value})}></Input>
                            </Col>
                        </Row>
                    </Col>
                    )}
                    {this.state.type === "aggregate" && (
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
                    </Col>)}
                                    
                    <Col className="form-group">
                        <JSONView 
                            src={this.state.type === "aggregate" ? this.state.vega : this.state.vegaFilter}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default TransformVegaBuilder;
