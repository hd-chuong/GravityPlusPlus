import * as ActionTypes from './DataGraphActionTypes';

export const DataGraph = (state = {errMess: null,
                                datagraph: {nodes: [], edges: []}}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_RAW_DATA_NODE:
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var newDataNode = {
                id: action.payload.id,
                type: 'input',
                data: {label: action.payload.name},
                position: {x, y}
            };
            console.log(newDataNode);
            return {...state, datagraph: {edges: state.datagraph.edges, nodes: [...state.datagraph.nodes, newDataNode]}};

        default:
          return state;
      }
};