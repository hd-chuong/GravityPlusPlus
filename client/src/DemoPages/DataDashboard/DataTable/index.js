import React, { Component, Fragment } from 'react';
import { Row, Col, Button, CardHeader, Card, CardBody, CardTitle, Alert } from 'reactstrap';
import AttributeExtractor from '../../../utils/AttributeExtractor';
import MUIDataTable from 'mui-datatables';

const MAX_ROWS_DISPLAYED = 20000;

export default class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      activeTab1: '11',
    };
  }

  render() {
    if (this.props.tableData === null || this.props.tableData === undefined)
      return (
        <Card className="main-card mb-3">
          <CardBody>
          <CardTitle>Table View</CardTitle>
            Please select a data node to view the dataset
            </CardBody>
        </Card>
      );
    let headers = AttributeExtractor(this.props.tableData[0]);
    
    headers = headers.map(h => ({name: h, label: h, options: {filter: true, sort: true}}));

    const data = this.props.tableData.slice(0, MAX_ROWS_DISPLAYED);

    return (
      <div style={{maxWidth: 1500}}> 
        <MUIDataTable 
          title={this.props.label} 
          data={data}  
          columns={headers}
          options={options}
        />
        {this.props.tableData.length > MAX_ROWS_DISPLAYED && <Alert color="warning">
          For the best performance, only the first {MAX_ROWS_DISPLAYED} out of {this.props.tableData.length} rows are displayed in the table.
        </Alert> }
      </div>
    );
  }
}

// function replacer(key, value) {
//   // Filtering out properties

//   if (Array.isArray(value)) {
//     return '[ ... ]';
//   }

//   if (typeof value === 'object') {
//     return '{...}';
//   }

//   if (typeof value === 'string') {
//     if (value.length > 10) return value.slice(0, 10) + '...';
//     else return value;
//   }
//   return value;
// }

const options = {
  selectableRows: false,
  filterType: 'multiselect',
  toolbar: {
    search: "Search",
    viewColumns: "View Columns..."
  }
}

const tableStyle= {
  width: "100%"
}