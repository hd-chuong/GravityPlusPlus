import React, {Fragment} from 'react';
import cx from 'classnames';

import {connect} from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HeaderLogo from '../AppLogo';

import SearchBox from './Components/SearchBox';
import UserBox from './Components/UserBox';
import {withRouter} from "react-router-dom";
import {Nav, NavItem, Navbar } from 'reactstrap';
import {NavLink} from 'react-router-dom';
class Header extends React.Component {
    render() {
        let {
            headerBackgroundColor,
            enableMobileMenuSmall,
            enableHeaderShadow
        } = this.props;
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    className={cx("app-header", headerBackgroundColor, {'header-shadow': enableHeaderShadow})}
                    // transitionName="HeaderAnimation"
                    // transitionAppear={true}
                    // transitionAppearTimeout={1500}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <HeaderLogo/>

                    {/* <div className={cx(
                        "app-header__content",
                        {'header-mobile-open': enableMobileMenuSmall},
                    )}>
                     */}
                    {/* <div className="app-header-left"> */}
                        <Navbar dark expand="sm">
                            
                            <Nav navbar>
                                <NavItem className="metismenu-item mr-3">
                                    <NavLink className="nav-link" to="/data/">
                                        <i className="fa fa-table fa-lg mr-2"></i>Data
                                    </NavLink>
                                </NavItem>
                                <NavItem className="metismenu-item mr-3">
                                    <NavLink className="nav-link" to="/vis/">
                                        <i className="fa fa-bar-chart fa-lg mr-2"></i>Visualisation
                                    </NavLink>
                                </NavItem>
                                <NavItem className="metismenu-item mr-3">
                                    <NavLink className="nav-link" to="/interaction">
                                        <i className="fa fa-hand-pointer-o fa-lg mr-2"></i>Interaction
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Navbar>

                    {/* </div> */}
                    {/* <div className="app-header-right"> */}
                        {/* <UserBox/> */}
                  
                    {/* </div> */}
                    {/* </div> */}
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
    headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));