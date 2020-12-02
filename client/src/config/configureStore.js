import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers';
import { Datasets } from '../redux/datasets';
import { DataGraph } from '../redux/datagraph';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  return createStore(
    combineReducers({
      datasets: Datasets,
      datagraph: DataGraph,
      ...reducers
    }),
    composeEnhancers(applyMiddleware(thunk, logger)),
  );
}