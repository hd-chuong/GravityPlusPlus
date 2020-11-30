import React, {Fragment} from 'react';
import cx from 'classnames';

import {connect} from 'react-redux';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HeaderLogo from '../AppLogo';

import SearchBox from './Components/SearchBox';
import UserBox from './Components/UserBox';
import {Nav, NavItem, NavLink, Navbar } from 'reactstrap';
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
                    transitionName="HeaderAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={1500}
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
                                    <NavLink className="nav-link" to="#">
                                        <i className="fa fa-table fa-lg mr-2"></i>Data
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <Nav navbar>
                                <NavItem className="metismenu-item mr-3">
                                    <NavLink className="nav-link" to="#">
                                        <i className="fa fa-bar-chart fa-lg mr-2"></i>Visualisation
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <Nav navbar>
                                <NavItem className="metismenu-item mr-3">
                                    <NavLink className="nav-link" to="#">
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);