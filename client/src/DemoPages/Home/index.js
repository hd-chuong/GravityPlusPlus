import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Row, Col, CardBody, CardTitle} from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

class Home extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            projects: []
        }
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
                this.props.history.push('/data');
            }
            if (error) this.newProject();
        })
        .catch(err => {
            console.log(err);
        }); 
    }

    render() {

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
                            {/* <PageTitle
                                heading="Gravity++"
                                subheading="Graph-based storytelling"
                                icon="pe-7s-graph1 icon-gradient bg-mean-fruit"
                            /> */}

                            <Row>     
                                <Col md={4}>
                                    <CardBody>    
                                        <div onClick={this.newProject.bind(this)}>     
                                        <PageTitle
                                            heading="Create new project"
                                            icon="pe-7s-plus icon-gradient bg-mean-fruit"
                                        />
                                        </div>
                                        <PageTitle
                                            heading="Upload graph from your system"
                                            icon="pe-7s-upload icon-gradient bg-mean-fruit"
                                        />
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

export default withRouter(Home);