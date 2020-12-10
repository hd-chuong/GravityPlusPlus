import Axios from 'axios';
import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {DataSpecsBuilder} from '../../../utils/VegaSpecsBuilder';
import {View, parse} from 'vega';
import {
    Row, 
    Col,
} from 'reactstrap';

import DataGraph from '../DataGraph';

export default class DataDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentData: null,
            currentDataLabel: null
        };
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.calculateDataset = this.calculateDataset.bind(this);
    }

    deleteNode(dataNodeId)
    {
        Axios({
            method: "get",
            url: `http://localhost:7473/data/nodes/${dataNodeId}/children`,
        }).then(response => 
        {
            if (response.statusText !== "OK")
            {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            } 
            else 
            {
                return response.data;
            }
        })
        .then(children => 
        {
            children.forEach(child => {
                
                // adding each child datasets to the list of all datasets
                this.calculateDataset(child.id)
                                    .then(data => {
                                        this.props.addDataset({name: child.name, dataset: data}
                                    )});
                
                // removing incoming edge
                this.props.removeEdges(child.id, "INCOMING");
                this.props.setDataNode(child.id, {type: "RAW"});
            });
        })
        .then(() => {
            this.props.removeDataNode(dataNodeId);
        })
        .catch(error => {
            alert("Unable to view the data: " + error.message);    
        });
    }

    calculateDataset(dataNodeId)
    {
        return Axios({
            method: "get",
            url: `http://localhost:7473/data/subgraph/${dataNodeId}`,
        }).then(response => {
            if (response.statusText !== "OK")
            {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            } 
            else {
                return response.data;
            }
        })
        .then(data => {
            // resort to Vega to automatically return the data
            // Vega data is based on a dataflow graph
            const specs = DataSpecsBuilder(data, this.props.datasets.datasets);
            const view = new View(parse(specs)).renderer("none").initialize();
            view.toSVG();
            const result = view.data(dataNodeId); 
            return result;
        })
        .catch(error => {
            alert("Unable to generate data: " + error.message);    
        });
    }

    updateCurrentData(dataNodeId)
    {
        this.calculateDataset(dataNodeId)
        .then(data => {
            const labels = this.props.datagraph.datagraph.nodes.filter(node => node.id === dataNodeId);

            if (labels.length !== 0)
            {
                this.setState({currentData: data});
                this.setState({currentDataLabel: labels[0].data.label});
            }
        })
        .catch(error => {
            alert("Unable to view the data: " + error.message);    
        });
    }
    
    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <Row>
                            <Col>
                                <ReactCSSTransitionGroup
                                component="div"
                                transitionName="TabsAnimation"
                                transitionAppear={true}
                                transitionAppearTimeout={0}
                                transitionEnter={false}
                                transitionLeave={false}>
                                    <DataGraph 
                                        datagraph={this.props.datagraph} 
                                        updateCurrentData={this.updateCurrentData.bind(this)}
                                        deleteNode={this.deleteNode}
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                        </Row>                       
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
