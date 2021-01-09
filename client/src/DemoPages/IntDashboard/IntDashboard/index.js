import React, {Component, Fragment, lazy} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, 
    Col,
} from 'reactstrap';

import Graph from '../../DataDashboard/DataGraph';
import calculateDataset from '../../../utils/dataGeneration';
import IntNodeInsertionModal from '../IntNodeInsertionModal';
import IntEdgeInsertionModal from '../IntEdgeInsertionModal';

export default class IntDashboard extends Component {
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
                            <Col md={6}>
                                <ReactCSSTransitionGroup
                                    component="div"
                                    transitionName="TabsAnimation"
                                    transitionAppear={true}
                                    transitionAppearTimeout={0}
                                    transitionEnter={false}
                                    transitionLeave={false}>
                                    <Graph 
                                        data={this.props.intgraph}
                                        // onElementClick={this.onElementClick.bind(this)}
                                        // onElementsRemove={this.deleteVisNode.bind(this)}
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            {/* {this.state.dataPrepared && <Fragment>
                                <Col md={6}>
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}>
                                        <Chart 
                                            title={this.state.currentNode && this.state.currentNode.data.label}
                                            data={this.state.currentNode && this.state.currentNodeData}
                                            spec={this.state.specDisplayed}
                                        />                                   
                                    </ReactCSSTransitionGroup>
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}>
                                        <JSONEditor 
                                            json={this.state.currentNode && this.state.currentNode.data.spec}
                                            onSave={(newSpec) => this.props.setVisNode(this.state.currentNode.id, {spec: newSpec})}
                                            onSpecChange={(newSpec) => this.setState({specDisplayed: newSpec})}
                                        />                                   
                                    </ReactCSSTransitionGroup>
                                </Col>  
                            </Fragment>
                            } */}
                        </Row>                       
                    </div>
                    
                    <IntNodeInsertionModal
                        toggle={this.props.toggleNewNodeModal}
                        isOpen={this.props.isNewNodeModalOpen}
                        datasets={this.props.datasets}
                        datagraph={this.props.datagraph}
                        visgraph={this.props.visgraph}    
                        addIntNode={this.props.addIntNode}
                    />

                    {this.props.isNewEdgeModalOpen && <IntEdgeInsertionModal
                        toggle={this.props.toggleNewEdgeModal}
                        isOpen={this.props.isNewEdgeModalOpen}
                        datasets={this.props.datasets}
                        datagraph={this.props.datagraph}
                        visgraph={this.props.visgraph}
                        intgraph={this.props.intgraph}
                        addIntEdge={this.props.addIntEdge}
                    />}
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
