import Axios from 'axios';
import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import classnames from 'classnames';

import {
    Row, 
    Col,
} from 'reactstrap';

import DataTable from '../DataTable';
import DataGraph from '../DataGraph';
import calculateDataset from '../../../utils/dataGeneration';

// MODALS
import DataNodeInsertionModal from '../DataNodeInsertionModal';

export default class DataDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentData: null,
            currentDataLabel: null
        };
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
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
                calculateDataset(child.id, this.props.datasets.datasets)
                                    .then(data => {
                                        this.props.addDataset({name: child.name, dataset: data}
                                    )});
                
                // removing incoming edge
                this.props.removeDataEdges(child.id, "INCOMING");
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

    updateCurrentData(dataNodeId)
    {
        calculateDataset(dataNodeId, this.props.datasets.datasets)
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
                                    data={this.props.datagraph.datagraph} 
                                    onElementClick={this.updateCurrentData.bind(this)}
                                    onElementsRemove={this.deleteNode}
                                />                                    
                            </ReactCSSTransitionGroup>
                        </Col>
                        <Col md="5" >   
                            <ReactCSSTransitionGroup
                            component="div"
                            transitionName="TabsAnimation"
                            transitionAppear={true}
                            transitionAppearTimeout={0}
                            transitionEnter={false}
                            transitionLeave={false}>
                                <DataTable 
                                    label={this.state.currentDataLabel} 
                                    tableData={this.state.currentData}
                                />
                            </ReactCSSTransitionGroup>
                        </Col>
                    </Row>

                    
                    <DataNodeInsertionModal 
                            datasets={this.props.datasets} 
                            isOpen={this.props.isNewNodeModalOpen} 
                            toggle={this.props.toggleNewNodeModal}
                            addDataNode={this.props.addDataNode}
                            addDataEdge={this.props.addDataEdge}

                            removeDataNode={this.props.removeDataNode}

                            datagraph={this.props.datagraph}
                            updateCurrentData={this.updateCurrentData}
                            currentData={this.state.currentData}              
                        />
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
