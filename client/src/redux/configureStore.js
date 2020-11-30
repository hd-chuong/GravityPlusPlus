import {createStore, combineReducers, applyMiddleware} from 'redux';
// import { createForms} from 'react-redux-form';
import {Datasets} from './datasets';


import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            datasets: Datasets,
        }),
        applyMiddleware(thunk, logger)
    );
    return store;
};