import React, { Component, Fragment } from 'react';

// DASHBOARDS
import DataDashboard from './DataDashboard';

// Layout
import AppSidebar from '../../Layout/AppSidebar';

class Dashboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewNodeModalOpen: false,
    };
    this.toggleNewNodeModal = this.toggleNewNodeModal.bind(this);
  }

  toggleNewNodeModal() {
    this.setState({ isNewNodeModalOpen: !this.state.isNewNodeModalOpen });
  }

  render() {
    return (
      <Fragment>
        <div className="app-main">
          <AppSidebar
            addDataset={this.props.addDataset}
            datasets={this.props.datasets}
            toggleNewNodeModal={this.toggleNewNodeModal}
          />
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
                removeDataEdges={this.props.removeDataEdges}
                setDataNode={this.props.setDataNode}
                setDataPosition={this.props.setDataPosition}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dashboards;
