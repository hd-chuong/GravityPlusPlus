import React, {Component, Fragment} from 'react';
import {findDOMNode} from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, 
    Col,
    Card,
    CardTitle,
    CardBody,
} from 'reactstrap';
import {GetNodeById, GetOutgoingEdgesFromId} from "../../utils/graphUtil";
import {GetState} from "../../utils/stateMachine";
import Graph from "../DataDashboard/DataGraph";
import ReactQuill from "react-quill";
import Chart from "../VisDashboard/Chart";
import html2canvas from 'html2canvas';
import RecordRTC from 'recordrtc';

// Layout
export default class Story extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            spec: null,
            signals: [],
            intNodeId: null,
            editorState: '',
            isRecordingStarted: false,
            isStoppedRecording: false, 
        }

        this.onElementClick = this.onElementClick.bind(this);
        this.updateState = this.updateState.bind(this);
        this.looper = this.looper.bind(this);
        this.playVideo = this.playVideo.bind(this);

        this.presentation = React.createRef();
        this.canvas2d = document.createElement('canvas');
        this.canvas2d.setAttribute('id', 'recordedCanvas');
        this.recorder = new RecordRTC(this.canvas2d, {
            type: 'canvas'
        });
        this.canvas2d.width = 600;
        this.canvas2d.height = 600;
        this.canvas2d.style.top = 0;
        this.canvas2d.style.left = 0;
        this.canvas2d.zIndex = -1;
        (document.body || document.documentElement).appendChild(this.canvas2d);
    }

    looper() {
        var presentNode = findDOMNode(this.presentation.current);

        if(!this.state.isRecordingStarted) {
            return setTimeout(this.looper, 1000);
        }
        
        html2canvas(presentNode, {
            grabMouse: true,
            onrendered: function(canvas) {
                console.log("print this.canvas2d: ", this.canvas2d);
                const context = this.canvas2d.getContext('2d');
                context.clearRect(0, 0, canvas2d.width, canvas2d.height);
                context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);
                if(this.state.isStoppedRecording) {
                    return;
                }
                setTimeout(this.looper, 1);
            }
        });
    }

    componentDidMount()
    {    
        this.looper();
    }

    updateState(nextState)
    {
        this.setState({...nextState});
    }

    onElementClick(id)
    {
        const clickedNode = GetNodeById(this.props.intgraph, id);
        
        // if clicked on edges
        if (!clickedNode) return;

        this.setState({stateLoading: true});

        GetState(
            this.props.datasets.datasets, 
            this.props.datagraph, 
            this.props.visgraph, 
            this.props.intgraph, 
            id, 
            {},
            this.updateState
        );
    }

    updateGraphDisplay(id)
    {
        const displayedGraph = JSON.parse(JSON.stringify(this.props.intgraph));

        displayedGraph.nodes.forEach(node => {
            if (node.id !== id) node.style = null;
            else {
                node.style = currentNodeStyle;
            }
        });

        return displayedGraph;
    }
    
    startRecord()
    {
        this.setState({isRecordingStarted: true});
        this.setState({isStoppedRecording: false});
        var presentNode = findDOMNode(this.presentation.current);

        console.log("Hello there!");

        var recorder = this.recorder;

        // const recorder = this.recorder;
        this.playVideo(function() {
            console.log("Hello there");
            recorder.startRecording();
            console.log(recorder);
            setTimeout(function() {
                // document.getElementById('startRecording').disabled = false;
                console.log("hey")
            }, 1000);
        });
    }

    playVideo(callback) {
        var videoElement = document.querySelector('video');
        function successCallback(stream) {
            videoElement.onloadedmetadata = function() {
                callback();
            };
            videoElement.srcObject = stream;
            videoElement.play();
        }
        function errorCallback(error) {
            console.error('get-user-media error', error);
            callback();
        }
        var mediaConstraints = { video: true };
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    }

    
    stopRecord() {
        this.setState({isRecordingStarted: false});
        this.setState({isStoppedRecording: true});
        const recorder = this.recorder;
        recorder.stopRecording(function() {
            var blob = recorder.getBlob();
            
            console.log(blob);

            var video = document.createElement('video');
            video.src = URL.createObjectURL(blob);
            
            video.setAttribute('style', 'height: 100%; position: absolute; top:0;');
            document.body.appendChild(video);
            video.controls = true;
            video.play();
        });
    }

    render() 
    {
        const displayedGraph = this.updateGraphDisplay(this.state.intNodeId);
        const currentNode = GetNodeById(this.props.intgraph, this.state.intNodeId);   
        const graphDefaultPosition = currentNode? [currentNode.position.x, currentNode.position.y] : [0, 0]; 

        return (
            <div className="app-main">
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <ReactCSSTransitionGroup
                            component="div"
                            transitionName="TabsAnimation"
                            transitionAppear={true}
                            transitionAppearTimeout={0}
                            transitionEnter={false}
                            transitionLeave={false}
                        >
                            <Row>
                                <Col md={8}>
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}>
                                            <Chart
                                                id="presentation-chart"
                                                ref={this.presentation}
                                                title={"Current Scene"}
                                                data={this.state.data}
                                                spec={this.state.spec}  
                                                signals={this.state.signals}
                                            />                          
                                    </ReactCSSTransitionGroup>
                                </Col>

                                <Col md={4}>
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="TabsAnimation"
                                        transitionAppear={true}
                                        transitionAppearTimeout={0}
                                        transitionEnter={false}
                                        transitionLeave={false}
                                    >
                                        <Row sm={12}>
                                            <Col>
                                                <Card className="mb-2">
                                                    <CardBody>
                                                        <CardTitle>Video Recording</CardTitle>
                                                        <span onClick={this.startRecord.bind(this)}><i className="fa fa-video-camera" aria-hidden="true"></i> <small> Record</small>{' '}</span>
                                                        <span onClick={this.stopRecord.bind(this)}><i className="fa fa-stop" aria-hidden="true"></i>  <small> Stop</small></span>

                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row sm={12}>
                                            <Col>
                                                <Card className="mb-2">
                                                    <CardBody>
                                                        <CardTitle>Note</CardTitle>
                                                            {currentNode && <ReactQuill
                                                                readOnly
                                                                modules={modules}
                                                                value={currentNode.data.note || ''}
                                                                placeholder={"No notes available."}
                                                            />}
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        
                                        <Row sm={12}>
                                            <Col>
                                                <Card className="mb-2">
                                                    <CardBody>
                                                        <CardTitle>Next scene</CardTitle>
                                                        {GetOutgoingEdgesFromId(this.props.intgraph, this.state.intNodeId).map( (edge) => { 
                                                            const signal = edge.data.signal;
                                                            const {marktype, type} = signal.on[0].events;
                                                            const targetId = edge.target;
                                                            const targetNode = GetNodeById(this.props.intgraph, targetId);
                                                            const targetTitle = targetNode ? targetNode.data.label : "";
                                                            
                                                            return (<Fragment key={signal.name}>
                                                            <p>
                                                                <i className="fa fa-arrow-circle-o-right"></i>{'  '}
                                                                <i>{`${type}`}</i> on <strong>{`${marktype}`}</strong> to <i>{targetTitle}</i>
                                                            </p>
                                                        </Fragment>);
                                                        })}
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                <Graph height={150}
                                                    data={displayedGraph}
                                                    onElementClick={this.onElementClick.bind(this)}
                                                    defaultPosition={graphDefaultPosition}
                                                />
                                            </Col>
                                        </Row>                            
                                    </ReactCSSTransitionGroup>
                                </Col>
                            </Row>              
                    </ReactCSSTransitionGroup> 
                </div>
            </div>
        </div>
        )
    }
};

const modules = {
    toolbar: null,
};


const currentNodeStyle =
{
    background: '#9EE493',
    color: '#333'
};