import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const VisNodeInsertionModal = lazy(() => import('../VisNodeInsertionModal'));

import {
    Row, 
    Col,
} from 'reactstrap';

import VisGraph from '../../DataDashboard/DataGraph';
import Chart from '../Chart';
import calculateDataset from '../../../utils/dataGeneration';
import { lazy } from 'react';
export default class VisDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNode: null,
            currentNodeData: null,
            dataPrepared: true
        };
    }

    onElementClick(id)
    {
        this.setState({dataPrepared: false});
        this.setState({currentNode: this.props.visgraph.nodes.filter(node => node.id === id)[0] }, () => {
            calculateDataset(this.state.currentNode.data.dataSource, this.props.datasets.datasets).then(data => 
            {
                this.setState({currentNodeData: data}) 
                this.setState({dataPrepared: true});
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
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            {this.state.dataPrepared && <Col md={6}>
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
                                        spec={this.state.currentNode && this.state.currentNode.data.spec}
                                    />                                   
                                </ReactCSSTransitionGroup>
                            </Col>}
                        </Row>                       
                    </div>
                    <VisNodeInsertionModal
                        toggle={this.props.toggleNewNodeModal}
                        isOpen={this.props.isNewNodeModalOpen}
                        datagraph={this.props.datagraph}
                        datasets={this.props.datasets}
                        addVisNode={this.props.addVisNode}
                    />
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
