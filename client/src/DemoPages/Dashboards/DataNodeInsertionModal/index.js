import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, Nav, NavLink, NavItem, TabContent, TabPane, CardFooter} from 'reactstrap';
import {Form, FormGroup, Label, Input, Row, Col} from 'reactstrap'; 


import classnames from 'classnames';
class ModalExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        }

        // this.props.toggle = this.props.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleSubmit()
    {
        this.props.addRawDataNode(name = this.id.value);
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
                                <p>Import a raw dataset into the data graph</p>
                                <Form>
                                    <Row className="form-group">
                                        <Label for="dataset" md={3}>Select dataset</Label>
                                        <Col md={5}>
                                            <Input type="select" name="dataset" id="dataset" innerRef={(input) => this.dataset = input}>
                                                {this.props.datasets.datasets.map((dataset) => (<option key={dataset.filename}>{dataset.filename}</option>))}
                                            </Input>
                                        </Col>
                                        
                                        <Label for="nodeType" md={2}>Node type</Label>
                                        <Col md={2}>
                                            <Input type="select" name="nodeType" id="nodeType" disabled innerRef={(input) => this.nodeType = input}>
                                                <option>raw</option>
                                            </Input>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label for="id"></Label>
                                        <Input type="text" name="id" id="id" innerRef={(input) => this.id = input}
                                                placeholder="Enter the node name"/>
                                    </FormGroup>

                                    <Button color="primary" className="mr-auto" onClick={this.handleSubmit.bind(this)}>Add Node</Button>{' '}  
                                </Form>
                            </TabPane>
                            <TabPane tabId="2">
                                <p>Join two or more datasets.</p>
                            </TabPane>
                            <TabPane tabId="3">
                                <p>Apply a transformation to a data node</p>
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
