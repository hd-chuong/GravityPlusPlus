import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Row, Col,
} from 'reactstrap';

import VisGraph from '../../DataDashboard/DataGraph';
import calculateDataset from '../../../utils/dataGeneration';
import { lazy } from 'react';
import JSONEditor from '../../JSONEditor';

export default class VisDashboard extends Component {
    render() {
        return (
            <Fragment>
                {/* <ReactCSSTransitionGroup
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
                                    <VisGraph 
                                        data={this.props.visgraph}
                                        onElementClick={this.onElementClick.bind(this)}
                                        onElementsRemove={this.deleteVisNode.bind(this)}
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            {this.state.dataPrepared && <Fragment>
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
                            }
                        </Row>                       
                    </div>
                    
                    <VisNodeInsertionModal
                        toggle={this.props.toggleNewNodeModal}
                        isOpen={this.props.isNewNodeModalOpen}
                        datagraph={this.props.datagraph}
                        datasets={this.props.datasets}
                        addVisNode={this.props.addVisNode}
                    />
                </ReactCSSTransitionGroup> */}
            </Fragment>
        )
    }
}
