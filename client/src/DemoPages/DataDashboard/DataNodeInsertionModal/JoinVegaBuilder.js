import React, { Fragment } from 'react';
import { Label, Input, Row, Col, Form, Button } from 'reactstrap';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import { JoinTypes } from '../../../utils/VegaSpecsBuilder';
import AttributeExtractor from '../../../utils/AttributeExtractor';
import { toast } from 'react-toastify';
import toastOptions from '../../config/toastOptions';
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

  handleSubmitJoin() 
  {
    const name = this.joinNodeName.value;
    const type = this.state.joinType;

    const chosenDataset1 = this.props.datasets.filter(
      dataset => dataset.id === this.state.dataset1,
    );
    
    const chosenDataset2 = this.props.datasets.filter(
      dataset => dataset.id === this.state.dataset2,
    );
    
    if (chosenDataset1.length === 0)
    {
      toast.warn("You must select a left dataset.", toastOptions);
      return;
    }

    if (chosenDataset2.length === 0)
    {
      toast.warn("You must select a right dataset.", toastOptions);
      return;
    }

    if (!type) 
    {
      toast.warn("You must provide a joining type", toastOptions);
      return;
    }
    
    if (!name)
    {
      toast.warn('You must provide a node name', toastOptions);
      return;
    }

    if (!this.state.attribute1 || !this.state.attribute2)
    {
      toast.warn('You must provide attribute name for both datasets', toastOptions);
      return;
    }

    const leftNode = {
      id: this.state.dataset1,
      attribute: this.state.attribute1,
      headers: this.state.headers1,
      name: chosenDataset1[0].data.label,
    };

    const rightNode = {
      id: this.state.dataset2,
      attribute: this.state.attribute2,
      headers: this.state.headers2,
      name: this.props.datasets.filter(
        dataset => dataset.id === this.state.dataset2,
      )[0].data.label,
    };

    this.props.handleSubmit(
      name,
      leftNode,
      rightNode,
      type
    )
  }

  render() {
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
              onClick={this.handleSubmitJoin.bind(this)}
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
