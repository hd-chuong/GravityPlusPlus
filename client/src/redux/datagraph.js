import * as ActionTypes from './DataGraphActionTypes';

export const DataGraph = (state = {errMess: null,
                                datagraph: {nodes: [], edges: []}}, action) => {

    switch (action.type) {
        case ActionTypes.ADD_DATA_NODE:
            var x = Math.random() * 100;
            var y = Math.random() * 100;

            var nodeType = action.payload.type;
            var uiType;
            
            if (nodeType === "RAW") 
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

            var edgeType = action.payload.type;
            var style = null;
            
            if (edgeType === "join")
            {
                style = {stroke: "red", strokeDasharray: "2,2"}
            }
            else if (edgeType === "transform")
            {
                style = {stroke: "blue"}
            }

            var newDataEdge = {
                id: action.payload.id,
                source: action.payload.source,
                target: action.payload.target,
                arrowHeadType: 'arrowclosed',
                data: action.payload.data,
                style
            }
            return {...state, datagraph: {edges: [...state.datagraph.edges, newDataEdge], nodes: state.datagraph.nodes}};

        default:
            return state;
        }
};