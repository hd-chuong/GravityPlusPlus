import React, {Component, Fragment} from 'react';
import {Route} from 'react-router-dom';

// DASHBOARDS
import DataDashboard from './DataDashboard';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
// import AppFooter from '../../Layout/AppFooter/';


class Dashboards extends Component{
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
                <AppSidebar addDataset={this.props.addDataset} datasets={this.props.datasets} toggleNewNodeModal={this.toggleNewNodeModal} />
                <div className="app-main__outer">
                    <div className="app-main__inner">
                        <DataDashboard 
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
                        />
                        {/* <Route path={'/data/'} component={DataDashboard}/> */}
                    </div>
                    {/* <AppFooter/> */}
                </div>
            </div>
        </Fragment>
        )
    }
    
};

export default Dashboards;