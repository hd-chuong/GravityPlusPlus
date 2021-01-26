import axios from 'axios';
import * as ActionTypes from './DatasetActionTypes';
export const addDataset = ({ name, dataset }) => dispatch => {
  return axios({
    url: 'http://localhost:7473/dataset',
    withCredentials: true,
    method: 'post',
    data: [{name, dataset}]
  }).then(() => {
    dispatch({
      type: ActionTypes.ADD_DATASET,
      payload: {
        name,
        dataset,
      }
  })});
};

export const removeDataset = ({ name }) => ({
  type: ActionTypes.REMOVE_DATASET,
  payload: {
    name,
  },
});
