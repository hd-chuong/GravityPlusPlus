import React, {Fragment} from 'react';
import {Button, Modal, ModalBody, ModalFooter, Card, CardBody, CardHeader, Nav, NavLink, NavItem, TabContent, TabPane, CardFooter} from 'reactstrap';
import {Form, Label, Input, Row, Col} from 'reactstrap'; 
import VegaBuilder from './TransformVegaBuilder';
import JoinVegaBuilder from './JoinVegaBuilder';
import {JoinSpecsBuilder} from '../../../utils/VegaSpecsBuilder';
import classnames from 'classnames';
import calculateDataset from '../../../utils/dataGeneration';
import AttributeExtractor from '../../../utils/AttributeExtractor';

class DataNodeInsertionModal extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = {
            activeTab: '1',
            joinDatasets: [],
            specs: "",
            format: "json",
            rawDataset: null
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleSubmitRaw()
    {
        if (this.rawNodeName.value === "") 
        {
            alert("You must provide a node name");
            return;
        }

        if (this.rawDataset.value === "")
        {
            alert("You must select a dataset");
            return;
        }
        let format = {"type": "json"}
        
        if (this.state.format !== "json" && !(this.property && this.property.value))
        {
            alert("You must select an attribute to parse value");
            return;
        }
        if (this.state.format === "geojson")
        {
            format.property = this.property.value;
        }

        if (this.state.format === "typojson")
        {
            format.type = "typojson";
            format.feature = this.property.value;
        }
        this.props.addDataNode(this.rawNodeName.value, "RAW", this.rawDataset.value, [], format);
        
        this.setState({format: "json"});
        
        this.props.toggle();
    }

    updateVegaSpecs(newSpecs)
    {
        this.setState({specs: newSpecs});
    }

    handleMultipleDatasets(curOptions) 
    {
        this.setState({joinDatasets: curOptions});
    }

    handleSubmitJoin(joinNodeName, leftNode, rightNode, joinType)
    {
        const {id: id1, attribute: leftAttribute, headers: leftHeaders, name: leftDatasetName} = leftNode;
        const {id: id2, attribute: rightAttribute, headers: rightHeaders, name: rightDatasetName} = rightNode;
    

        if (joinNodeName === "") 
        {
            alert("You must provide a node name");
            return;
        }

        const transform = JoinSpecsBuilder(leftNode, rightNode, joinType);

        var source;
        if (joinType === "RIGHT JOIN")
        {
            source = id2;
        }
        else {
            source = id1;
        }

        this.props.addDataNode(joinNodeName, "JOINED", source, transform).then(newNodeId => {
            this.props.addDataEdge(id1, newNodeId, "JOIN", null);
            this.props.addDataEdge(id2, newNodeId, "JOIN", null);
        });
        this.props.toggle();
    }

    async handleSubmitTransform()
    {
        if (this.sourceNode.value === "") 
        {
            alert("You must provide a node name");
            return;
        }
        var specs = this.state.specs;
        console.log(specs);
        var sourceNode = this.sourceNode.value;
        
        let newNodeId = await this.props.addDataNode(this.transformNodeName.value, "TRANSFORMED")
        this.props.addDataEdge(
            sourceNode, 
            newNodeId, 
            "TRANSFORM", 
            specs !== "" ? specs : {}
        );

        this.props.toggle();
    }

