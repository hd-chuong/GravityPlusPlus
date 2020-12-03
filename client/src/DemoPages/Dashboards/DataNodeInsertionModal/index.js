import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Nav, NavLink, NavItem, TabContent, TabPane, CardFooter} from 'reactstrap';
import {Form, FormGroup, Label, Input, Row, Col} from 'reactstrap'; 
import Select from 'react-select';
import classnames from 'classnames';

class ModalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            joinDatasets: []
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
        this.props.addDataNode(this.rawNodeName.value, "RAW");
        this.props.toggle();
    }

    handleMultipleDatasets(curOptions) 
    {
        this.setState({joinDatasets: curOptions});
    }

    async handleSubmitJoin()
    {
        if (this.joinNodeName.value === "") 
        {
            alert("You must provide a node name");
            return;
        }

        
        let newNodeId= await this.props.addDataNode(this.joinNodeName.value, "JOINED");

        this.state.joinDatasets.forEach((joinData) => {
            this.props.addDataEdge(joinData.value, newNodeId, "JOIN", null);
        });
    }

    async handleSubmitTransform()
    {
        if (this.sourceNode.value === "") 
        {
            alert("You must provide a node name");
            return;
        }
        var specs = this.transformSpecs.value;
        var sourceNode = this.sourceNode.value;
        
        let newNodeId = await this.props.addDataNode(this.transformNodeName.value, "TRANSFORMED")
        this.props.addDataEdge(
            sourceNode, 
            newNodeId, 
            "TRANSFORM", 
            specs !== "" ? JSON.parse(specs) : {}
        );

    }

    render() {
        return (
            <span className="d-inline-block">
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="modal-lg">
                    <CardHeader className="card-header-tab">
                        <div className="card-header-title">Add a data node</div>
                        <Nav>
                            <NavItem>
                                <NavLink href="javascript:void(0);"
                                            className={classnames({active: this.state.activeTab === '1'})}
                                            onClick={() => {
                                                this.toggle('1');
                                            }}
                                >
                                    Raw data
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="javascript:void(0);"
                                            className={classnames({active: this.state.activeTab === '2'})}
                                            onClick={() => {
                                                this.toggle('2');
                                            }}
                                >
                                    Join data
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="javascript:void(0);"
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
                                <Form>
                                    <Row className="form-group">
                                        <Label for="rawDataset" md={3}>Select dataset</Label>
                                        <Col md={5}>
                                            <Input type="select" name="rawDataset" id="rawDataset" innerRef={(input) => this.rawDataset = input}>
                                                {this.props.datasets.datasets.map((dataset) => (<option key={dataset.filename}>{dataset.filename}</option>))}
                                            </Input>
                                        </Col>
                                        
                                        <Label for="rawNodeType" md={2}>Node type</Label>
                                        <Col md={2}>
                                            <Input type="select" name="rawNodeType" id="rawNodeType" disabled innerRef={(input) => this.rawNodeType = input}>
                                                <option>RAW</option>
                                            </Input>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label for="nodeid">Node name</Label>
                                        <Input type="text" name="rawNodeName" id="rawNodeName" innerRef={(input) => this.rawNodeName = input}
                                                placeholder="Enter the node name"></Input>
                                    </FormGroup>

                                    <Button 
                                        color="primary" 
                                        className="float-right" 
                                        onClick={this.handleSubmitRaw.bind(this)}>Add Node</Button>{' '}  
                                </Form>
                            </TabPane>
                            <TabPane tabId="2">
                                <small>Join two or more datasets.</small>
                                <Form>
                                    <Row className="form-group">
                                        <Label for="joinDataset" md={3}>Select at least two</Label>
                                        <Col md={4}>
                                            <Select 
                                                isMulti options={
                                                    this.props.datagraph.datagraph.nodes.map((dataset) => ({value: dataset.id, label: dataset.data.label}) ) 
                                                }
                                                onChange={this.handleMultipleDatasets.bind(this)}
                                            />
                                        </Col>
                                        <Label for="joinNodeType" md={2}>Node type</Label>
                                        <Col md={2}>
                                            <Input type="select" name="joinNodeType" id="joinNodeType" disabled innerRef={(input) => this.joinNodeType = input}>
                                                <option>JOIN</option>
                                            </Input>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label for="joinNodeName"></Label>
                                        <Input type="text" name="joinNodeName" id="joinNodeName" innerRef={(input) => this.joinNodeName = input}
                                                placeholder="Enter the node name"/>
                                    </FormGroup>

                                    <Button 
                                        color="primary" 
                                        className="float-right" 
                                        onClick={this.handleSubmitJoin.bind(this)}>Add Node</Button>{' '}  
                                </Form>
                            </TabPane>
                            <TabPane tabId="3">
                                <small>Apply a transformation to a data node</small>
                                <Form>
                                    <Row className="form-group">
                                        <Label for="sourceNode" md={3}>Select a node</Label>
                                        <Col md={5}>
                                            <Input 
                                                type="select" 
                                                name="sourceNode" 
                                                id="sourceNode" 
                                                innerRef={(input) => this.sourceNode = input}
                                            >
                                                {this.props.datagraph.datagraph.nodes.map((dataset) => (<option key={dataset.id} value={dataset.id}>{dataset.data.label}</option>))}
                                            </Input>
                                        </Col>
                                        
                                        <Label for="rawNodeType" md={2}>Node type</Label>
                                        <Col md={2}>
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
                                        <Col md={9}>
                                            <Input 
                                                type="text" 
                                                name="transformNodeName" 
                                                id="transformNodeName" 
                                                innerRef={(input) => this.transformNodeName = input}
                                                placeholder="Enter the node name">
                                            </Input>
                                        </Col>
                                    </Row>

                                    <Row className="form-group">
                                        <Input 
                                            type="textarea" 
                                            rows={8} 
                                            name="vega-specs" 
                                            id="vega-specs" 
                                            placeholder="Vega specification"
                                            innerRef={(input) => this.transformSpecs = input}
                                        />
                                    </Row>
                                    <Row className="form-group">
                                        <Col>
                                            <Button 
                                                color="primary" 
                                                className="float-right"
                                                onClick={this.handleSubmitTransform.bind(this)}>Add Node</Button>{' '}  
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

export default ModalExample;
