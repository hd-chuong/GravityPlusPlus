import * as ActionTypes from './DataGraphActionTypes';

export const DataGraph = (state = {errMess: null,
                                datagraph: {nodes: [], edges: []}}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATA_NODE:
            var x = Math.random() * 100;
            var y = Math.random() * 100;

            var nodeType = action.payload.type;
            var uiType;
            if (nodeType === "raw") 
            {
                uiType = "input";
            }
            else 
            {
                uiType = "default";
            }

            var newDataNode = {
                id: action.payload.id,
                type: uiType,
                data: {label: action.payload.name, type: nodeType},
                position: {x, y}
            };
            return {...state, datagraph: {edges: state.datagraph.edges, nodes: [...state.datagraph.nodes, newDataNode]}};

        case ActionTypes.ADD_DATA_EDGE:

            
            var newDataEdge = {
                id: action.payload.id,
                source: action.payload.source,
                target: action.payload.target,
                arrowHeadType: 'arrowclosed',
            }
            return {...state, datagraph: {edges: [...state.datagraph.edges, newDataEdge], nodes: state.datagraph.nodes}};

        default:
            return state;
        }
};