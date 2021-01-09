import React, {Component, Fragment} from 'react';
// Layout
import AppHeader from '../../Layout/AppHeader';
import IntSideBar from '../../Layout/IntSideBar';
import Dashboard from './IntDashboard';

class IntDashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
          isNewNodeModalOpen: false,
          isNewEdgeModalOpen: false
        };
        this.toggleNewNodeModal = this.toggleNewNodeModal.bind(this);
        this.toggleNewEdgeModal = this.toggleNewEdgeModal.bind(this);
    }

    toggleNewNodeModal() {
        this.setState({ isNewNodeModalOpen: !this.state.isNewNodeModalOpen });
    }

    toggleNewEdgeModal() {
        this.setState({ isNewEdgeModalOpen: !this.state.isNewEdgeModalOpen });
    }
    
    render() 
    {
        return (
            <Fragment>
            <AppHeader/>
            <div className="app-main">
                <IntSideBar 
                    toggleNewNodeModal={this.toggleNewNodeModal}
                    toggleNewEdgeModal={this.toggleNewEdgeModal}
                    // handleRecommendedSequence={this.handleRecommendedSequence}
                    // handleTransformationLinks={this.handleTransformationLinks}

                    // isSequenceRecommended={this.state.recommendedSequence}    
                    // isTransformationLinks={this.state.transformationLinks}

                    // loadRecommendedSequence={this.state.loadRecommendedSequence}
                    // loadTransformationLinks={this.state.loadTransformationLinks}        
                />
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <Dashboard
                            datasets={this.props.datasets.datasets}
                            datagraph={this.props.datagraph}
                            visgraph={this.props.visgraph}
                            intgraph={this.props.intgraph}
                            toggleNewNodeModal={this.toggleNewNodeModal}
                            toggleNewEdgeModal={this.toggleNewEdgeModal}
                            isNewNodeModalOpen={this.state.isNewNodeModalOpen}
                            isNewEdgeModalOpen={this.state.isNewEdgeModalOpen}
                            addIntNode={this.props.addIntNode}
                            addIntEdge={this.props.addIntEdge}
                            // removeVisNode={this.props.removeVisNode}
                            // setVisNode={this.props.setVisNode}   
                        />
                    </div>
                </div>
            </div>
        </Fragment>
        )
    }
};

export default IntDashboard;