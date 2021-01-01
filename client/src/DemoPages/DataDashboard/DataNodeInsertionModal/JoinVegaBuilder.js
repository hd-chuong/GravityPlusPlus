import React, { Fragment } from 'react';
import { Label, Input, Row, Col, Form, Button } from 'reactstrap';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import { JoinTypes } from '../../../utils/VegaSpecsBuilder';
import AttributeExtractor from '../../../utils/AttributeExtractor';

class JoinVegaBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      dataset1: null,
      dataset2: null,

      joinType: null,

      headers1: [],
      headers2: [],

      attribute1: null,
      attribute2: null,
    };
  }

  render() {
    console.log(this.state.dataset1, this.state.dataset2, this.state.headers1)
    return (
      <Form>
        <small>Join two datasets.</small>

        <Row className="form-group">
          <Label for="nodeid" md={2}>
            Node name
          </Label>
          <Col>
            <Input
              type="text"
              name="joinNodeName"
              id="joinNodeName"
              innerRef={input => (this.joinNodeName = input)}
              placeholder="Enter the node name"
            ></Input>
          </Col>
        </Row>

        <Row className="form-group">
          <Col>
            <Select
              options={this.props.datasets
                .filter(dataset => dataset.id !== this.state.dataset2)
                .map(dataset => ({
                  value: dataset.id,
                  label: dataset.data.label,
                }))}
              placeholder="Dataset 1"
              onChange={newDataset =>
                this.setState({ dataset1: newDataset.value }, () => {
                  if (this.state.dataset1)
                    this.props
                      .calculateDataset(this.state.dataset1)
                      .then(({data}) => {
                        this.setState({
                          headers1: AttributeExtractor(data[0]),
                        });
                      });
                })
              }
            />
          </Col>
          <Col md={3}>
            <Select
              options={JoinTypes.map(type => ({ value: type, label: type }))}
              placeholder="JOINING TYPE"
              onChange={joinType => this.setState({ joinType: joinType.value })}
            />
          </Col>
          <Col>
            <Select
              options={this.props.datasets
                .filter(dataset => dataset.id !== this.state.dataset1)
                .map(dataset => ({
                  value: dataset.id,
                  label: dataset.data.label,
                }))}
              placeholder="Dataset 2"
              onChange={newDataset =>
                this.setState({ dataset2: newDataset.value }, () => {
                  if (this.state.dataset2)
                    this.props
                      .calculateDataset(this.state.dataset2)
                      .then(({data}) => {
                        this.setState({
                          headers2: AttributeExtractor(data[0]),
                        });
                      });
                })
              }
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col>
            <Creatable
              options={this.state.headers1.map(header => ({
                value: header,
                label: header,
              }))}
              placeholder="Select joined field"
              onChange={a => this.setState({ attribute1: a.value })}
            />
          </Col>

          <Col md={3}></Col>

          <Col>
            <Creatable
              options={this.state.headers2.map(header => ({
                value: header,
                label: header,
              }))}
              placeholder="Select joined field"
              onChange={a => this.setState({ attribute2: a.value })}
            />
          </Col>
        </Row>

        <Row className="form-group">
          <Col>
            <Button
              color="primary"
              className="float-right"
              onClick={() =>
                this.props.handleSubmit(
                  this.joinNodeName.value,
                  {
                    id: this.state.dataset1,
                    attribute: this.state.attribute1,
                    headers: this.state.headers1,
                    name: this.props.datasets.filter(
                      dataset => dataset.id === this.state.dataset1,
                    )[0].data.label,
                  },
                  {
                    id: this.state.dataset2,
                    attribute: this.state.attribute2,
                    headers: this.state.headers2,
                    name: this.props.datasets.filter(
                      dataset => dataset.id === this.state.dataset2,
                    )[0].data.label,
                  },
                  this.state.joinType,
                )
              }
            >
              Add Node
            </Button>{' '}
          </Col>
        </Row>
      </Form>
    );
  }
}

export default JoinVegaBuilder;
