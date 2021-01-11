import * as ActionTypes from './VisGraphActionTypes';
import { v4 as uuidv4 } from 'uuid';

export const saveVisNode = payload => ({
  type: ActionTypes.ADD_VIS_NODE,
  payload,
});

export const addVisNode = ({ name, dataSource, spec }) => dispatch => {
  const newNode = { name, dataSource, spec, id: uuidv4() };
  dispatch(saveVisNode(newNode));
};

export const addVisEdge = payload => ({
  type: ActionTypes.ADD_VIS_EDGE,
  payload,
});

export const removeVisEdgeByType = payload => ({
  type: ActionTypes.REMOVE_EDGE_BY_TYPE,
  payload,
});

export const removeAllVisEdgesByTpe = payload => ({
  type: ActionTypes.REMOVE_ALL_VIS_EDGES_BY_TYPE,
  payload,
});

export const removeVisNode = payload => ({
  type: ActionTypes.REMOVE_VIS_NODE,
  payload,
});

export const removeVisEdge = payload => ({
  type: ActionTypes.REMOVE_VIS_EDGE,
  payload,
});

export const setVisNode = payload => ({
  type: ActionTypes.SET_VIS_NODE,
  payload,
});

export const setVisPosition = payload => ({
  type: ActionTypes.SET_POSITION,
  payload,
});
