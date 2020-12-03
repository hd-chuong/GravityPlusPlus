import * as ActionTypes from './DataGraphActionTypes';
import Axios from 'axios';

export const saveDataNode = ({id, name, type}) => ({
    type: ActionTypes.ADD_DATA_NODE,
    payload: {
        name,
        type,
        id
    }
});

export const addDataNode = ({name, type}) => (dispatch) => {
    const newNode = {name, type};

    return Axios({
        method: "post",
        url: "http://localhost:7473/data/nodes",
        data: newNode
    }).then(response => {
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

        console.log("inside thunk: ", id, name);
        // Check if the data is raw
        var type = data.types.filter((item) => item !== "DATA_NODE");
        if (type.indexOf("RAW") !== -1)
        {
            type = "RAW";
        }
        dispatch(saveDataNode({id, name, type}));
        
        console.log("within thunk ", id);
        return id;
    })
    .catch(error => {
        alert("Fail to add new node: " + error.message);    
    });;
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
    console.log("newEdge", newEdge);
    return Axios({
        method: "post",
        url: "http://localhost:7473/data/edges",
        data: newEdge
    }).then(response => {
        console.log(response);
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