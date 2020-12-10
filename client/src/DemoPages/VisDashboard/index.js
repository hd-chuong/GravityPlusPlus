import React, {Component, Fragment} from 'react';
import {Route} from 'react-router-dom';

// DASHBOARDS
import VisDashboard from './VisDashboard';

// Layout
import AppHeader from '../../Layout/AppHeader';
import VisSideBar from '../../Layout/VisSideBar';
// import AppFooter from '../../Layout/AppFooter/';


class Dashboard extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            isNewNodeModalOpen: false
        }
        this.toggleNewNodeModal = this.toggleNewNodeModal.bind(this);
    }

    toggleNewNodeModal()
    {
        this.setState({isNewNodeModalOpen: !this.state.isNewNodeModalOpen});
    }

    render() 
    {
        return (
            <Fragment>
            <AppHeader/>
            <div className="app-main">
                <VisSideBar/>
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        {/* <VisDashboard 
                            addDataset={this.props.addDataset}
                            removeDataset={this.props.removeDataset}
                            datasets={this.props.datasets} 
                            datagraph={this.props.datagraph}
                            toggleNewNodeModal={this.toggleNewNodeModal}
                            isNewNodeModalOpen={this.state.isNewNodeModalOpen}

                            addDataNode={this.props.addDataNode}
                            removeDataNode={this.props.removeDataNode}
                            addDataEdge={this.props.addDataEdge}

                            removeEdges={this.props.removeEdges}
                            setDataNode={this.props.setDataNode}
                        /> */}
                    </div>
                </div>
            </div>
        </Fragment>
        )
    }
    
};

export default Dashboard;