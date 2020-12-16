import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
import {withRouter} from 'react-router-dom';

import ResizeDetector from 'react-resize-detector';

import AppMain from '../../Layout/AppMain';
import { addDataset, removeDataset } from '../../redux/DatasetActionCreators';
import { addDataEdge, addDataNode, removeDataNode, removeEdges, setDataNode } from '../../redux/DataGraphActionCreators';
import { addVisNode } from '../../redux/VisGraphActionCreators';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closedSmallerSidebar: false,
            width: undefined
        };

    }

    onResize = (width) => this.setState({ width });

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
                <div className={cx(
                    "app-container app-theme-" + colorScheme,
                    {'fixed-header': enableFixedHeader},
                    {'fixed-sidebar': enableFixedSidebar || width < 1250},
                    {'fixed-footer': enableFixedFooter},
                    {'closed-sidebar': enableClosedSidebar || width < 1250},
                    {'closed-sidebar-mobile': closedSmallerSidebar || width < 1250},
                    {'sidebar-mobile-open': enableMobileMenu},
                )}>
                    <AppMain 
                        datasets={this.props.datasets}
                        datagraph={this.props.datagraph}
                        visgraph={this.props.visgraph}

                        addDataset={this.props.addDataset}
                        removeDataset={this.props.removeDataset}

                        addDataNode={this.props.addDataNode} 
                        addDataEdge={this.props.addDataEdge}

                        removeDataNode={this.props.removeDataNode}
                        removeEdges={this.props.removeEdges}
                        setDataNode={this.props.setDataNode}
                        
                        addVisNode={this.props.addVisNode}
                    />
                    <ResizeDetector handleWidth onResize={this.onResize} />
                </div>
            </Fragment>
        )
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
});

const mapDispatchToProp = dispatch => ({
    addDataset: (dataset) => dispatch(addDataset(dataset)),
    removeDataset: (name) => dispatch(removeDataset({name})),
    addDataNode: (name, type, source = null, transform = [], format = {}) => dispatch(addDataNode({name, type, source, transform, format})),
    removeDataNode: (id) => dispatch(removeDataNode({id})),
    removeEdges: (id, direction = null) => dispatch(removeEdges(id, direction)),
    setDataNode: (id, params) => dispatch(setDataNode({id, params})),
    addDataEdge: (source, target, type, data) => dispatch(addDataEdge({source, target, type, data})),
    addVisNode: (name, dataSource, spec) => dispatch(addVisNode({name, dataSource, spec}))
  });
  

export default withRouter(connect(mapStateToProp, mapDispatchToProp)(Main));