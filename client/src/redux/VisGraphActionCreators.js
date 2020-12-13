import * as ActionTypes from './VisGraphActionTypes';

export const saveVisNode = (payload) => ({
    type: ActionTypes.ADD_VIS_NODE,
    payload
});

export const addVisNode = ({name, dataSource, spec}) => (dispatch) => {
    const newNode = {name, dataSource, spec};
    dispatch(saveVisNode(newNode));
}