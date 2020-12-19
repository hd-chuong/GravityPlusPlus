import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
const VisNodeInsertionModal = lazy(() => import('../VisNodeInsertionModal'));

import {Row, Col,
} from 'reactstrap';

import VisGraph from '../../DataDashboard/DataGraph';
import Chart from '../Chart';
import calculateDataset from '../../../utils/dataGeneration';
import { lazy } from 'react';
import JSONEditor from '../../JSONEditor';

export default class VisDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNode: null,
            currentNodeData: null,
            specDisplayed: null,
            // flag to wait for elements to be loaded
            dataPrepared: true
        };
    }

    componentDidMount()
    {
        var removedVisNodes = 0;
        this.props.visgraph.nodes.forEach((node) => {
            const dataSource = node.data.dataSource;
            // when the visgraph is rerendered again, the vis node without data source must be removed.
            if (this.props.datagraph.nodes.filter(node => node.id === dataSource).length === 0)
            {
                removedVisNodes++;
                this.props.removeVisNode(node.id);
            }
            // notify the users of this
        })
        if (removedVisNodes) console.log(`We remove ${removedVisNodes} visualisation nodes because their corresponding data nodes have been removed.`);
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
            this.setState({specDisplayed: this.state.currentNode.data.spec})
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
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
