import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import MetisMenu from 'react-metismenu';

import {MainNav, DomainNav, FormsNav, WidgetsNav, ChartsNav, DatasetNav} from './NavItems';

import {ResizableBox} from 'react-resizable';
class Nav extends Component {

    state = {};

    render() {
        return (
            <Fragment>
                <ResizableBox width={200} height={200}>
                {/* <h5 className="app-sidebar__heading">Datasets</h5>
                <MetisMenu content={DatasetNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix=""/>
                 */}
                <h5 className="app-sidebar__heading">Toolbox</h5>
                <MetisMenu content={DomainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix=""/>
                {/* <div className="metismenu vertical-nav-menu">
                    <ul className="metismenu-container">
                        <li className="metismenu-item">
                            <a className="metismenu-link" href="https://dashboardpack.com/theme-details/architectui-dashboard-react-pro" target="_blank">
                                {/* <i className="metismenu-icon pe-7s-diamond"></i> */}
                                {/* <span className="fa fa-table"> Upgrade to PRO</span>
                                <i className="metismenu-icon fa fa-info fa-lg"></i> About us
                            </a>
                        </li>
                    </ul>
                </div> */}
                
                {/* <div>
                    <h5 className="app-sidebar__heading">Menu</h5>
                    <MetisMenu content={MainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                </div> */}

                {/* <div> */}
                    {/* <h5 className="app-sidebar__heading">UI Components</h5> */}

                {/* </div> */}
                
                {/* <div>
                    <h5 className="app-sidebar__heading">Widgets</h5>
                    <MetisMenu content={WidgetsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                </div> */}

                {/* <h5 className="app-sidebar__heading">Forms</h5>
                <MetisMenu content={FormsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/>
                <h5 className="app-sidebar__heading">Charts</h5>
                <MetisMenu content={ChartsNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"/> */}
                </ResizableBox>
            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

export default withRouter(Nav);