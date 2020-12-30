import React, {Component, Fragment} from 'react';
// Layout
import AppHeader from '../../Layout/AppHeader';
import IntSideBar from '../../Layout/IntSideBar';
class IntDashboard extends Component{
    render() 
    {
        return (
            <Fragment>
            <AppHeader/>
            <div className="app-main">
                <IntSideBar 
                    // toggleNewNodeModal={this.toggleNewNodeModal}
                    // handleRecommendedSequence={this.handleRecommendedSequence}
                    // handleTransformationLinks={this.handleTransformationLinks}

                    // isSequenceRecommended={this.state.recommendedSequence}    
                    // isTransformationLinks={this.state.transformationLinks}

                    // loadRecommendedSequence={this.state.loadRecommendedSequence}
                    // loadTransformationLinks={this.state.loadTransformationLinks}        
                />
                {/* <div className="app-main__outer">
                    <div className="app-main__inner">
                        <VisDashboard
                            datasets={this.props.datasets}
                            datagraph={this.props.datagraph}
                            visgraph={this.props.visgraph}
                            
                            toggleNewNodeModal={this.toggleNewNodeModal}
                            isNewNodeModalOpen={this.state.isNewNodeModalOpen}
                            addVisNode={this.props.addVisNode}
                            removeVisNode={this.props.removeVisNode}
                            setVisNode={this.props.setVisNode}
                        />
                    </div>
                </div> */}
            </div>
        </Fragment>
        )
    }
};

export default IntDashboard;