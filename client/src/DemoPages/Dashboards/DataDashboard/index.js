import Axios from 'axios';
import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import classnames from 'classnames';
import {DataSpecsBuilder} from '../../../utils/VegaSpecsBuilder';
import {View, parse} from 'vega';
import {cloneDeep} from 'lodash'
import {
    Row, Col,
    // Button,
    // CardHeader,
    // Card,
    // CardBody,
    // Progress,
    // TabContent,
    // TabPane,
} from 'reactstrap';

// import PageTitle from '../../../Layout/AppMain/PageTitle';

// import {
//     AreaChart, Area, Line,
//     ResponsiveContainer,
//     Bar,
//     BarChart,
//     ComposedChart,
//     CartesianGrid,
//     Tooltip,
//     LineChart
// } from 'recharts';

// import {
//     faAngleUp,
//     faArrowRight,
//     faArrowUp,
//     faArrowLeft,
//     faAngleDown
// } from '@fortawesome/free-solid-svg-icons';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import DataTable from '../DataTable';
import DataGraph from '../DataGraph';

// MODALS
import DataNodeInsertionModal from '../DataNodeInsertionModal';

export default class DataDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentData: null
        };
        this.updateCurrentData = this.updateCurrentData.bind(this);
    }

    updateCurrentData(dataNodeId)
    {
        Axios({
            method: "get",
            url: `http://localhost:7473/data/subgraph/${dataNodeId}`,
        }).then(response => {
            if (response.statusText !== "OK")
            {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            } 
            else {
                return response.data;
            }
        })
        .then(data => {
            // resort to Vega to automatically return the data
            // Vega data is based on a dataflow graph
            const specs = DataSpecsBuilder(data, this.props.datasets.datasets);
            const view = new View(parse(specs)).renderer("none").initialize();
            view.toSVG();
            return view.data(dataNodeId);
        })
        .then(data => {
            console.log(data);
            this.setState({currentData: cloneDeep(data)});
        })
        .catch(error => {
            alert("Unable to view the data: " + error.message);    
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
                            <Col>
                                <ReactCSSTransitionGroup
                                component="div"
                                transitionName="TabsAnimation"
                                transitionAppear={true}
                                transitionAppearTimeout={0}
                                transitionEnter={false}
                                transitionLeave={false}>
                                    <DataGraph datagraph={this.props.datagraph} updateCurrentData={this.updateCurrentData.bind(this)}/>
                                </ReactCSSTransitionGroup>
                            </Col>
                        </Row>                       
                        <Row>
                            <Col md="6" >
                                <ReactCSSTransitionGroup
                                component="div"
                                transitionName="TabsAnimation"
                                transitionAppear={true}
                                transitionAppearTimeout={0}
                                transitionEnter={false}
                                transitionLeave={false}>
                                    <DataTable tableData={this.state.currentData}/>
                                </ReactCSSTransitionGroup>
                            </Col>
                        </Row>
                        <DataNodeInsertionModal 
                            datasets={this.props.datasets} 
                            isOpen={this.props.isNewNodeModalOpen} 
                            toggle={this.props.toggleNewNodeModal}
                            addDataNode={this.props.addDataNode}
                            addDataEdge={this.props.addDataEdge}
                            datagraph={this.props.datagraph}
                        />
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}
