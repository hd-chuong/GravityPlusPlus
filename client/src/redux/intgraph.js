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
              // visualisation source
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
        const {id, source, target, binding, signal} = action.payload;

        var newIntEdge = {
          id,
          source,
          target,
          data: {
            binding,
            signal,
          },
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
      default:
        return state;  
    }
  };