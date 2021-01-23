import React, {Component, Fragment, lazy} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, 
    Col,
    Card,
    CardTitle,
    CardBody,
    Button,
    Nav,
    NavItem,
    CardHeader
} from 'reactstrap';
import Graph from '../../DataDashboard/DataGraph';
import IntNodeInsertionModal from '../IntNodeInsertionModal';
import IntEdgeInsertionModal from '../IntEdgeInsertionModal';
import {GetState} from "../../../utils/stateMachine";
import {GetNodeById} from "../../../utils/graphUtil";
import Chart from "../../VisDashboard/Chart";
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import toastOptions from '../../config/toastOptions';

export default class IntDashboard extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            data: null,
            spec: null,
            signals: [],
            intNodeId: null,
            editorState: '',
        }
        this.updateState = this.updateState.bind(this);
        this.editorChange = this.editorChange.bind(this);
    }

    updateState(nextState)
    {
        this.setState({...nextState});
    }

    editorChange(editorState)
    {
        this.setState({editorState});
    }

    reset = () => {
        const currentNode = GetNodeById(this.props.intgraph, this.state.intNodeId);
        this.editorChange(currentNode.data.note)
        toast.info("Reset note", toastOptions);
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
        
        GetState(
            this.props.datasets, 
            this.props.datagraph, 
            this.props.visgraph, 
            this.props.intgraph, 
            id, 
            {},
            this.updateState
        ).then(() => {
            const node = GetNodeById(this.props.intgraph, this.state.intNodeId);
            if (node)
            {
                this.editorChange(node.data.note || '' );   
            }
            console.log(node);
        });
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
        const currentNode = GetNodeById(this.props.intgraph, this.state.intNodeId);

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
                                        onNodeDragStop={this.props.setIntPosition}
                                    />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            {this.state.data && currentNode && <Fragment>
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
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}>
                                        <Card>
                                            <CardHeader className="card-header-tab">                     
                                            Presentation Note
                                                <Nav>
                                                    <NavItem>
                                                        <Button
                                                            color="dark"
                                                            className="float-right"
                                                            onClick={this.reset.bind(this)}
                                                        > {' '}
                                                            Reset
                                                        </Button>
                                                    </NavItem>
                                                    <NavItem>
                                                        <Button
                                                        color="primary"
                                                        className="float-right"
                                                        onClick={() => this.props.setIntNode(this.state.intNodeId, {note: this.state.editorState})}
                                                        >
                                                        {' '}
                                                        Save
                                                        </Button>
                                                        {' '}
                                                    </NavItem>
                                                </Nav>
                                            </CardHeader>
                                        <CardBody>   
                                            <ReactQuill 
                                                theme="snow"
                                                value={this.state.editorState} 
                                                onChange={this.editorChange}
                                                modules={modules}
                                                formats={formats}
                                                placeholder={'Enter some notes here'}
                                            />                                  
                                        </CardBody>
                                    </Card>
                                    </ReactCSSTransitionGroup>
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

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
    ],
  };

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
];