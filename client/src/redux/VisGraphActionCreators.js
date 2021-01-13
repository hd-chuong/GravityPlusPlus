import * as ActionTypes from './VisGraphActionTypes';
import Axios from 'axios';

export const saveVisNode = payload => ({
  type: ActionTypes.ADD_VIS_NODE,
  payload,
});

export const addVisNode = ({ name, dataSource, spec }) => dispatch => {
  const newNode = { name, dataSource, spec};
  return Axios({
    method: 'post',
    url: 'http://localhost:7473/vis/nodes',
    data: newNode,
  })
  .then(response => {
    if (response.statusText !== 'OK') {
      var error = new Error(
        'Error ' + response.status + ': ' + response.statusText,
      );
      error.response = response;
      throw error;
    } else {
      return response.data;
    }
  })
  .then(data => {
    var id = data.id;
    dispatch(saveVisNode({ id, name, dataSource, spec}));
    return id;
  })
  .catch(error => {
    alert('Redux fails to add new node: ' + error.message);
  });
};

export const addVisEdge = payload => ({
  type: ActionTypes.ADD_VIS_EDGE,
  payload,
});

export const removeVisEdgeByType = payload => ({
  type: ActionTypes.REMOVE_EDGE_BY_TYPE,
  payload,
});

export const removeAllVisEdgesByType = payload => ({
  type: ActionTypes.REMOVE_ALL_VIS_EDGES_BY_TYPE,
  payload,
});

export const removeVisNode = payload => dispatch => {
  return Axios({
    method: 'delete',
    url: `http://localhost:7473/vis/nodes/${payload.id}`,
    data: payload
  })
  .then(response => {
    if (response.statusText !== 'OK') {
      var error = new Error(
        'Error ' + response.status + ': ' + response.statusText,
      );
      error.response = response;
      throw error;
    } else {
      return response.data;
    }
  })
  .then((data) => {
    dispatch({
      type: ActionTypes.REMOVE_VIS_NODE,
      payload
    });
  })
  .catch(error => {
    alert(`Fail to delete node ${id} in database: ${error.message}`);
  });
};

export const removeVisEdge = payload => ({
  type: ActionTypes.REMOVE_VIS_EDGE,
  payload,
});

export const setVisNode = payload => ({
  type: ActionTypes.SET_VIS_NODE,
  payload,
});

export const setVisPosition = payload => dispatch => {
  const {x, y, id} = payload;
  return Axios({
    method: 'put',
    url: `http://localhost:7473/vis/nodes/${id}`,
    data: {x, y}
  })
  .then((response) => {
    dispatch({  
      type: ActionTypes.SET_POSITION,
      payload});
  })    
  .catch(error => {
    alert(`Fail to update new position of vis node ${id} to database: ${error.message}`);
  });
};