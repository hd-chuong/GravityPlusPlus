import * as ActionTypes from './VisGraphActionTypes';
import { v4 as uuidv4 } from 'uuid';

export const VisGraph = (state = {errMess: null, visgraph: {nodes: [], edges: []}}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_VIS_NODE:
            var x = Math.random() * 100;
            var y = Math.random() * 100;

            var uiType = "default";

            var newVisNode = {
                id: uuidv4(),
                type: uiType,
                data: {
                    label: action.payload.name, 
                    spec: action.payload.spec,
                    dataSource: action.payload.dataSource
                },
                position: {x, y},
            };
            return {...state, visgraph: {edges: state.visgraph.edges, nodes: [...state.visgraph.nodes, newVisNode]}};
        
        case ActionTypes.ADD_VIS_EDGE:
            var edgeType = action.payload.type;
            var arrowHeadType = 'arrowclosed';
            var animated = false;
            var type = null;
            var style = null;
            
            if (edgeType === "RECOMMENDED")
            {
                style = {stroke: "green", strokeDasharray: "2,2"}
                animated = true;
            }
            else if (edgeType === "DATA_TRANSFORMED")
            {
                style = {stroke: "blue"};
                type = "step";
            }
            else if (edgeType === "SAME_FIELDS")
            {
                style = {stroke: "#00BFFF"}
                arrowHeadType = null;
                type = "step";
            }
            else if (edgeType === "DIFFERENT_FIELDS")
            {
                style = {stroke: "purple"}
                arrowHeadType = null;
                type = "step";
            }

            var newVisEdge = {
                id: uuidv4(),
                source: action.payload.source,
                target: action.payload.target,
                data: {type: edgeType},
                arrowHeadType,
                style,
                animated,
                type,   
            };
            
            return {
                ...state, 
                visgraph: {
                    edges: [...state.visgraph.edges, newVisEdge], 
                    nodes: state.visgraph.nodes
                }
            };
        
        case ActionTypes.REMOVE_VIS_NODE:
            var nodeId = action.payload.id;
            return {
                ...state, 
                visgraph: {
                    edges: state.visgraph.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
                    nodes: state.visgraph.nodes.filter((node) => node.id !== nodeId)
                }
            };
        
        case ActionTypes.REMOVE_ALL_VIS_EDGES_BY_TYPE:
            
            var edgeType = action.payload.type;
            
            return {
                ...state,
                visgraph: {
                    nodes: state.visgraph.nodes,
                    edges: state.visgraph.edges.filter(edge => edge.data.type !== edgeType)
                }
            }
        
        case ActionTypes.REMOVE_EDGE_BY_TYPE:            
            var edgeType = action.payload.type;
            var source = action.payload.source;
            var target = action.payload.target;

            return {
                ...state,
                visgraph: {
                    nodes: state.visgraph.nodes,
                    edges: state.visgraph.edges.filter(edge => !(edge.target === target 
                                                                && edge.source === source 
                                                                && edge.data.type === edgeType))
                }
            };
        
        case ActionTypes.REMOVE_VIS_EDGE:
            var edgeID = action.payload.id;
            return {
                ...state,
                visgraph: {
                    nodes: state.visgraph.nodes,
                    edges: state.visgraph.edges.filter(edge => edge.id !== edgeID)
                }
            }

        case ActionTypes.SET_VIS_NODE:
            var nodeId = action.payload.id;
            var params = action.payload.params;
            
            var newNodes = state.visgraph.nodes.map(node => {
                if (node.id !== nodeId) return node;
                return {...node, data: {...node.data, ...params}};
            });
            
            return {
                ...state, 
                visgraph: {
                    edges: state.visgraph.edges,
                    nodes: newNodes,
                }
            }
    
        default:
            return state;
    }
};