import React, {Component, Fragment, lazy} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, 
    Col,
} from 'reactstrap';
import Graph from '../../DataDashboard/DataGraph';
import IntNodeInsertionModal from '../IntNodeInsertionModal';
import IntEdgeInsertionModal from '../IntEdgeInsertionModal';
import {GetState} from "../../../utils/stateMachine";
import {GetNodeById} from "../../../utils/graphUtil";
import Chart from "../../VisDashboard/Chart";


export default class IntDashboard extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            stateLoading: false,
            data: null,
            spec: null,
            signals: [],
            intNodeId: null
        }
        this.updateState = this.updateState.bind(this);
    }
    
 
    updateState(nextState)
    {
        this.setState({...nextState});
    }

    updateGraphDisplay(id)
    {
        const displayedGraph = JSON.parse(JSON.stringify(this.props.intgraph));

        displayedGraph.nodes.forEach(node => {
            if (node.id !== id) node.style = null;
            else {
                node.style = currentNodeStyle;
            }
        })
        return displayedGraph;
    }

    onElementClick(id)
    {
        const clickedNode = this.props.intgraph.nodes.filter(
            node => node.id === id,
        )[0];
        // if clicked on edges
        if (!clickedNode) return;
        
        this.setState({stateLoading: true});
        GetState(
            this.props.datasets, 
            this.props.datagraph, 
            this.props.visgraph, 
            this.props.intgraph, 
            id, 
            {},
            this.updateState
        );
    }
    
    onElementsRemove(id)
    {
        if (GetNodeById(this.props.intgraph, id))
        {
            // remove node
            this.props.removeIntNode(id);
        }
        else 
        {
            // remove edge
            this.props.removeIntEdge(id);
        }
    }

    render() {
        const displayedGraph = this.updateGraphDisplay(this.state.intNodeId);

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
                                        data={displayedGraph}
                                        onElementClick={this.onElementClick.bind(this)}
                                        onElementsRemove={this.onElementsRemove.bind(this)}
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            {this.state.data && <Fragment>
                                <Col md={6}>
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}>
                                        <Chart 
                                            title={"Preview"}
                                            data={this.state.data}
                                            spec={this.state.spec}
                                            signals={this.state.signals}
                                        />                                   
                                    </ReactCSSTransitionGroup>
                                    {/* <ReactCSSTransitionGroup
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
                                    </ReactCSSTransitionGroup> */}
                                </Col>  
                            </Fragment>
                            }
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

const currentNodeStyle =
{
    background: '#9EE493',
    color: '#333'
};   
