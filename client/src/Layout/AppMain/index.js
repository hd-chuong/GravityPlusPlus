import {Route, Redirect } from 'react-router-dom';
import React, { Suspense, lazy, Fragment } from 'react';

import AppHeader from '../AppHeader';
import { ToastContainer } from 'react-toastify';
import { Switch, withRouter } from 'react-router-dom';
import {AsyncJSONDownloadHandler} from "../../utils/DataFileHandler";
import Cookies from 'js-cookie';
import axios from 'axios';

const DataDashboard = lazy(() => import('../../DemoPages/DataDashboard'));
const VisDashboard = lazy(() => import('../../DemoPages/VisDashboard'));
const IntDashboard = lazy(() => import('../../DemoPages/IntDashboard'));
const Story = lazy(() => import('../../DemoPages/Story'));
const Home = lazy(() => import('../../DemoPages/Home'))
const UserStudy = lazy(() => import('../../DemoPages/UserStudy'));
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
        <Route exact path="/home">
            <AppHeader 
              save={downloadProject}
            />
            <Home
              load={loadState}
            />
        </Route>
        </Suspense>
        <Suspense
          fallback={() => <RenderLoading/>}
        >
            <AppHeader 
                save={downloadProject}
            />
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
        </Suspense>
        <Suspense fallback={<RenderLoading/>}>
            <AppHeader 
                save={downloadProject}
            />
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
            </Suspense>
        <Suspense fallback={() => <RenderLoading/>}>
            <AppHeader 
                save={downloadProject}
            />
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
        </Suspense>
        <Suspense fallback={() => <RenderLoading/>}>
            <AppHeader 
                save={downloadProject}
            />
            <Route exact path="/story">
              <Story
                datasets={datasets}
                datagraph={datagraph.datagraph}
                visgraph={visgraph.visgraph}
                intgraph={intgraph.intgraph}
              />
            </Route>
            </Suspense>
        <Suspense fallback={() => <RenderLoading/>}>
            <AppHeader 
                save={downloadProject}
            />    
            <Route exact path="/test">
              <UserStudy />
            </Route>
            <Redirect to="/home" />
          
          <ToastContainer />
      </Suspense>
    </Fragment>
  );
};

const downloadProject = () => {
  const name = Cookies.get("project_name");
  return axios({
    url: `http://165.227.106.53:7473/app/${name}`,
    withCredentials: true,
    method: 'get'
}).then(response => {
    const {datasets, datagraph, intgraph, visgraph} = response.data;
    AsyncJSONDownloadHandler("three-graph.gpp", {datasets, datagraph, intgraph, visgraph});
    return;
});
}

const RenderLoading = () => (<div className="loader-container">
  <div className="loader-container-inner">
      <h6 className="mt-5">
          Please wait while we load all the Components examples
          <small>Because this is a demonstration we load at once all the Components examples. This wouldn't happen in a real live app!</small>
      </h6>
  </div>
</div>);

export default withRouter(AppMain);
