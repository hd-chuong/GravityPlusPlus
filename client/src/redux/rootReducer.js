import { combineReducers } from 'redux';
import { Datasets } from './datasets';
import { DataGraph } from './datagraph';
import { VisGraph} from './visgraph';
import { IntGraph} from './intgraph';
import reducers from '../reducers';
import * as ActionTypes from './AppActionTypes';

const graphReducer = combineReducers({
    datasets: Datasets,
    datagraph: DataGraph,
    visgraph: VisGraph,
    intgraph: IntGraph,
    ...reducers
  });

const rootReducer = (state, action) => {
    switch(action.type)
    {
        case ActionTypes.LOAD_STATE:
            const { state: loadedState } = action.payload;
            console.log(loadedState);
            return graphReducer(loadedState, action);
        
        default:
            return graphReducer(state, action);
    }
}

export default rootReducer;