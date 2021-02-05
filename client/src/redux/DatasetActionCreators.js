import axios from 'axios';
import * as ActionTypes from './DatasetActionTypes';
import {toast} from 'react-toastify';
import toastOptions from '../DemoPages/config/toastOptions';

export const addDataset = ({ name, dataset }) => dispatch => {
  toast.info(`Adding dataset ${name}`, toastOptions);
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
    })
    toast.success(`Successfully added dataset ${name}`, toastOptions);
  }).catch((e) => {
    toast.error(`Failed to add dataset ${name}`, toastOptions);
  });
};

export const removeDataset = ({ name }) => ({
  type: ActionTypes.REMOVE_DATASET,
  payload: {
    name,
  },
});
