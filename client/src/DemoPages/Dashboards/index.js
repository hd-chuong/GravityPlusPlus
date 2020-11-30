import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// DASHBOARDS

import BasicDashboard from './Basic/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
// import AppFooter from '../../Layout/AppFooter/';

const Dashboards = ({match, addDataset, datasets, tableData}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar addDataset={addDataset} datasets={datasets}/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <BasicDashboard datasets={datasets} tableData={tableData}/>
                    {/* <Route path={'/data/'} component={BasicDashboard}/> */}
                </div>
                {/* <AppFooter/> */}
            </div>
        </div>
    </Fragment>
);

export default Dashboards;