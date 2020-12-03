import * as ActionTypes from './DatasetActionTypes';

export const Datasets = (state = {errMess: null,
                                datasets: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATASET:
            var dataset = action.payload;
            return {...state, datasets: state.datasets.concat(dataset)};

        default:
          return state;
      }
};