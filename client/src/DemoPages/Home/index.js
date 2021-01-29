import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, 
    CardBody, CardTitle, 
    Modal, ModalBody, 
    Input, 
    Label, ModalHeader, 
    Alert, Button
} from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import AsyncDataFileHandler from '../../utils/DataFileHandler';
import ReactFileReader from 'react-file-reader';
import validator from 'validator';
import reactFileReader from 'react-file-reader';
import { toast } from 'react-toastify';
class Home extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            projects: [],
            newProjModal: false,
            uploadProjModal: false,
            newProjName: ""
        };
        this.loadProject = this.loadProject.bind(this);
    }

    toggle()
    {
        this.setState({newProjModal: !this.state.newProjModal}, () => {
            if (!this.state.newProjModal) {
                this.setState({newProjName: ""});
            }
        });
    }

    toggleUpload()
    {
        this.setState({uploadProjModal: !this.state.uploadProjModal}, () => {
            if (!this.state.uploadProjModal) {
                this.setState({newProjName: ""});
            }
        });
    }
    
    handleUpload(files) {
        // asking for name
        const file = files[0];
        console.log(this.state.newProjName);

        // step one, create a empty database
        
        var readData;
        toast.info("Create blank database");
        
        return axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: this.state.newProjName, isNewProject: true}
        }).then(() => {
            
            toast.info("Reading files");
            
            return AsyncDataFileHandler(file);
        }).then(data => { 
            // upload datasets
            // array of datasets. Each record has data and name
            
            toast.info("Send dataset files to storage");
            const {datasets} = data.datasets;
            readData = data;
            return axios({
                url: 'http://localhost:7473/dataset',
                withCredentials: true,
                method: 'post',
                data: datasets,
            })
        }).then(() => { 
            toast.info("Send graph structure to neo4j");
            // upload graph to database
            const {datagraph, intgraph, visgraph} = readData;

            return axios({
                url: `http://localhost:7473/app/${this.state.newProjName}`,
                withCredentials: true,
                method: 'post',
                data: {
                    datagraph: datagraph.datagraph, 
                    visgraph: visgraph.visgraph, 
                    intgraph: intgraph.intgraph
                }
            })
        }).then(() => {
            toast.info("Loading project");
            setTimeout(() => {
                this.loadProject(this.state.newProjName);
            }, 1000);
        });        
    }

    componentDidUpdate() {
        // axios({
        //     url: 'http://localhost:7473/app',
        //     withCredentials: true,
        //     method: 'get'
        // })
        // .then(result => {
        //     this.setState({projects: result.data});
        // });
    }

    componentDidMount()
    {
        axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'get'
        })
        .then(result => {
            this.setState({projects: result.data});
        });
    }

    loadProject(name)
    {
        return axios({
            url: `http://localhost:7473/app/${name}`,
            withCredentials: true,
            method: 'get'
        }).then(response => {
            toast.info("Start loading...");
            const {datasets, datagraph, intgraph, visgraph} = response.data;
            this.props.load({datasets, datagraph, intgraph, visgraph});
            this.props.history.push('/data');
            return;
        });
    }

    newProject()
    {
        // const name = prompt("Please enter project name");
        if (!validateName(this.state.newProjName, this.state.projects))
        {
            return;
        }
        return axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: this.state.newProjName, isNewProject: true}
        })
        .then(data => {
            const {name, error} = data.data;
            if (name) {
                // empty project
                this.props.load(emptyProj);
                this.props.history.push('/data');
            }
            if (error) this.newProject();
        })
        .catch(err => {
            console.log(err);
        }); 
    }

    render() {
        const projects = this.state.projects.map(proj => ({name: proj}))
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
                                <Col md={4}>
                                    <CardBody>    
                                        <div onClick={() => this.setState({newProjModal: true})}>     
                                            <PageTitle
                                                heading="Create new project"
                                                icon="pe-7s-plus icon-gradient bg-mean-fruit"
                                            />
                                        </div>
                                        <div onClick={() => this.setState({uploadProjModal: true})}>     
                                            <PageTitle
                                                heading="Upload graph from your system"
                                                icon="pe-7s-upload icon-gradient bg-mean-fruit"
                                            />
                                        </div>
                                    </CardBody>
                                </Col>    
                                <Col md={6}>
                                    <CardTitle>Recent Projects</CardTitle>
                                    <CardBody>
                                        {this.state.projects.map((proj) => (
                                            <div onClick={() => {this.loadProject(proj)}} style={{cursor: `pointer`}}>
                                                <PageTitle 
                                                    heading={proj}
                                                    icon="pe-7s-cloud icon-gradient bg-mean-fruit"
                                                />
                                            </div>
                                        ))}
                                        {/* <ReactTable 
                                            data={projects}
                                            // columns={[{Header: "name", accessor: "name"}]}
                                            defaultPageSize={10}
                                            className="-striped -highlight"
                                        /> */}
                                    </CardBody>
                                </Col>
                            </Row>
                        </ReactCSSTransitionGroup>
                        <Modal isOpen={this.state.newProjModal} toggle={this.toggle.bind(this)}>
                            <ModalHeader>New Project</ModalHeader>
                            <ModalBody>
                                <Row className="form-group">
                                    <Label md={3}>Project name</Label>
                                    <Col>
                                        <Input 
                                            value={this.state.newProjName}
                                            type="text" 
                                            onChange={(e) => {this.setState({newProjName: e.target.value}) }}
                                        >
                                        </Input>
                                    </Col>
                                </Row>
                                
                                <Row className="form-group">
                                    <Col>
                                        <RenderNewProjMessage name={this.state.newProjName} projects={this.state.projects}/>
                                    </Col>
                                </Row>

                                {validateName(this.state.newProjName, this.state.projects) && <Row className="form-group">
                                    <Col>
                                        <Button color="primary" className="float-right" onClick={() => {this.newProject()}}>Create</Button>
                                    </Col>
                                </Row>}
                            </ModalBody>
                        </Modal>

                        <Modal isOpen={this.state.uploadProjModal} toggle={this.toggleUpload.bind(this)}>
                            <ModalHeader>Upload Project</ModalHeader>
                            <ModalBody>
                                <Row className="form-group">
                                    <Label md={3}>Project name</Label>
                                    <Col>
                                        <Input 
                                            value={this.state.newProjName}
                                            type="text" 
                                            onChange={(e) => {this.setState({newProjName: e.target.value}) }}
                                        >
                                        </Input>
                                    </Col>
                                </Row>
                                
                                <Row className="form-group">
                                    <Col>
                                        <RenderNewProjMessage name={this.state.newProjName} projects={this.state.projects}/>
                                    </Col>
                                </Row>

                                {validateName(this.state.newProjName, this.state.projects) && <Row className="form-group">
                                    <Col>
                                        <ReactFileReader
                                                handleFiles={this.handleUpload.bind(this)}
                                                fileTypes={['.gpp']}
                                        >
                                        <Button color="primary" className="float-right">Upload file</Button>
                                        </ReactFileReader>
                                    </Col>
                                </Row>}
                            </ModalBody>
                        </Modal>

                                {/* <Col md={3}><i className="fa fa-spin fa-cog fa-2x" aria-hidden="true"></i></Col>
                                <Col>
                                    <p>
                                        Exporting scene {this.state.currentSceneIndex} out of {this.props.intgraph.nodes.length} to pdf.
                                    </p>
                                </Col> */}
                            
                                                                
                                {/* <Progress className="mb-2" color="success" value={(this.state.currentSceneIndex * 100) / this.props.intgraph.nodes.length} /> */}

                    </div>
                </div>
            </div>
        );
    }
}

