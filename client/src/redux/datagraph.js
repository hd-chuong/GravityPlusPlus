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
                data: {
                    label: action.payload.name, 
                    type: nodeType, 
                    source: action.payload.source, 
                    
                    // transform only applies for joining dataset together
                    transform: action.payload.transform
                },
                position: {x, y},
            };
            return {...state, datagraph: {edges: state.datagraph.edges, nodes: [...state.datagraph.nodes, newDataNode]}};

        case ActionTypes.ADD_DATA_EDGE:

            var edgeType = action.payload.type;
            var style = null;
            
            if (edgeType === "JOIN")
            {
                style = {stroke: "red", strokeDasharray: "2,2"}
            }
            else if (edgeType === "TRANSFORM")
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
            };
            
            return {
                ...state, 
                datagraph: {
                    edges: [...state.datagraph.edges, newDataEdge], 
                    nodes: state.datagraph.nodes
                }
            };
        
        case ActionTypes.REMOVE_DATA_NODE:
            var nodeId = action.payload.id;
            return {
                ...state, 
                datagraph: {
                    edges: state.datagraph.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
                    nodes: state.datagraph.nodes.filter((node) => node.id !== nodeId)
                }
            };
        
        case ActionTypes.SET_DATA_NODE:
            var nodeId = action.payload.id;
            var params = action.payload.params;
            
            var uiType;

            if (params.type === "RAW")
            {
                uiType = "input";
            }
            else 
            {
                uiType = "default";
            }
            
            var newNodes = state.datagraph.nodes.map(node => {
                if (node.id !== nodeId) return node;
                return {...node, type: uiType, data: {...node.data, ...params}};
            })

            return {
                ...state, 
                datagraph: {
                    edges: state.datagraph.edges,
                    nodes: newNodes,
                }
            }
        
        case ActionTypes.REMOVE_EDGES:
            var nodeId = action.payload.id;
            var direction = action.payload.direction;

            if (direction === "INCOMING")
            {
                return {
                    ...state, 
                    datagraph: {
                        edges: state.datagraph.edges.filter((edge) => edge.target !== nodeId),
                        nodes: state.datagraph.nodes
                    }
                }
            }
            else if (direction === "OUTGOING")
            {
                return {
                    ...state, 
                    datagraph: {
                        edges: state.datagraph.edges.filter((edge) => edge.source !== nodeId),
                        nodes: state.datagraph.nodes
                    }
                }
            }
            else if (direction === "ALL")
            {
                return {
                    ...state, 
                    datagraph: {
                        edges: state.datagraph.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
                        nodes: state.datagraph.nodes
                    }
                }
            }
            else {
                return state;
            }
        default:
            return state;
        }
};