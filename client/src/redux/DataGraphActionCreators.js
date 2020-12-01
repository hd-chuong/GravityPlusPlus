import * as ActionTypes from './DataGraphActionTypes';

export const addDataNode = ({name, type}) => ({
    type: ActionTypes.ADD_DATA_NODE,
    payload: {
        name,
        type,
        id: name,
    }
});


export const addDataEdge = ({source, target, type, data}) => ({
    type: ActionTypes.ADD_DATA_EDGE,
    payload: {
        id: `${source}->${target}`,
        source,
        target,
        type,
        data
    }
});
