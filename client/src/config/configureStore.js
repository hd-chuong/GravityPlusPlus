import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers';
import { Datasets } from '../redux/datasets';
import { DataGraph } from '../redux/datagraph';
import { VisGraph} from '../redux/visgraph';
import { IntGraph} from '../redux/intgraph';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const persistedState = loadState();

export default function configureStore() {
  const store = createStore(
    combineReducers({
      datasets: Datasets,
      datagraph: DataGraph,
      visgraph: VisGraph,
      intgraph: IntGraph,
      ...reducers
    }),

    composeEnhancers(applyMiddleware(thunk, logger)),
  );
  return store;
}