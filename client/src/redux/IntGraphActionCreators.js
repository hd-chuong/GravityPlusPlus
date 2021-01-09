import * as ActionTypes from './IntGraphActionTypes';
import { v4 as uuidv4} from 'uuid';

export const saveIntNode = payload => ({
    type: ActionTypes.ADD_INT_NODE,
    payload: {...payload, id: uuidv4()},
});

export const saveIntEdge = payload => ({
    type: ActionTypes.ADD_INT_EDGE,
    payload,
});

export const addIntEdge = ({source, target, signal, binding, id}) => dispatch => {
    if (!id) 
    {
        id = uuidv4();
    }
    const newNode = {source, target, signal, binding, id};
    dispatch(saveIntEdge(newNode));
};