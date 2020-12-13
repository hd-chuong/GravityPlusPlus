import { 
    BrowserRouter as Router, 
    Route, 
    Redirect
} from 'react-router-dom';
import React, {Suspense, lazy, Fragment} from 'react';

import {
    ToastContainer,
} from 'react-toastify';

import {Switch, withRouter} from 'react-router-dom';

const DataDashboard = lazy(() => import('../../DemoPages/DataDashboard'));
const VisDashboard = lazy(() => import('../../DemoPages/VisDashboard'));

const AppMain = ({datasets, 
                datagraph, visgraph,
                addDataset, 
                removeDataset, 
                addDataNode, 
                removeDataNode, 
                addDataEdge, 
                removeEdges, 
                setDataNode,
                addVisNode
            }) => {
    return (
        <Fragment>
            <Suspense fallback={
                    <div className="loader-container">
                        <div className="loader-container-inner">
                            <h6 className="mt-3">
                                Loading
                            </h6>
                        </div>
                    </div>
                }>
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

                        removeEdges={removeEdges}
                        setDataNode={setDataNode}
                    />
                </Route>


                <Route exact path="/vis">
                    <VisDashboard
                        datasets={datasets}
                        datagraph={datagraph.datagraph}
                        visgraph={visgraph.visgraph}
                        addVisNode={addVisNode}
                    />
                </Route>
                
                <Redirect to="/data"/>
                </Switch>
                <ToastContainer/>
            </Router>
            </Suspense>
        </Fragment>
    )
};

export default withRouter(AppMain);