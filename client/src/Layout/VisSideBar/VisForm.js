import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Form, Row, Col, Input, Label} from 'reactstrap';
import Select from 'react-select';

class VisForm extends Component {

    constructor(props)
    {
        super(props);
    }
    render() {
        return (
                <Form>
                    <h5 className="app-sidebar__heading">Data</h5>
                    <Row className="form-group">                   
                        <Col>
                            <Select options={[]} placeholder="Select a data node" />
                        </Col>
                    </Row>
                    <h5 className="app-sidebar__heading">Idioms</h5>
                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="Select a idiom" />
                        </Col>
                    </Row>
                    <h5 className="app-sidebar__heading">Encoding</h5>
                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="Select x axis field" />
                        </Col>
                        <Col>
                            <Select options={[]} placeholder="Select y axis field" />
                        </Col>
                    </Row>

                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="Row" />
                        </Col>
                        <Col>
                            <Select options={[]} placeholder="Col" />
                        </Col>
                    </Row>

                    <h5 className="app-sidebar__heading">Mark</h5>
                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="size" />
                        </Col>
                        <Col>
                            <Select options={[]} placeholder="color" />
                        </Col>
                    </Row>

                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="shape" />
                        </Col>
                        <Col>
                            <Select options={[]} placeholder="detail" />
                        </Col>
                    </Row>
                    <Row className="form-group">
                        <Col>
                            <Select options={[]} placeholder="text" />
                        </Col>
                    </Row>
                </Form>
        );
    }
}

export default VisForm;