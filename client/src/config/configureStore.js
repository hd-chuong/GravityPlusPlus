import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers';
import { Datasets } from '../redux/datasets';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  return createStore(
    combineReducers({
      datasets: Datasets,
      ...reducers
    }),
    composeEnhancers(applyMiddleware(thunk, logger)),
  );
}