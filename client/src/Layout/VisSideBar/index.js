import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    setEnableMobileMenu
} from '../../reducers/ThemeOptions';

class VisSideBar extends Component {

    constructor(props)
    {
        super(props);
    }

    state = {};
    toggleMobileSidebar = () => {
        let {enableMobileMenu, setEnableMobileMenu} = this.props;
        setEnableMobileMenu(!enableMobileMenu);
    }

    render() {
        let {
            backgroundColor,
            enableBackgroundImage,
            enableSidebarShadow,
            backgroundImage,
            backgroundImageOpacity,
        } = this.props;

        return (
            <Fragment>
                {/* <div className="sidebar-mobile-overlay" onClick={this.toggleMobileSidebar}/> */}
                <ReactCSSTransitionGroup
                    component="div"
                    className={cx("app-sidebar", backgroundColor)}
                    // transitionName="SidebarAnimation"
                    // transitionAppear={true}
                    // transitionAppearTimeout={1500}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <PerfectScrollbar>
                        <div className="app-sidebar__inner">
                            <div className="metismenu vertical-nav-menu" active>
                                <ul className="metismenu-container">
                                    <li className="metismenu-item" onClick={this.props.toggleNewNodeModal} style={{ cursor: 'pointer' }}>                            
                                        <div className="metismenu-link" target="_blank">
                                            <i className="metismenu-icon fa fa-asterisk fa-lg"></i> Add new Node
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* <VisForm/> */}
                        </div>

                    </PerfectScrollbar>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    enableBackgroundImage: state.ThemeOptions.enableBackgroundImage,
    enableSidebarShadow: state.ThemeOptions.enableSidebarShadow,
    enableMobileMenu: state.ThemeOptions.enableMobileMenu,
    backgroundColor: state.ThemeOptions.backgroundColor,
    backgroundImage: state.ThemeOptions.backgroundImage,
    backgroundImageOpacity: state.ThemeOptions.backgroundImageOpacity,
});

const mapDispatchToProps = dispatch => ({

    setEnableMobileMenu: enable => dispatch(setEnableMobileMenu(enable)),

});

export default connect(mapStateToProps, mapDispatchToProps)(VisSideBar);