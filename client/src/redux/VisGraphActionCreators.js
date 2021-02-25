import * as ActionTypes from './VisGraphActionTypes';
import Axios from 'axios';
import {toast} from 'react-toastify';
import toastOptions from '../DemoPages/config/toastOptions';
export const saveVisNode = payload => ({
  type: ActionTypes.ADD_VIS_NODE,
  payload,
});

export const addVisNode = ({ name, dataSource, spec }) => dispatch => {
  const newNode = { name, dataSource, spec};
  return Axios({
    method: 'post',
    url: 'http://139.59.103.42:7473/vis/nodes',
    data: newNode,
    withCredentials: true,
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
    alert('Redux failed to add new node: ' + error.message);
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
    url: `http://139.59.103.42:7473/vis/nodes/${payload.id}`,
    data: payload,
    withCredentials: true,
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
    toast.success("Successfully delete visualisation node", toastOptions);
  })
  .catch(error => {
    toast.error(`Failed to delete node ${payload.id} in database: ${error.message}`, toastOptions);
  });
};

export const removeVisEdge = payload => ({
  type: ActionTypes.REMOVE_VIS_EDGE,
  payload,
});

export const setVisNode = payload => dispatch => {
  const {id, params} = payload;
  return Axios({
    method: 'put',
    url: `http://139.59.103.42:7473/vis/nodes/${id}`,
    data: params,
    withCredentials: true,
  })
  .then((response) => {
    dispatch({
      type: ActionTypes.SET_VIS_NODE,
      payload,
    });
    toast.success("Successfully updated the visualisation node", toastOptions);
  })    
  .catch(error => {
    toast.error(`Failed to update vis node ${id} to database: ${error.message}`, toastOptions);
  });
};

export const setVisPosition = payload => dispatch => {
  const {x, y, id} = payload;
  return Axios({
    method: 'put',
    url: `http://139.59.103.42:7473/vis/nodes/${id}`,
    data: {x, y},
    withCredentials: true,
  })
  .then((response) => {
    dispatch({  
      type: ActionTypes.SET_POSITION,
      payload});
  })    
  .catch(error => {
    alert(`Failed to update new position of vis node ${id} to database: ${error.message}`);
  });
};