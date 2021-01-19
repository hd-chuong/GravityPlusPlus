import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Row, Col, CardBody, CardTitle} from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import {withRouter} from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

class Home extends React.Component {
    constructor(props)
    {
        super(props)
    }

    newProject()
    {
        const name = prompt("Please enter project name");

        // fetch('http://localhost:7473/app', {
        //     method: 'post',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({name: name, isNewProject: true}),
        //     credentials: 'include',
        // })
        // .then(response => {
        //     return response.json();
        // })
        axios({
            url: 'http://localhost:7473/app',
            withCredentials: true,
            method: 'post',
            data: {name: name, isNewProject: true}
        })
        .then(data => {
            const {name} = data;
            if (name) this.props.history.push('/data');    
        })
        .catch(err => {
            console.log(err);
        }) 
    }

    render() {
        // Cookies.set("pi", 3.14) 
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