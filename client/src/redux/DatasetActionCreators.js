import * as ActionTypes from './DatasetActionTypes';

export const addDataset = ({ name, dataset }) => ({
  type: ActionTypes.ADD_DATASET,
  payload: {
    name,
    dataset,
  },
});

export const removeDataset = ({ name }) => ({
  type: ActionTypes.REMOVE_DATASET,
  payload: {
    name,
  },
});
