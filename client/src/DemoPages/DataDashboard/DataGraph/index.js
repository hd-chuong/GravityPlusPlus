import React, { Component } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  removeElements,
} from 'react-flow-renderer';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

// examples of data to be passed into react flow
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

export default class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data === null || this.props.data === undefined)
      return (
        <Card className="main-card mb-3">
          <CardHeader>Graph view</CardHeader>

          <CardBody>Create a node to view the graph</CardBody>
        </Card>
      );
    const elements = [...this.props.data.nodes, ...this.props.data.edges];
    return (
      <Card className="main-card mb-3">
        <CardBody>
        <CardTitle> Graph view </CardTitle>
        <div style={{ height: this.props.height || 600 }}>
          <ReactFlow
            // onLoad={onLoad}
            elements={elements}
            onElementClick={(event, element) => {
              this.props.onElementClick(element.id);
            }}
            onElementsRemove={elements =>
              elements
                .map(element => element.id)
                .forEach(e => this.props.onElementsRemove(e))
            }
            onNodeDragStop={(event, node) => {
              if (!this.props.onNodeDragStop) return;
              this.props.onNodeDragStop(node.id, node.position.x, node.position.y);
            }}
            onSelectionContextMenu={
              (event, node) => {console.log(" right click at node: ", node)}
            }
            // defaultPosition={this.props.defaultPosition}
          >
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
        </CardBody>
      </Card>
    );
  }
}

// const onLoad = (reactFlowInstance) => {
//   console.log("on load");
//   reactFlowInstance.fitView();
// };