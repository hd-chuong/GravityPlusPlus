import * as ActionTypes from './DataGraphActionTypes';
import Axios from 'axios';
// import {nanoid} from '../utils/nanoid';
import {toast} from 'react-toastify';
import toastOptions from '../DemoPages/config/toastOptions';
import {nanoid} from 'nanoid';
// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);

export const saveDataNode = payload => ({
  type: ActionTypes.ADD_DATA_NODE,
  payload,
});

// source: the tabular data itself
// why id is not created at frontend: 
// -> let backend create id as a centralized source of control
export const addDataNode = ({
  name,
  type,
  source,
  transform,
  format,
}) => dispatch => {
  const newNode = { name, type, source, transform, format};
  return Axios({
    method: 'post',
    url: 'http://139.59.103.42:7473/data/nodes',
    data: newNode,
    withCredentials: true
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
      var name = data.props.name;

      // Check if the data is raw
      var type = data.types.filter(item => item !== 'DATA_NODE');
      if (type.indexOf('RAW') !== -1) {
        type = 'RAW';
      }
      dispatch(saveDataNode({ id, name, type, source, transform, format }));
      toast.success("Successfully create a data node", toastOptions);
      return id;
    })
    .catch(error => {
      toast.error('Redux failed to add new node: ' + error.message, toastOptions);
    });
};

export const saveDataEdge = ({ id, source, target, type, data }) => ({
  type: ActionTypes.ADD_DATA_EDGE,
  payload: {
    source,
    target,
    type,
    data,
    id,
  },
});

export const addDataEdge = ({source, target, type, data}) => (dispatch) => {
  
    if (type === "TRANSFORM" && data.type === "filter"  && data.threshold === null)
    {
      data.useParams = true;
      data.threshold = nanoid();
    }
    
    const newEdge = {
        source, 
        target, 
        type, 
        operation: data
    };

    return Axios({
        method: "post",
        url: "http://139.59.103.42:7473/data/edges",
        data: newEdge,
        withCredentials: true
    }).then(response => {
        if (response.statusText !== "OK") {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }   
        else {
            return response.data;
        }
    })
    .then(responseData => {
      dispatch(
        saveDataEdge({
          source,
          target,
          type,
          data,
          id: responseData.id,
        }),
      );
    })
    .catch(error => {
      alert('Failed to add new edge: ' + error.message);
    });
};

export const removeDataNode = ({ id }) => dispatch => {
  return Axios({
    method: 'delete',
    url: `http://139.59.103.42:7473/data/nodes/${id}`,
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
    .then(() => {
      dispatch({
        type: ActionTypes.REMOVE_DATA_NODE,
        payload: { id },
      }) 
      toast.success("Successfully delete data node.", toastOptions);
    })
    .catch(error => {
      alert('Failed to delete a node: ' + error.message);
    });
};

export const setDataNode = ({ id, params }) => ({
  type: ActionTypes.SET_DATA_NODE,
  payload: { id, params },
});

export const removeDataEdges = ({ id, direction }) => ({
  type: ActionTypes.REMOVE_DATA_EDGES,
  payload: {
    id,
    direction,
  },
});

export const setDataPosition = payload => dispatch => {
  const {x, y, id} = payload;
  return Axios({
    method: 'put',
    url: `http://139.59.103.42:7473/data/nodes/${id}`,
    data: {x, y},
    withCredentials: true,
  }).then((response) => {
    dispatch({  
      type: ActionTypes.SET_POSITION,
      payload});
      // toast.success("Successfully set position node", toastOptions);

  })    
  .catch(error => {
    alert('Failed to update new position to database: ' + error.message);
  });
};