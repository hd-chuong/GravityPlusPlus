import React, { Component } from 'react';
import ReactFlow, {Controls, Background} from 'react-flow-renderer';
import {Card} from 'reactstrap';
// const elements = [
//   {
//     id: '1',
//     type: 'input', // input node
//     data: { label: 'Input Node' },
//     position: { x: 250, y: 25 },
//   },
//   // default node
//   {
//     id: '2',
//     // you can also pass a React component as a label
//     data: { label: <div>Default Node</div> },
//     position: { x: 100, y: 125 },
//   },
//   {
//     id: '3',
//     type: 'output', // output node
//     data: { label: 'Output Node' },
//     position: { x: 250, y: 250 },
//   },

//   {
//     id: '4',
//     type: 'default', // output node
//     data: { label: 'Do not know' },
//     position: { x: 300, y: 200 },
//   },

//   // animated edge
//   { id: 'e1-2', source: '1', target: '2', animated: true, arrowHeadType: 'arrowclosed' },
//   { id: 'e2-3', source: '2', target: '3' },
// ];

export default class DataGraph extends Component {
    constructor(props)
    {
        super(props);
    }

    render() 
    {
        const elements = [...this.props.datagraph.datagraph.nodes, ...this.props.datagraph.datagraph.edges];
        return (
            <Card className="main-card mb-3">
                <div className="card-header"> Data graph
                </div>
                <div style={{ height: 400 }}> 
                    <ReactFlow elements={elements} onElementClick={(event, element) => {console.log(element)}}>
                        <Controls />  
                        <Background color="#aaa" gap={16} /> 
                    </ReactFlow>
                </div>
            </Card>
        );
    }
}