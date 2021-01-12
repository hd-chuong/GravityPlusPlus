import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import appReducer from '../redux/rootReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const persistedState = loadState();

export default function configureStore() {

  const store = createStore(
    appReducer,
    composeEnhancers(applyMiddleware(thunk, logger)),
  );
  return store;
}