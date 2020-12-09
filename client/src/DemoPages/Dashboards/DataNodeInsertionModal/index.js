import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Nav, NavLink, NavItem, TabContent, TabPane, CardFooter} from 'reactstrap';
import {Form, FormGroup, Label, Input, Row, Col} from 'reactstrap'; 
import Select from 'react-select';
import VegaBuilder from './TransformVegaBuilder';
import JoinVegaBuilder from './JoinVegaBuilder';
import {JoinSpecsBuilder} from '../../../utils/VegaSpecsBuilder';
import classnames from 'classnames';

class DataNodeInsertionModal extends React.Component {
    constructor(props) 
    {
        super(props);
        this.state = {
            activeTab: '1',
            joinDatasets: [],
            specs: ""
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
        this.props.addDataNode(this.rawNodeName.value, "RAW", this.rawDataset.value);
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
        
        console.log(leftNode);
        console.log(rightNode);

        if (joinNodeName === "") 
        {
            alert("You must provide a node name");
            return;
        }

        const transform = JoinSpecsBuilder(leftNode, rightNode, joinType);
        console.log("transform looks like: " , transform);
        
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
                                            <Input type="select" name="rawDataset" id="rawDataset" innerRef={(input) => this.rawDataset = input}>
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
                                    calculateDataset={this.props.calculateDataset}
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
            {/* <ModalFooter>
                <Button color="link" onClick={this.props.toggle}>Cancel</Button>
                <Button color="primary" onClick={this.props.toggle}>Add Node</Button>{' '}  
            </ModalFooter> */}
        </Modal>
    </span>
        );
    }
}

export default DataNodeInsertionModal;
