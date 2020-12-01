import * as ActionTypes from './DataGraphActionTypes';

export const addRawDataNode = ({name}) => ({
    type: ActionTypes.ADD_RAW_DATA_NODE,
    payload: {
        name,
        id: name,
    }
});