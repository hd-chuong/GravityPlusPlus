import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Row, Col, CardBody, CardTitle, Pag} from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import {withRouter} from 'react-router-dom';
// import ReactTable from "react-table";
// import "react-table/react-table.css";
import axios from 'axios';
import AsyncDataFileHandler from '../../utils/DataFileHandler';
import ReactFileReader from 'react-file-reader';

class Home extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            projects: []
        }
    }

    handleUpload(files) {
        // asking for name
        const name = prompt("Please enter project name");

        const file = files[0];
        
        // step one, create a empty database

        return axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: name, isNewProject: true}
        }).then(() => {
            AsyncDataFileHandler(file).then(data => { 
                // upload datasets
                // array of datasets. Each record has data and name
                const {datasets} = data.datasets;
                return axios({
                    url: 'http://localhost:7473/dataset',
                    withCredentials: true,
                    method: 'post',
                    data: datasets,
                }).then(() => {
                    return data;
                })  
            }).then(({datagraph, intgraph, visgraph}) => {
                // upload graph to database
                return axios({
                    url: `http://localhost:7473/app/${name}`,
                    withCredentials: true,
                    method: 'post',
                    data: {
                        datagraph: datagraph.datagraph, 
                        visgraph: visgraph.visgraph, 
                        intgraph: intgraph.intgraph
                    }
                })
            });
        });

        
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
            console.log(response.data);
            const {datasets, datagraph, intgraph, visgraph} = response.data;

            this.props.load({datasets, datagraph, intgraph, visgraph});
            this.props.history.push('/data');
        })
    }

    newProject()
    {
        const name = prompt("Please enter project name");
        return axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: name, isNewProject: true}
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
                                        <div onClick={this.newProject.bind(this)}>     
                                            <PageTitle
                                                heading="Create new project"
                                                icon="pe-7s-plus icon-gradient bg-mean-fruit"
                                            />
                                        </div>
                                        <ReactFileReader
                                                handleFiles={this.handleUpload.bind(this)}
                                                fileTypes={['.gpp']}
                                        >
                                            <PageTitle
                                                heading="Upload graph from your system"
                                                icon="pe-7s-upload icon-gradient bg-mean-fruit"
                                            />
                                        </ReactFileReader>
                                    </CardBody>
                                </Col>    
                                <Col md={6}>
                                    <CardTitle>Recent Projects</CardTitle>
                                    <CardBody>
                                        {this.state.projects.map((proj) => (
                                            <div onClick={() => {this.loadProject(proj)}} style={{cursor: `pointer`}}>
                                                <PageTitle 
                                                    heading={proj}
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
                    </div>
                </div>
            </div>
        );
    }
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

export default withRouter(Home);

