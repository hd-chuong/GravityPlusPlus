import * as ActionTypes from './AppActionTypes';

export const loadState = ({state}) => ({
    type: ActionTypes.LOAD_STATE,
    payload: {state},
});