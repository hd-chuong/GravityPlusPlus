import * as ActionTypes from './ActionTypes';

export const Datasets = (state = {errMess: null,
                                datasets: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DATASET:
            var dataset = action.payload;
            console.log(state.datasets);
            return {...state, datasets: state.datasets.concat(dataset)};

        default:
          return state;
      }
};