    render() {
        return (
            <span className="d-inline-block">
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="modal-lg">
                    <CardHeader className="card-header-tab">
                        <div className="card-header-title">Add a data node</div>
                        <Nav>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '1'})}
                                    onClick={() => {
                                        this.toggle('1');
                                    }}
                                >
                                    Raw data
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '2'})}
                                    onClick={() => {
                                        this.toggle('2');
                                    }}
                                >
                                    Join data
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                        className={classnames({active: this.state.activeTab === '3'})}
                                        onClick={() => {
                                            this.toggle('3');
                                        }}
                                >
                                    Transform data
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </CardHeader>
                <ModalBody>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <small>Import a raw dataset into the data graph</small>
                            <Form onSubmit={e => {e.preventDefault()}}>
                                <Row className="form-group">
                                    <Label for="rawDataset" md={2}>Select dataset</Label>
                                    <Col md={6}>
                                        <Input type="select" name="rawDataset" id="rawDataset" innerRef={(input) => this.rawDataset = input}
                                            onChange={(e) => this.setState({rawDataset: e.target.value})}
                                        >
                                            {this.props.datasets.datasets.map((dataset) => (<option key={dataset.name} value={dataset.name}>{dataset.name}</option>))}
                                        </Input>
                                    </Col>
                                    
                                    <Label for="rawNodeType" md={2} hidden>Node type</Label>
                                    <Col md={2}>
                                        <Input type="select" name="rawNodeType" id="rawNodeType" disabled hidden innerRef={(input) => this.rawNodeType = input}>
                                            <option>RAW</option>
                                        </Input>
                                    </Col>
                                </Row>

                                <Row className="form-group">
                                    <Label for="nodeid" md={2}>Node name</Label>
                                    <Col>
                                        <Input type="text" name="rawNodeName" id="rawNodeName" innerRef={(input) => this.rawNodeName = input}
                                            placeholder="Enter the node name"></Input>
                                    </Col>
                                </Row>
                                
                                <Row className="form-group">
                                    <Label for="nodeid" md={2}>Parse option</Label>
                                    <Col>
                                        <Input type="select" 
                                        name="format" id="format" 
                                        onChange={(e) => {this.setState({format: e.target.value})}}
                                        placeholder="Select the format">
                                                <option value="json">json</option>
                                                <option value="geojson">geojson</option>
                                                <option value="topojson">topojson</option>
                                        </Input>
                                    </Col>
                                    {(this.state.format === "geojson" || this.state.format === "topojson") && (
                                    <Fragment>
                                        <Label for="nodeid" md={2}>Property</Label>
                                        <Col>
                                            <Input type="select" name="feature" id="feature" innerRef={(input) => this.feature = input}
                                                placeholder="Select the extracted field"
                                                onChange={(e) => this.setState({property: e.target.value})}    
                                                innerRef={(input) => this.property = input}
                                            >
                                                <option value={""}>Select an attribute</option>
                                                {
                                                    this.state.rawDataset && AttributeExtractor(this.props.datasets.datasets.filter(dataset => dataset.name === this.state.rawDataset)[0].dataset)
                                                    .map((attr,i) => <option key={i} value={attr}>{attr}</option>)
                                                }
                                            </Input>
                                        </Col>
                                    </Fragment>)}
                                </Row>
                                
                                <Button 
                                    color="primary" 
                                    className="float-right" 
                                    onClick={this.handleSubmitRaw.bind(this)}>
                                        Add Node
                                </Button>{' '}  
                            </Form>
                        </TabPane>
                        <TabPane tabId="2">
                            <JoinVegaBuilder 
                                datasets={this.props.datagraph.datagraph.nodes}
                                calculateDataset={(id) => calculateDataset(id, this.props.datasets.datasets)}
                                handleSubmit={this.handleSubmitJoin.bind(this)}
                            />
                        </TabPane>
                        <TabPane tabId="3">
                            <small>Apply a transformation to a data node</small>
                            <Form onSubmit={e => {e.preventDefault()}}>
                                <Row className="form-group">
                                    <Label for="sourceNode" md={2}>Select a node</Label>
                                    <Col md={6}>
                                        <Input 
                                            type="select" 
                                            name="sourceNode" 
                                            id="sourceNode" 
                                            innerRef={(input) => {
                                                this.sourceNode = input;
                                            }}
                                            onChange={(event) => {this.props.updateCurrentData(event.target.value)}}
                                        >
                                            <option key={0} value={null}>Select a node</option>
                                            {this.props.datagraph.datagraph.nodes.map((dataset) => (<option key={dataset.id} value={dataset.id}>{dataset.data.label}</option>))}
                                        </Input>
                                    </Col>
                                    
                                    <Label for="rawNodeType" md={2} hidden>Node type</Label>
                                    <Col md={2} hidden>
                                        <Input 
                                            type="select" 
                                            name="transformNodeType" 
                                            id="transformNodeType" 
                                            disabled 
                                            innerRef={(input) => this.transformNodeType = input}
                                        >
                                            <option>TRANSFORM</option>
                                        </Input>
                                    </Col>
                                </Row>

                                <Row className="form-group">
                                    <Label for="nodeid" md={2}>Node name</Label>
                                    <Col>
                                        <Input 
                                            type="text" 
                                            name="transformNodeName" 
                                            id="transformNodeName" 
                                            innerRef={(input) => this.transformNodeName = input}
                                            placeholder="Enter the node name">
                                        </Input>
                                    </Col>
                                </Row>
                                
                                <VegaBuilder 
                                    currentData={this.props.currentData} 
                                    updateVegaSpecs={this.updateVegaSpecs.bind(this)}
                                />
                                
                                <Row className="form-group">
                                    <Col>
                                        <Button 
                                            color="primary" 
                                            className="float-right"
                                            onClick={this.handleSubmitTransform.bind(this)}>
                                            Add Node
                                        </Button>{' '}  
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                    </TabContent>
                </ModalBody>
        </Modal>
    </span>
        );
    }
}

export default DataNodeInsertionModal;
