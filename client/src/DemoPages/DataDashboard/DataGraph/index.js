import React, {useCallback, useState } from 'react';
import {Fragment} from 'react';
import { useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  removeElements,
} from 'react-flow-renderer';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {showMenu} from 'react-contextmenu/modules/actions';
import { node } from 'prop-types';
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

const Graph = (props) =>  {

  const [reactflowInstance, setReactflowInstance] = useState(null);

  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );

    // const renderNodes = props.data.nodes.map(node => ({...node, data: {...node.data, label: <ContextMenuTrigger id="okay">{node.data.label}</ContextMenuTrigger>}}))
    const elements = [...props.data.nodes, ...props.data.edges];
    
    useEffect(() => {
      if (reactflowInstance && elements.length > 0) {
        reactflowInstance.fitView();
      }
    }, [reactflowInstance, elements.length]);
    
    if (props.data === null || props.data === undefined)
    {
      return (
        <Card className="main-card mb-3">
          <CardHeader>Graph view</CardHeader>

          <CardBody>Create a node to view the graph</CardBody>
        </Card>
      );
    }
    return (
      <Fragment>
      {/* <ContextMenu id="okay" preventHideOnContextMenu>
        <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
          Item 1
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
          Item 2
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
          ContextMenu Item 3
        </MenuItem>
      </ContextMenu> */}
      <Card className="main-card mb-3">
        <CardBody>
        <CardTitle> Graph view </CardTitle>
        <div style={{ height: props.height || 600 }}>
          <ReactFlow
            onLoad={onLoad}
            elements={elements}
            
            onElementClick={(event, element) => {
              props.onElementClick(element.id);
            }}
            
            onElementsRemove={elements =>
              elements
                .map(element => element.id)
                .forEach(e => props.onElementsRemove(e))
            }
            
            // onNodeContextMenu={(e,els) => {
            //   e.preventDefault();
            //   console.log(e.clientX, e.clientY,els);
            //   showMenu({position: {x: 100, y: 100}, target: null, id: "okay"})
            // }}
            // defaultPosition={props.defaultPosition}
          >
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
        </CardBody>
      </Card>
      </Fragment>
    );
  }

function handleClick(e, data) {
  console.log(data.foo);
}

export default Graph;
// const onLoad = (reactFlowInstance) => {
//   console.log("on load");
//   reactFlowInstance.fitView();
// };