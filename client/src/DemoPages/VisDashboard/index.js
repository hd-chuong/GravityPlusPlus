import React, {Component, Fragment} from 'react';
import {Route} from 'react-router-dom';

// DASHBOARDS
import VisDashboard from './VisDashboard';

// Layout
import AppHeader from '../../Layout/AppHeader';
import VisSideBar from '../../Layout/VisSideBar';


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
                <VisSideBar toggleNewNodeModal={this.toggleNewNodeModal}/>
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <VisDashboard
                            datasets={this.props.datasets}
                            datagraph={this.props.datagraph}
                            visgraph={this.props.visgraph}
                            
                            toggleNewNodeModal={this.toggleNewNodeModal}
                            isNewNodeModalOpen={this.state.isNewNodeModalOpen}
                            addVisNode={this.props.addVisNode}
                            
                        />
                    </div>
                </div>
            </div>
        </Fragment>
        )
    }
    
};

export default Dashboard;