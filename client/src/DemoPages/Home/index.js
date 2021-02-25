import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col, 
    CardBody, 
    Modal, 
    ModalBody, 
    Input, 
    Label, 
    ModalHeader, 
    Alert, 
    Button
} from 'reactstrap';

import PageTitle from '../../Layout/AppMain/PageTitle';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import AsyncDataFileHandler from '../../utils/DataFileHandler';
import validator from 'validator';
import Cookie from 'js-cookie';
import MUIDataTable from 'mui-datatables';
import { toast } from 'react-toastify';
import toastOptions from '../config/toastOptions';

class Home extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            projects: [],
            newProjModal: false,
            uploadProjModal: false,
            uploadPending: false,
            newProjName: "",
            messagePending: ""
        };
        this.loadProject = this.loadProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
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
    
    handleUpload(event) {
        // asking for name
        const files = event.target.files;
        const file = files[0];

        // step one, create a empty database
        
        this.setState({uploadPending: true});
        var readData;
        this.setState({messagePending: "Create blank database"});
        
        return axios({
            url: 'http://139.59.103.42:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: this.state.newProjName, isNewProject: true}
        }).then(() => {
            this.setState({messagePending: "Reading files"});            
            return AsyncDataFileHandler(file);
        }).then(data => { 
            // upload datasets
            // array of datasets. Each record has data and name
            
            this.setState({messagePending:"Send dataset files to storage"});
            const {datasets} = data.datasets;
            readData = data;
            return axios({
                url: 'http://139.59.103.42:7473/dataset',
                withCredentials: true,
                method: 'post',
                data: datasets,
            })
        }).then(() => { 
            this.setState({messagePending:"Send graph structure to neo4j"});
            // upload graph to database
            const {datagraph, intgraph, visgraph} = readData;
        
            return axios({
                url: `http://139.59.103.42:7473/app/${this.state.newProjName}`,
                withCredentials: true,
                method: 'post',
                data: {
                    datagraph: datagraph.datagraph, 
                    visgraph: visgraph.visgraph, 
                    intgraph: intgraph.intgraph
                }
            })
        }).then(() => {
            this.setState({messagePending: "Loading project"});
            setTimeout(() => {
                this.loadProject(this.state.newProjName);
                this.setState({messagePending: "", uploadPending: false});
                document.title = `Gravity++ | ${this.state.newProjName}`;
            }, 500);
        });        
    }

    componentDidMount()
    {
        this.setState({
            newProjModal: false,
            uploadProjModal: false,
            uploadPending: false,
            newProjName: "",
            messagePending: ""
        });

        axios({
            url: 'http://139.59.103.42:7473/app',
            withCredentials: true,
            method: 'get'
        })
        .then(result => {
            this.setState({projects: result.data});
        });
    }

    loadProject(name)
    {
        this.setState({
            uploadPending: true, 
            messagePending: `Loading project ${name}...`
        });

        return axios({
            url: `http://139.59.103.42:7473/app/${name}`,
            withCredentials: true,
            method: 'get'
        }).then(response => {
            Cookie.set("project_name", name);
            const {datasets, datagraph, intgraph, visgraph} = response.data;
            this.props.load({datasets, datagraph, intgraph, visgraph});
            this.props.history.push('/data');
            return;
        });
    }

    newProject()
    {
        this.setState({uploadPending: true});
        this.setState({messagePending: "Create blank database"});
 
        // const name = prompt("Please enter project name");
        if (!validateName(this.state.newProjName, this.state.projects))
        {
            return;
        }
        
        return axios({
            url: 'http://139.59.103.42:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: this.state.newProjName, isNewProject: true}
        })
        .then(data => {
            const {name, error} = data.data;
            
            return setTimeout(() => {
                this.setState({uploadPending: false});
                this.setState({messagePending: ""});
                this.loadProject(this.state.newProjName);
            }, 1000);
        })
        .catch(err => {
            console.log(err);
        }); 
    }

    
    deleteProject(projectName)
    {
        return axios({
            url: `http://139.59.103.42:7473/app/${projectName}`,
            withCredentials: true,
            method: 'delete'
        }).then(() => {
            this.setState(({projects}) => ({projects: projects.filter(project => project !== projectName)}));
            toast.success(`Successfully deleted ${projectName}.`, toastOptions);
        }, () => {
            toast.error(`Failed to delete ${projectName}`, toastOptions);
        })
    }

    render() {
        const projects = this.state.projects.map(proj => ({name: proj, panels: proj}))
        
        const loadProject = this.loadProject;
        const deleteProject = this.deleteProject;
        const headers = [
            {name: "name", 
            label: "Name", options: {
                filter: true, 
                sort: true,
                customBodyRender: (value, tableMeta) => {
                    return (
                    <p onClick={() => loadProject(value)}style={{cursor: `pointer`}}>{value}</p>
                );
                },
            }},
            {
                name: "panels", 
                label: " ",
                options: {
                    customBodyRender: (value) => {
                        return (
                        <div className="float-right">
                            <Button color="info" onClick={() => loadProject(value)}><i className="fa fa-external-link"></i></Button> {" "}
                            <Button color="danger" onClick={() => deleteProject(value)}><i className="fa fa-trash-o"></i></Button>
                        </div>
                    );
                    },
                    filter: false, 
                    sort: false
              }
            },
        ]

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
                                    <MUIDataTable 
                                        title="Recent Projects" 
                                        data={projects}  
                                        columns={headers}
                                        options={options}
                                    />
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
                            <ModalHeader>Load Project</ModalHeader>
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
                                        {/* <ReactFileReader
                                                handleFiles={this.handleUpload.bind(this)}
                                                fileTypes={['.gpp']}
                                        > */}
                                        <Input type='file' accept='.gpp' onChange={this.handleUpload.bind(this)} />
                                        {/* <Button color="primary" className="float-right">Upload file</Button> */}
                                        {/* </ReactFileReader> */}
                                    </Col>
                                </Row>}
                            </ModalBody>
                        </Modal>

                        <Modal isOpen={this.state.uploadPending}>
                            <ModalBody>
                                <Row>
                                <Col md={3}><i className="fa fa-spin fa-cog fa-2x" aria-hidden="true"></i></Col>
                                <Col>
                                    <p>{this.state.messagePending}</p>
                                </Col>
                                </Row>
                                {/* <Progress className="mb-2" color="success" value={(this.state.currentSceneIndex * 100) / this.props.intgraph.nodes.length} /> */}
                            </ModalBody>
                        </Modal>
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
    if (name === "system")
    {
        return <Alert color="warning">Project name must not be neo4j or system.</Alert>;
    }
    if (!validator.isAlpha(name) || name.toLowerCase() !== name)
    {
        return <Alert color="warning">Project name should only contain a-z characters.</Alert>
    }

    const isDuplicatedName = projects.includes(name); 

    if (isDuplicatedName) return <Alert color="warning">Project "{name}" already exists.</Alert>
    return null;
}

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
    if (!validator.isAlpha(name) || name.toLowerCase() !== name)
    {
        // toast.error("Project name should only contain a-z and A-Z characters.", toastOptions);
        return false;
    }
    if (name === "neo4j" || name === "system")
    {
        return false;
    }

    
    return !projects.includes(name); 
    
}

const options = {
    selectableRows: 'none',
    filterType: 'multiselect',
    toolbar: {
      viewColumns: false
    },
    onRowClick: (e, r) => console.log(e, r)
  }

export default withRouter(Home);

