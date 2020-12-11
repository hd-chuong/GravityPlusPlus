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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const DataDashboard = lazy(() => import('../../DemoPages/DataDashboard'));
const VisDashboard = lazy(() => import('../../DemoPages/VisDashboard'));

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
                            <FontAwesomeIcon
                                icon={['fas', 'cog']}
                                spin
                                fixedWidth={false}
                                size="4x"
                            />
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
                        datagraph={datagraph.datagraph}
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