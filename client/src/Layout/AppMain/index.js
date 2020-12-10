import {
    useLocation, 
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
const Widgets = lazy(() => import('../../DemoPages/Widgets'));
const Elements = lazy(() => import('../../DemoPages/Elements'));
const Components = lazy(() => import('../../DemoPages/Components'));
const Charts = lazy(() => import('../../DemoPages/Charts'));
const Forms = lazy(() => import('../../DemoPages/Forms'));
const Tables = lazy(() => import('../../DemoPages/Tables'));

const AppMain = ({datasets, 
                datagraph, 
                addDataset, 
                removeDataset, 
                addDataNode, 
                removeDataNode, 
                addDataEdge, 
                removeEdges, 
                setDataNode}) => {
    return (
        <Fragment>
            
            {/* DataDashboard */}
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
                    <VisDashboard/>
                </Route>
                
                <Redirect to="/data"/>
                </Switch>
                {/* <Route path="*" render={() => <Redirect to={{pathname: "/vis"}} />} /> */}
                
                <ToastContainer/>
            </Router>
            </Suspense>
        </Fragment>
    )
};

export default withRouter(AppMain);