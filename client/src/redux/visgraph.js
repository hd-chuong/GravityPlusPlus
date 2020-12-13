import * as ActionTypes from './VisGraphActionTypes';
import { v4 as uuidv4 } from 'uuid';

export const VisGraph = (state = {errMess: null, visgraph: {nodes: [], edges: []}}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_VIS_NODE:
            var x = Math.random() * 100;
            var y = Math.random() * 100;

            var uiType = "input";

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
        
        default:
            return state;
    }
}