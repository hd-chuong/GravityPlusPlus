import * as ActionTypes from './IntGraphActionTypes';
import axios from 'axios';

export const saveIntNode = ({name, source}) => dispatch => {
    return axios({
      method: 'post',
      url: `http://localhost:7473/int/nodes`,
      data: {source, name},
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
        dispatch({
            type: ActionTypes.ADD_INT_NODE,
            payload: {name, source, id},
        });
    })
    .catch(error => {
        alert('Redux failed to add new node: ' + error.message);
    });    
};

export const saveIntEdge = payload => ({
    type: ActionTypes.ADD_INT_EDGE,
    payload,
});

export const addIntEdge = ({source, target, signal, binding, label}) => dispatch => {
    return axios({
        method: 'post',
        url: `http://localhost:7473/int/edges`,
        data: {source, target, signal, binding, label},
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
        const id = data.id;
        const newEdge = {id, source, target, signal, binding, label};
        dispatch(saveIntEdge(newEdge));
    })
    .catch(error => {
        alert(`Failed to add new edge: ${error.message}`);
    });
}

export const removeIntNode = ({id}) => dispatch => {
    return axios({
        method: 'delete',
        url: `http://localhost:7473/int/nodes/${id}`,
        data: {id},
        withCredentials: true,
    }).then(response => {
        if (response.statusText !== 'OK') {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText,
          );
          error.response = response;
          throw error;
        } else {
          return response.data;
        }
    }).then((data) => dispatch({
        type: ActionTypes.REMOVE_INT_NODE,
        payload: {id}
    }))
    .catch(error => {
        alert(`Failed to delete node ${id} in database: ${error.message}`);
      });
};

export const removeIntEdge = ({id}) => dispatch =>
{
    return axios({
        method: 'delete',
        url: `http://localhost:7473/int/edges/${id}`,
        data: {id},
        withCredentials: true,
    }).then(response => {
        if (response.statusText !== 'OK') {
          var error = new Error(
            'Error ' + response.status + ': ' + response.statusText,
          );
          error.response = response;
          throw error;
        } else {
          return response.data;
        }
    }).then((data) => dispatch({
        type: ActionTypes.REMOVE_INT_EDGE,
        payload: {id},
    }));
}

export const setIntPosition = payload => dispatch => {
    const {x, y, id} = payload;
    return axios({
      method: 'put',
      url: `http://localhost:7473/int/nodes/${id}`,
      data: {x, y},
      withCredentials: true,
    })
    .then((response) => {
      dispatch({  
        type: ActionTypes.SET_POSITION,
        payload});
    })    
    .catch(error => {
      alert(`Failed to update new position of int node ${id} to database: ${error.message}`);
    });
  };

  export const setIntNode = payload => dispatch => {
    const {id, params} = payload;
    return axios({
      method: 'put',
      url: `http://localhost:7473/int/nodes/${id}`,
      data: params,
      withCredentials: true,
    })
    .then((response) => {
      dispatch({  
        type: ActionTypes.SET_INT_NODE,
        payload});
    })    
    .catch(error => {
      alert(`Failed to update new position of int node ${id} to database: ${error.message}`);
    });
  };