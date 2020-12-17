import React, {Component, Fragment} from 'react';

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

import AttributeExtractor from '../../../utils/AttributeExtractor';

const MAX_ROWS_DISPLAYED = 5;

export default class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            activeTab1: '11'
        };
    }

    render() {
        if (this.props.tableData === null || this.props.tableData === undefined) return (
            <Card className="main-card mb-3">
            <div className="card-header">Table View
            </div>
            <CardBody>Please select a data node to view the dataset</CardBody>
            </Card>
        );
        const headers = AttributeExtractor(this.props.tableData[0]);
        const data = this.props.tableData.slice(0, Math.min(MAX_ROWS_DISPLAYED, this.props.tableData.length));
        
        return (
            <Card className="main-card mb-3">
                    <div className="card-header">{this.props.label}
                    </div>
                    <div className="table-responsive">
                        <table className="align-middle mb-0 table table-borderless table-striped table-hover">
                            <thead>
                            <tr>{headers.map((key) => (<th key={key} className="text-center">{key}</th>))}</tr>
                            </thead>
                            <tbody>
                                {data.map(datum =>(<tr>{headers.map(key => (<td key={key} className="text-center">{JSON.stringify(datum[key])}</td>))}</tr>))}
                            </tbody>
                        </table>
                    </div>
            </Card>
        )
    }
}

function replacer(key, value) {
    // Filtering out properties
    
    if (Array.isArray(value))
    {
        return "[ ... ]";
    }

    if (typeof value === "object")
    {
        return "{...}";
    }

    if (typeof value === "string")
    {
        if (value.length > 10)
            return value.slice(0, 10) + "...";
        else return value;
    }
    return value;
}