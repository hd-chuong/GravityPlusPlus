import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { setEnableMobileMenu } from '../../reducers/ThemeOptions';
import {Button, Input, Row, Col, Label, Badge} from 'reactstrap';

class VisSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedSequence: false,
    };
  }

  state = {};
  toggleMobileSidebar = () => {
    let { enableMobileMenu, setEnableMobileMenu } = this.props;
    setEnableMobileMenu(!enableMobileMenu);
  };

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
          className={cx('app-sidebar', backgroundColor)}
          transitionName="SidebarAnimation"
          transitionAppearTimeout={0}
          transitionEnter={false}
          transitionLeave={false}
        >
          <PerfectScrollbar>
            <div className="app-sidebar__inner">
              <h5 className="app-sidebar__heading">Visualisation nodes</h5>
              <div className="metismenu vertical-nav-menu">
                <ul className="metismenu-container">
                  <li
                    className="metismenu-item"
                    onClick={this.props.toggleNewNodeModal}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="metismenu-link" target="_blank">
                      <i className="metismenu-icon fa fa-asterisk fa-lg"></i>{' '}
                      Add new Node
                    </div>
                  </li>
                </ul>
              </div>
{/* 
              <h5 className="app-sidebar__heading">
                Connect nodes with
              </h5> */}

              {/* <div className="metismenu vertical-nav-menu" style={{width: '100%', wordBreak: 'break-word'}}>
                <ul className="metismenu-container">
                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadTransformationLinks ? (
                        <i className="metismenu-icon fa fa-spin fa-circle-o-notch" aria-hidden="true"/>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isTransformationLinks}
                            onChange={this.props.handleTransformationLinks}
                          />
                        </i>
                      )}{' '}
                      Same dataset and encoding 
                    </div>
                  </li>

                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadTransformationLinks ? (
                        <i className="metismenu-icon fa fa-spin fa-circle-o-notch" aria-hidden="true"/>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isTransformationLinks}
                            onChange={this.props.handleTransformationLinks}
                          />
                        </i>
                      )}{' '}
                      Same dataset, different encoding 
                    </div>
                  </li>

                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadTransformationLinks ? (
                        <i className="metismenu-icon fa fa-spin fa-circle-o-notch" aria-hidden="true"/>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isTransformationLinks}
                            onChange={this.props.handleTransformationLinks}
                          />
                        </i>
                      )}{' '}
                      Data derived from other nodes 
                    </div>
                  </li>
                </ul>
              </div> */}
 
              <div>
                <h5 className="app-sidebar__heading" style={{ cursor: 'pointer' }} onClick={this.props.handleRecommendedSequence}>
                  Graphscape <span mr={2}></span>
                  {this.props.loadRecommendedSequence && <i className="float-right metismenu-icon fa fa-spin fa-2x fa-circle-o-notch"
                    aria-hidden="true"/>}
                  <Badge color="info">Generate</Badge>
                </h5>
                
              </div>

              <div className="metismenu vertical-nav-menu">              
                <ul className="metismenu-container">
                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link">
                        Path Number {" "}<Badge>
                        <input 
                          style={{width: 35, height: 32}} 
                          defaultValue={1}
                          type="number" 
                          step={1} 
                          min={1} 
                          max={10}
                          onChange={(e) => this.props.setRecommendedPath(e.target.value - 1)}
                        />
                        </Badge>
                    </div>
                  </li>
                  
                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank" > 
                      Sequence Cost <Badge color="secondary">{this.props.cost}</Badge>
                    </div>
                  </li>
                </ul>
              </div>
{/* 
              <div className="metismenu vertical-nav-menu">
                <ul className="metismenu-container">
                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadTransformationLinks ? (
                        <i className="metismenu-icon fa fa-spin fa-circle-o-notch" aria-hidden="true"/>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isTransformationLinks}
                            onChange={this.props.handleTransformationLinks}
                          />
                        </i>
                      )}{' '}
                      Transformation Links
                    </div>
                  </li>
                </ul>
              </div> */}

              {/* <div className="metismenu vertical-nav-menu">
                <ul className="metismenu-container">
                  <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadTransformationLinks ? (
                        <i className="metismenu-icon fa fa-spin fa-circle-o-notch" aria-hidden="true"/>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isTransformationLinks}
                            onChange={this.props.handleTransformationLinks}
                          />
                        </i>
                      )}{' '}
                      Transformation Links
                    </div>
                  </li>
                  {/* <li className="metismenu-item" style={{ cursor: 'pointer' }}>
                    <div className="metismenu-link" target="_blank">
                      {this.props.loadRecommendedSequence ? (
                        <i
                          className="metismenu-icon fa fa-spin fa-circle-o-notch"
                          aria-hidden="true"
                        ></i>
                      ) : (
                        <i className="metismenu-icon">
                          <input
                            type="checkbox"
                            checked={this.props.isSequenceRecommended}
                            onChange={this.props.handleRecommendedSequence}
                          />
                        </i>
                      )}{' '}
                      GraphScape Path
                    </div>
                  </li>
                </ul>
              </div> */}
            </div>
          </PerfectScrollbar>
        </ReactCSSTransitionGroup>
      </Fragment>
    );
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
