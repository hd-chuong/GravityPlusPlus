import Axios from 'axios';
import React, { Component, Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col, Card, CardHeader, Input, CardBody } from 'reactstrap';
import DataTable from '../DataTable';
import DataGraph from '../DataGraph';
import {toast} from 'react-toastify';
// MODALS
import DataNodeInsertionModal from '../DataNodeInsertionModal';
import calculateDataset from '../../../utils/dataGeneration';
import {describeParams} from "../../../utils/describeParams";
import toastOptions from '../../config/toastOptions';
export default class DataDashboard extends Component {
    constructor(props) 
    {
        super(props);
        this.state = {
            currentData: null,
            params: {},
            spec: {},
            currentDataId: null
        };
        this.updateCurrentData = this.updateCurrentData.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.updateParams = this.updateParams.bind(this);
    }

    deleteNode(dataNodeId)
    {
        Axios({
            method: "get",
            url: `http://localhost:7473/data/nodes/${dataNodeId}/children`,
            withCredentials: true,
        })
        .then(response => 
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
                                    .then(({data}) => {
                                        this.props.addDataset({name: child.name, dataset: data}
                                    )});
                
                // removing incoming edge
                this.props.removeDataEdges(child.id, "INCOMING");
                this.props.setDataNode(child.id, {type: "RAW"});
            });
        })
        .then(() => 
        {
            this.props.removeDataNode(dataNodeId);
        })
        .catch(error => {
            toast.error("Unable to delete the data node: " + error.message, toastOptions);    
        });
    }

    updateCurrentData(dataNodeId)
    {
        this.setState(({currentDataId: dataNodeId}));
        calculateDataset(dataNodeId, this.props.datasets.datasets)
        .then(({data, params, spec}) => {
            this.setState({currentData: data, params, spec});
        }).catch(error => {
            toast.error("Unable to view the data: " + error.message, toastOptions);    
        });
    }

    getCurrentLabel(dataNodeId)
    {
        const labels = this.props.datagraph.datagraph.nodes.filter(node => node.id === dataNodeId);
        if (labels.length !== 0)
        {
            return labels[0].data.label
        }
        return "";
    }

    updateParams(paramDict)
    {
        this.setState({params: Object.assign(this.state.params, paramDict)}, () => {
            calculateDataset(this.state.currentDataId, this.props.datasets.datasets, this.state.params)
            .then(({data, params, spec}) => {
                this.setState({currentData: data, params, spec});
            }).catch(error => {
                toast.error("Unable to view the data: " + error.message, toastOptions);    
            });
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
                                    onNodeDragStop={this.props.setDataPosition}
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
                                transitionLeave={false}
                            >
                                <DataTable 
                                    label={this.getCurrentLabel(this.state.currentDataId)} 
                                    tableData={this.state.currentData}
                                />
                                
                                {/*
                                    Will make these become a separate class now
                                */}
                                {/* <Card className="main-card mb-3">
                                    <CardHeader>
                                        Params control    
                                    </CardHeader>
                                    <CardBody>
                                        {                                                
                                            this.state.spec.data && describeParams(this.state.spec.data, Object.keys(this.state.params))
                                            .map((param) => (
                                                <div>
                                                    <p>{param.description}</p>
                                                    <Input 
                                                        defaultValue=""
                                                        type="text" onChange={(e) => {
                                                            this.updateParams({[param.name]: e.target.value})
                                                        }}>
                                                    </Input>
                                                </div>
                                                ))
                                        }
                                    </CardBody>
                                </Card> */}
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
