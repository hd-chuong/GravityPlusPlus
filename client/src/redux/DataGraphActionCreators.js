import * as ActionTypes from './DataGraphActionTypes';
import Axios from 'axios';

export const saveDataNode = ({id, name, type, source}) => ({
    type: ActionTypes.ADD_DATA_NODE,
    payload: {
        name,
        type,
        id, 
        source
    }
});

// source: the tabular data itself
export const addDataNode = ({name, type, source}) => (dispatch) => {
    const newNode = {name, type, source};

    return Axios({
        method: "post",
        url: "http://localhost:7473/data/nodes",
        data: newNode
    })
    .then(response => {
        if (response.statusText !== "OK")
        {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        } 
        else {
            return response.data;
        }
    })
    .then(data => {
        var id = data.id;
        
        var name = data.props.name;

        // Check if the data is raw
        var type = data.types.filter((item) => item !== "DATA_NODE");
        if (type.indexOf("RAW") !== -1)
        {
            type = "RAW";
        }
        dispatch(saveDataNode({id, name, type, source}));
        
        return id;
    })
    .catch(error => {
        alert("Fail to add new node: " + error.message);    
    });
}

export const saveDataEdge = ({id, source, target, type, data}) => ({
    type: ActionTypes.ADD_DATA_EDGE,
    payload: {
        source,
        target,
        type,
        data,
        id
    }
});

export const addDataEdge = ({source, target, type, data}) => (dispatch) => {
    const newEdge = {source, target, type, operation: data};
    return Axios({
        method: "post",
        url: "http://localhost:7473/data/edges",
        data: newEdge
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
    .then(responseData => 
    {
        dispatch(saveDataEdge({
            source: source, 
            target: target, 
            type: type, 
            data: data,
            id: responseData.id}));
    })
    .catch(error => 
    {
        alert("Fail to add new edge: " + error.message);    
    });
}

export const removeDataNode = ({id}) => (dispatch) => {
    return Axios({
        method: "delete",
        url: `http://localhost:7473/data/nodes/${id}`,
    }).then(response => {
        if (response.statusText !== "OK")
        {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }   
        else 
        {
            return response.data;
        }
    }).then(() => dispatch({
            type: ActionTypes.REMOVE_DATA_NODE,
            payload: {id}
        })
    ).catch(error => {
        alert("Fail to delete a node: " + error.message);    
    });
};

export const setDataNode = ({id, params}) => ({
    type: ActionTypes.SET_DATA_NODE,
    payload: {id, params}
});

export const removeEdges = ({id, direction}) => ({
    type: ActionTypes.REMOVE_EDGES,
    payload: {
        id, 
        direction
    }
});