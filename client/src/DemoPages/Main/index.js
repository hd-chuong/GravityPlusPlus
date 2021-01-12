import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import ResizeDetector from 'react-resize-detector';
import AppMain from '../../Layout/AppMain';
import { addDataset, removeDataset } from '../../redux/DatasetActionCreators';

import {
  addDataEdge,
  addDataNode,
  removeDataNode,
  removeDataEdges,
  setDataNode,
  setDataPosition,
} from '../../redux/DataGraphActionCreators';

import {
  addVisNode,
  addVisEdge,
  removeVisNode,
  removeVisEdge,
  setVisNode,
  setVisPosition,
} from '../../redux/VisGraphActionCreators';

import {
  saveIntNode, 
  addIntEdge,
  removeIntNode,
  removeIntEdge,
  setIntPosition
} from '../../redux/IntGraphActionCreators';

import {loadState}
from '../../redux/AppActionCreators';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closedSmallerSidebar: false,
      width: undefined,
    };
  }

  onResize = width => this.setState({ width });

  render() {
    const { width } = this.state;
    let {
      colorScheme,
      enableFixedHeader,
      enableFixedSidebar,
      enableFixedFooter,
      enableClosedSidebar,
      closedSmallerSidebar,
      enableMobileMenu,
      enablePageTabsAlt,
    } = this.props;
    
    return (  
      <Fragment>
        <div
          className={cx(
            'app-container app-theme-' + colorScheme,
            { 'fixed-header': enableFixedHeader },
            { 'fixed-sidebar': enableFixedSidebar || width < 1250 },
            { 'fixed-footer': enableFixedFooter },
            { 'closed-sidebar': enableClosedSidebar || width < 1250 },
            { 'closed-sidebar-mobile': closedSmallerSidebar || width < 1250 },
            { 'sidebar-mobile-open': enableMobileMenu },
          )}
        >
          <AppMain
            state={this.props.state}
            datasets={this.props.datasets}
            datagraph={this.props.datagraph}
            visgraph={this.props.visgraph}
            intgraph={this.props.intgraph}
            addDataset={this.props.addDataset}
            removeDataset={this.props.removeDataset}
            addDataNode={this.props.addDataNode}
            addDataEdge={this.props.addDataEdge}
            removeDataNode={this.props.removeDataNode}
            removeDataEdges={this.props.removeDataEdges}
            setDataNode={this.props.setDataNode}
            addVisNode={this.props.addVisNode}
            addVisEdge={this.props.addVisEdge}
            removeVisNode={this.props.removeVisNode}
            removeVisEdge={this.props.removeVisEdge}
            setVisNode={this.props.setVisNode}
            addIntNode={this.props.addIntNode}
            addIntEdge={this.props.addIntEdge}
            removeIntNode={this.props.removeIntNode}
            removeIntEdge={this.props.removeIntEdge}
            setDataPosition={this.props.setDataPosition}
            setVisPosition={this.props.setVisPosition}
            setIntPosition={this.props.setIntPosition}
            loadState={this.props.loadState}
          />
          <ResizeDetector handleWidth onResize={this.onResize} />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProp = state => ({
  colorScheme: state.ThemeOptions.colorScheme,
  enableFixedHeader: state.ThemeOptions.enableFixedHeader,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableFixedFooter: state.ThemeOptions.enableFixedFooter,
  enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,
  datasets: state.datasets,
  datagraph: state.datagraph,
  visgraph: state.visgraph,
  intgraph: state.intgraph,
  state: state
});

const mapDispatchToProp = dispatch => ({
  addDataset: dataset => dispatch(addDataset(dataset)),

  removeDataset: name => dispatch(removeDataset({ name })),

  addDataNode: (name, type, source = null, transform = [], format = {}) =>
    dispatch(addDataNode({ name, type, source, transform, format })),
  
  removeDataNode: id => 
    dispatch(removeDataNode({ id })),

  removeDataEdges: (id, direction = null) =>
    dispatch(removeDataEdges(id, direction)),

  setDataNode: (id, params) => 
    dispatch(setDataNode({ id, params })),
  
  addDataEdge: (source, target, type, data) =>
    dispatch(addDataEdge({ source, target, type, data })),

  addVisNode: (name, dataSource, spec) =>
    dispatch(addVisNode({ name, dataSource, spec })),
  
  addVisEdge: (source, target, type) =>
    dispatch(addVisEdge({ source, target, type })),
  
  removeVisNode: id => 
    dispatch(removeVisNode({ id })),
  removeVisEdge: id => 
    dispatch(removeVisEdge({ id })),
  setVisNode: (id, params) => 
    dispatch(setVisNode({ id, params })),
  addIntNode: (name, source) => 
    dispatch(saveIntNode({name, source})),
  addIntEdge: (source, target, signal, binding, label, id) => 
    dispatch(addIntEdge({source, target, signal, binding, label, id})),
  removeIntNode: (id) => dispatch(removeIntNode({id})),
  removeIntEdge: (id) => dispatch(removeIntEdge({id})),
  setDataPosition: (id, x, y) => dispatch(setDataPosition({id, x, y})),
  setVisPosition: (id, x, y) => dispatch(setVisPosition({id, x, y})),
  setIntPosition: (id, x, y) => dispatch(setIntPosition({id, x, y})),
  loadState: (state) => dispatch(loadState({state})),
});

export default withRouter(connect(mapStateToProp, mapDispatchToProp)(Main));