const RenderNewProjMessage = ({name, projects}) => {
    if (!(typeof name === 'string' || name instanceof String)) 
    {
        return <Alert color="warning">Project name must be a string.</Alert>;
    }

    if (name.length === 0) return null;

    if (name.length < 3) 
    {
        return <Alert color="warning">Project name should contain at least 3 characters.</Alert>;
    }
    if (!validator.isAlpha(name))
    {
        return <Alert color="warning">Project name should contain only A-Z and a-z characters.</Alert>
    }

    const isDuplicatedName = projects.includes(name); 

    if (isDuplicatedName) return <Alert color="warning">Project "{name}" already exists.</Alert>
    return null;
}

const emptyProj = {
    datasets: {
      datasets: [],
      errMess: null
    },
    datagraph: {
      datagraph: {edges: [], nodes: []},
      errMess: null
    },
    visgraph: {
      visgraph: {edges: [], nodes: []},
      errMess: null
    },
    intgraph: {
      intgraph: {edges: [], nodes: []},
      errMess: null
    }
  };

const validateName = (name, projects) => {
    if (!(typeof name === 'string' || name instanceof String)) 
    {
        // toast.error("Unexpected problem occurred. Please try again!", toastOptions);
        return false;
    }
    if (name.length < 3) 
    {
        // toast.error("Project name must have at least three characters.", toastOptions);
        return false;
    }
    if (!validator.isAlpha(name))
    {
        // toast.error("Project name should only contain a-z and A-Z characters.", toastOptions);
        return false;
    }

    
    return !projects.includes(name); 
    
}

export default withRouter(Home);

