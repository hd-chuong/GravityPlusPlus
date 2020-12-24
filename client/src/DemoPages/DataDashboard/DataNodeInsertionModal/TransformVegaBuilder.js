import React, { Fragment } from 'react';
import {Label, Input, Row, Col} from 'reactstrap'; 
import Creatable from 'react-select/creatable';
import Select from 'react-select';
import {AggregationMethods, ComparisonExpressions, TypeCheckingFunctions, FilterBuilder} from '../../../utils/VegaSpecsBuilder';
import AttributeExtractor from '../../../utils/AttributeExtractor';
import JSONView from 'react-json-view';
import Tooltip from 'react-tooltip';

const filterOptions = [
    {
        label: "Comparison",
        options: ComparisonExpressions.map((operand) => ({label: operand, value: operand}))
    },
    {
        label: "Type checking",
        options: TypeCheckingFunctions.map((operand) => ({label: operand, value: operand}))
    }
]

class TransformVegaBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "aggregate",
            vega: {
                type: "aggregate",
                fields: [],
                ops: [],
                groupby: []
            },
            vegaFilter: {
                type: "filter",
                field: null,
                operand: null,
                threshold: null,
                expr: "",

            },
            
        };
        this.buildVega = this.buildVega.bind(this);
        
    }

    buildVega(newChange)
    {
        if (this.state.type === "filter")
        {
            this.setState({vegaFilter: {...this.state.vegaFilter, ...newChange}}, 
                () => {
                    const filter = FilterBuilder(this.state.vegaFilter.field, 
                                                this.state.vegaFilter.operand, 
                                                this.state.vegaFilter.threshold);
                    this.setState({vegaFilter: {...this.state.vegaFilter, expr: filter}});
                    this.props.updateVegaSpecs({type: this.state.vegaFilter.type, expr: filter});
                
                });
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
                            <Label md={4}>Field *</Label>
                            <Col>
                                <Creatable 
                                    options={
                                        this.props.currentData && AttributeExtractor(this.props.currentData[0]).map((key) => ({value: key, label: key})) 
                                    }
                                    onChange={(newField) => this.buildVega({field: newField.value}) }
                                />
                            </Col>
                        </Row>

                        <Row className="form-group">
                            <Label md={4}>Operand *</Label>
                            <Col>
                                <Select 
                                    options={filterOptions}
                                    onChange={(newOperand) => this.buildVega({operand: newOperand.value}) }
                                />
                            </Col>
                        </Row>

                        {ComparisonExpressions.includes(this.state.vegaFilter.operand) && (
                            <Row className="form-group">
                                <a data-tip data-for="param-info">
                                    <Label md={4}>Compared value</Label>
                                    <Col>
                                        <Input type="text" placeholder="Enter the compared value here" 
                                        onChange={(e) => this.buildVega({threshold: e.target.value}) }
                                        />
                                    </Col>
                                </a>
                                <Tooltip id='param-info' type='dark'>
                                    <p>In case the compared value is not provided, </p> 
                                    <p>a param will automatically be created and passed in during user interaction</p>
                                </Tooltip>
                            </Row>)
                        }

                    </Col>
                    )}
                    {this.state.type === "aggregate" && (
                    <Col>
                        <Row className="form-group">
                            <Label for="aggregation" md={4}>Functions</Label>
                            <Col>
                                <Creatable 
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
                                <Creatable 
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
                                <Creatable 
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
                            src={this.state.type === "aggregate" ? this.state.vega : {type: this.state.vegaFilter.type, expr: this.state.vegaFilter.expr}}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default TransformVegaBuilder;
