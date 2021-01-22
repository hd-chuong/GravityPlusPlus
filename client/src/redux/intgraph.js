import * as ActionTypes from './IntGraphActionTypes';
import { v4 as uuidv4 } from 'uuid';

export const IntGraph = (
    state = { errMess: null, intgraph: { nodes: [], edges: [] } },
    action,
  ) => {
    switch (action.type) {
      case ActionTypes.ADD_INT_NODE:
        var x = Math.random() * 100;
        var y = Math.random() * 100;

        let uiType = "default";

        var newIntNode = {
            id: action.payload.id,
            type: uiType,
            data: {
              label: action.payload.name,
              // intualisation source
              source: action.payload.source,
            },
            position: { x, y },
          };
         
        return {
            ...state,
            intgraph: {
                edges: state.intgraph.edges,
                nodes: [...state.intgraph.nodes, newIntNode]
            }
        }

      case ActionTypes.ADD_INT_EDGE:
        const {id, source, target, binding, signal, label} = action.payload;

        var newIntEdge = {
          id,
          source,
          target,
          data: {
            binding,
            signal,
          },
          label,
          arrowHeadType: 'arrowclosed',
          style: { stroke: 'green', strokeDasharray: '2,2' },
          animated: false,
        }

        return {
          ...state,
          intgraph: {
            edges: [...state.intgraph.edges, newIntEdge],
            nodes: state.intgraph.nodes,
          }
        }

      case ActionTypes.REMOVE_INT_NODE:
        var nodeId = action.payload.id;
        
        return {
          ...state,
          intgraph: {
            edges: state.intgraph.edges.filter(
              edge => edge.source !== nodeId && edge.target !== nodeId,
            ),
            nodes: state.intgraph.nodes.filter(node => node.id !== nodeId),
          },
        };

      case ActionTypes.REMOVE_INT_EDGE:
        var edgeId = action.payload.id;
        
        return {
          ...state,
          intgraph: {
            edges: state.intgraph.edges.filter(
              edge => edge.id !== edgeId,
            ),
            nodes: state.intgraph.nodes,
          },  
        };

      case ActionTypes.SET_INT_NODE:
        var {id: nodeId, params} = action.payload;
  
        var newNodes = state.intgraph.nodes.map(node => {
          if (node.id !== nodeId) return node;
          return { ...node, data: { ...node.data, ...params } };
        });
  
        return {
          ...state,
          intgraph: {
            edges: state.intgraph.edges,
            nodes: newNodes,
          },
        };

      case ActionTypes.SET_POSITION:
        const {id: nodeId, x, y} = action.payload;
        
        const newNodes = state.intgraph.nodes.map(node => {
          if (node.id !== nodeId) return node;
          return {...node, position: {x, y} };
        });

        return {
          ...state,
          intgraph: {
            edges: state.intgraph.edges,
            nodes: newNodes
          }
        };

      default:
        return state;  
    }
  };