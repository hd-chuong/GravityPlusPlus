import React, {Component, Fragment} from 'react';

// DASHBOARDS
import VisDashboard from './VisDashboard';

// Layout
import AppHeader from '../../Layout/AppHeader';
import VisSideBar from '../../Layout/VisSideBar';
import Axios from 'axios';


class Dashboard extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            isNewNodeModalOpen: false,
            recommendedSequence: false,
            loadRecommendedSequence: false
        }
        this.toggleNewNodeModal = this.toggleNewNodeModal.bind(this);
        this.handleRecommendedSequence = this.handleRecommendedSequence.bind(this);
    }

    toggleNewNodeModal()
    {
        this.setState({isNewNodeModalOpen: !this.state.isNewNodeModalOpen});
    }
    
    handleRecommendedSequence()
    {
        this.setState({recommendedSequence: !this.state.recommendedSequence}, () => {
            if (this.state.recommendedSequence) 
            {
                this.setState({loadRecommendedSequence: true});
                Axios({
                    method: "post",
                    url: `http://localhost:7473/vis/sequenceRecommend`,
                    data: {charts: this.props.visgraph.nodes.map(node => ({...node.data.spec, id: node.id}))}
                }).then(response => 
                {
                    this.setState({loadRecommendedSequence: false});
                    if (response.statusText !== "OK")
                    {
                        var error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                    } 
                    else 
                    {
                        return response.data;
                    }
                })
                .then(sequence => {
                    // sequence in the form of a 
                    sequence.forEach((node, i) => {
                        if (i !== 0)
                        {
                            this.props.addVisEdge(sequence[i-1], node, "RECOMMENDED");
                        }
                    });
                })
                .catch(err => console.trace(err));
            }
        })
    }
    render() 
    {
        return (
            <Fragment>
            <AppHeader/>
            <div className="app-main">
                <VisSideBar 
                    toggleNewNodeModal={this.toggleNewNodeModal}
                    handleRecommendedSequence={this.handleRecommendedSequence}
                    isSequenceRecommended={this.state.recommendedSequence}    
                    loadRecommendedSequence={this.state.loadRecommendedSequence}
                />
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