import Axios from 'axios';
import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import VisNodeInsertionModal from '../VisNodeInsertionModal';

import {
    Row, 
    Col,
} from 'reactstrap';

import VisGraph from '../../DataDashboard/DataGraph';

export default class DataDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentData: null,
            currentDataLabel: null
        };
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
                                    <VisGraph />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                            
                            <Col md={6}>
                                <ReactCSSTransitionGroup
                                component="div"
                                transitionName="TabsAnimation"
                                transitionAppear={true}
                                transitionAppearTimeout={0}
                                transitionEnter={false}
                                transitionLeave={false}>
                                    <VisGraph />                                    
                                </ReactCSSTransitionGroup>
                            </Col>
                        </Row>                       
                    </div>
                    <VisNodeInsertionModal
                        toggle={this.props.toggleNewNodeModal}
                        isOpen={this.props.isNewNodeModalOpen}
                        datagraph={this.props.datagraph}
                    />
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
