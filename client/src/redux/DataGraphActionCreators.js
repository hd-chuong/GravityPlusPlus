import * as ActionTypes from './DataGraphActionTypes';
import Axios from 'axios';
export const saveDataNode = ({name, type}) => ({
    type: ActionTypes.ADD_DATA_NODE,
    payload: {
        name,
        type,
        id: name,
    }
});


export const addDataEdge = ({source, target, type, data}) => ({
    type: ActionTypes.ADD_DATA_EDGE,
    payload: {
        id: `${source}->${target}`,
        source,
        target,
        type,
        data
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
        var name = data.props.name;

        // Check if the data is raw
        var type = data.types.filter((item) => item !== "DATA_NODE");
        if (type.indexOf("RAW") !== -1)
        {
            type = "RAW";
        }
        dispatch(saveDataNode({name, type}));
    })
    .catch(error => {
        alert("Fail to add new node: " + error.message);    
    });;
}