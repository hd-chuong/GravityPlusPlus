import React, { Fragment } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { Nav, NavItem, Navbar } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import HeaderLogo from '../AppLogo';
import UserBox from './Components/UserBox';
import Cookie from 'js-cookie';
// import SearchBox from './Components/SearchBox';
// import UserBox from './Components/UserBox';
class Header extends React.Component {

  render() {
    const projectName = Cookie.get("project_name");
    let {
      headerBackgroundColor,
      enableMobileMenuSmall,
      enableHeaderShadow,
    } = this.props;
    return (
      <Fragment>
        <ReactCSSTransitionGroup
          name="app-header"
          component="div"
          className={cx('app-header', headerBackgroundColor, {
            'header-shadow': enableHeaderShadow,
          })}
          transitionName="HeaderAnimation"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnter={false}
          transitionLeave={false}
        >
          <HeaderLogo />

          <div className={cx(
                        "app-header__content",
                        {'header-mobile-open': enableMobileMenuSmall},
                    )}>
                    
          <div className="app-header-left">
            <Navbar dark expand="sm">
              <Nav navbar>
                <NavItem className="metismenu-item mr-3">
                  <NavLink className="nav-link" to="#">
                    {projectName && projectName.slice(0, 20)}
                  </NavLink>
                </NavItem>
                <NavItem className="metismenu-item mr-3">
                  <NavLink className="nav-link" to="/home/">
                    <i className="fa fa-home fa-lg mr-2"></i>Home
                  </NavLink>
                </NavItem>
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
                  <NavLink className="nav-link" to="/int/">
                    <i className="fa fa-hand-pointer-o fa-lg mr-2"></i>Interaction
                  </NavLink>
                </NavItem>
                <NavItem className="metismenu-item mr-3">
                  <NavLink className="nav-link" to="/test/">
                    <i className="fa fa-info-circle fa-lg mr-2"></i>User Study
                  </NavLink>
                </NavItem>
              </Nav>
            </Navbar>
          </div>
            <div className="app-header-right">
              <Navbar dark expand="sm">
                <Nav navbar>
                  <NavItem 
                    className="metismenu-item mr-1" 
                    style={{ cursor: 'pointer' }} 
                    onClick={this.props.save}
                  >
                    <div className="nav-link">
                      <i className="fa fa-download fa-md mr-1"></i> Save
                    </div>
                  </NavItem>
                 
                  <NavItem className="metismenu-item mr-1" style={{ cursor: 'pointer' }}>
                    <NavLink className="nav-link" to="/story/">
                      <i style={{color: 'yellow'}} className="fa fa-television fa-md mr-1"></i> Watch your story
                    </NavLink>
                  </NavItem>
                  
                </Nav>
              </Navbar>
              <UserBox/>
            </div>            
          </div>
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
