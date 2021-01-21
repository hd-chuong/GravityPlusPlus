import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import React, { Suspense, lazy, Fragment } from 'react';

import AppHeader from '../AppHeader';
import { ToastContainer } from 'react-toastify';
import { Switch, withRouter } from 'react-router-dom';
import {AsyncJSONDownloadHandler} from "../../utils/DataFileHandler";
import Home from '../../DemoPages/Home';

const DataDashboard = lazy(() => import('../../DemoPages/DataDashboard'));
const VisDashboard = lazy(() => import('../../DemoPages/VisDashboard'));
const IntDashboard = lazy(() => import('../../DemoPages/IntDashboard'));
const Story = lazy(() => import('../../DemoPages/Story'));

const AppMain = ({
  state,
  datasets,
  datagraph,
  visgraph,
  intgraph,
  addDataset,
  removeDataset,
  addDataNode,
  removeDataNode,
  addDataEdge,
  removeDataEdges,
  setDataNode,
  addVisNode,
  addVisEdge,
  removeVisNode,
  removeVisEdge,
  setVisNode,
  addIntNode,
  addIntEdge,
  removeIntNode,
  removeIntEdge,
  setDataPosition,
  setVisPosition,
  setIntPosition,
  setIntNode,
  loadState,
  
}) => {
  return (
    <Fragment>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <i
                className="fa fa-spin fa-cog fa-5x"
                aria-hidden="true"
              ></i>
              <h4 className="mt-3">Loading ...</h4>
            </div>
          </div>
        }
      >
        
        <Router>
          <AppHeader 
            save={() => AsyncJSONDownloadHandler("three-graph.gpp", state)}
            load={loadState}
          />
          <Switch>
            <Route exact path="/home">
                <Home
                  load={loadState}
                />
            </Route>
            
            <Route exact path="/data">
              <DataDashboard
                datasets={datasets}
                datagraph={datagraph}
                addDataset={addDataset}
                removeDataset={removeDataset}
                addDataNode={addDataNode}
                addDataEdge={addDataEdge}
                removeDataNode={removeDataNode}
                removeDataEdges={removeDataEdges}
                setDataNode={setDataNode}
                setDataPosition={setDataPosition}
              />
            </Route>

            <Route exact path="/vis">
              <VisDashboard
                datasets={datasets}
                datagraph={datagraph.datagraph}
                visgraph={visgraph.visgraph}
                addVisNode={addVisNode}
                addVisEdge={addVisEdge}
                removeVisNode={removeVisNode}
                removeVisEdge={removeVisEdge}
                setVisNode={setVisNode}
                setVisPosition={setVisPosition}
              />
            </Route>

            <Route exact path="/int">
              <IntDashboard
                datasets={datasets}
                datagraph={datagraph.datagraph}
                visgraph={visgraph.visgraph}
                intgraph={intgraph.intgraph}
                addIntNode={addIntNode}
                addIntEdge={addIntEdge}
                removeIntNode={removeIntNode}
                removeIntEdge={removeIntEdge}
                setIntPosition={setIntPosition}
                setIntNode={setIntNode}
              />
            </Route>

            <Route exact path="/story">
              <Story
                datasets={datasets}
                datagraph={datagraph.datagraph}
                visgraph={visgraph.visgraph}
                intgraph={intgraph.intgraph}
              />
            </Route>
            
            <Redirect to="/home" />
          </Switch>
          <ToastContainer />
        </Router>
      </Suspense>
    </Fragment>
  );
};

export default withRouter(AppMain);
