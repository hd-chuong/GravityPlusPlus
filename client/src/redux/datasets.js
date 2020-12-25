import * as ActionTypes from './DatasetActionTypes';

export const Datasets = (state = { errMess: null, datasets: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_DATASET:
      var dataset = action.payload;
      var datasetName = action.payload.name;

      if (
        state.datasets.filter(dataset => dataset.name === datasetName).length >
        0
      ) {
        alert('Can not upload dataset of existing name.');
        return state;
      }
      return { ...state, datasets: state.datasets.concat(dataset) };

    case ActionTypes.REMOVE_DATASET:
      var datasetName = action.payload.name;
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
