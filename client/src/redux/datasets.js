import * as ActionTypes from './DatasetActionTypes';

export const Datasets = (state = { errMess: null, datasets: [] }, action) => {
  var dataset;
  var datasetName;
  switch (action.type) {
    case ActionTypes.ADD_DATASET:
      dataset = action.payload;
      datasetName = action.payload.name;

      if (
        state.datasets.filter(dataset => dataset.name === datasetName).length >
        0
      ) {
        alert('Can not upload dataset of existing name.');
        return state;
      }
      return { ...state, datasets: state.datasets.concat(dataset) };

    case ActionTypes.REMOVE_DATASET:
      datasetName = action.payload.name;
      return {
        ...state,
        datasets: state.datasets.filter(
          dataset => dataset.name !== datasetName,
        ),
      };

    default:
      return state;
  }
};