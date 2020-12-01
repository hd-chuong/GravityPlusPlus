import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import {
    Row, Col,
    Button,
    CardHeader,
    Card,
    CardBody,
    Progress,
    TabContent,
    TabPane,
} from 'reactstrap';

import PageTitle from '../../../Layout/AppMain/PageTitle';

import {
    AreaChart, Area, Line,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    CartesianGrid,
    Tooltip,
    LineChart
} from 'recharts';

import {
    faAngleUp,
    faArrowRight,
    faArrowUp,
    faArrowLeft,
    faAngleDown
} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import AttributeExtracter from '../../../utils/AttributeExtractor';


const MAX_ROWS_DISPLAYED = 5;



export default class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            activeTab1: '11',
            dataset: props.tableData
        };

    }

    render() {

        if (this.state.dataset === null || this.state.dataset === undefined) return <div></div>;
        const headers = AttributeExtracter(this.state.dataset.dataset[0]);
        const data = this.state.dataset.dataset.slice(0, Math.min(MAX_ROWS_DISPLAYED, this.state.dataset.dataset.length));
        
        return (
            <Card className="main-card mb-3">
                    <div className="card-header">{this.state.dataset.filename}
                    </div>
                    <div className="table-responsive">
                        <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                            <thead>
                            <tr>{headers.map((key) => (<th key={key} className="text-center">{key}</th>))}</tr>
                            </thead>
                            <tbody>
                                {data.map(datum =>(<tr>{headers.map(key => (<td key={key} className="text-center">{datum[key]}</td>))}</tr>))}
                            </tbody>
                        </table>
                    </div>
            </Card>
        )
    }
}
