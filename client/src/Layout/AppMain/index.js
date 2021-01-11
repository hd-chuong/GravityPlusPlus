import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import React, { Suspense, lazy, Fragment } from 'react';

import { ToastContainer } from 'react-toastify';

import { Switch, withRouter } from 'react-router-dom';

const DataDashboard = lazy(() => import('../../DemoPages/DataDashboard'));
const VisDashboard = lazy(() => import('../../DemoPages/VisDashboard'));
const IntDashboard = lazy(() => import('../../DemoPages/IntDashboard'));

const AppMain = ({
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
          <Switch>
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
              />
            </Route>

            <Redirect to="/data" />
          </Switch>
          <ToastContainer />
        </Router>
      </Suspense>
    </Fragment>
  );
};

export default withRouter(AppMain);
