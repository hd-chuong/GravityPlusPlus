import React, { Component, Fragment } from 'react';

// DASHBOARDS
import VisDashboard from './VisDashboard';

// Layout
import VisSideBar from '../../Layout/VisSideBar';
import Axios from 'axios';
import _ from 'lodash';

import { FieldExtractorFromEncoding } from '../../utils/AttributeExtractor';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewNodeModalOpen: false,

      recommendedSequence: false,
      transformationLinks: false,

      loadRecommendedSequence: false,
      loadTransformationLinks: false,

      cost: NaN
    };
    this.toggleNewNodeModal = this.toggleNewNodeModal.bind(this);
    this.handleRecommendedSequence = this.handleRecommendedSequence.bind(this);
    this.handleTransformationLinks = this.handleTransformationLinks.bind(this);
    this.setRecommendedPath = this.setRecommendedPath.bind(this);
  }

  toggleNewNodeModal() {
    this.setState({ isNewNodeModalOpen: !this.state.isNewNodeModalOpen });
  }

  handleTransformationLinks() {
    // following types:

    // same dataSource, same encoding fields (just different visualisations)
    // same dataSource, different fields (use another fields)

    // different dataSource, there is a DIRECT link between data source
    // different dataSource, there is no link between data source

    this.setState(
      { transformationLinks: !this.state.transformationLinks },
      () => {
        if (!this.state.transformationLinks) {
          const removedEdgeIDs = this.props.visgraph.edges
            .filter(
              edge =>
                edge.data.type === 'DATA_TRANSFORMED' ||
                edge.data.type === 'SAME_FIELDS' ||
                edge.data.type === 'DIFFERENT_FIELDS',
            )
            .map(edge => edge.id);
          removedEdgeIDs.forEach(id => {
            this.props.removeVisEdge(id);
          });
          return;
        }
        this.setState({ loadTransformationLinks: true });
        const dataEdges = this.props.datagraph.edges.map(edge => ({
          source: edge.source,
          target: edge.target,
        }));
        //
        // connect edges if data transforms are required.
        //
        dataEdges.forEach(edge => {
          const source = edge.source;
          const target = edge.target;

          const sourceNodes = this.props.visgraph.nodes.filter(
            node => node.data.dataSource === source,
          );
          const targetNodes = this.props.visgraph.nodes.filter(
            node => node.data.dataSource === target,
          );

          sourceNodes.forEach(sourceNode => {
            targetNodes.forEach(targetNode => {
              this.props.addVisEdge(
                sourceNode.id,
                targetNode.id,
                'DATA_TRANSFORMED',
              );
            });
          });
        });

        //
        // connect all edges if nothing changes are required (same dataSource)
        //
        const visNodes = this.props.visgraph.nodes;

        for (let i = 0; i < visNodes.length; ++i) {
          for (let j = i + 1; j < visNodes.length; ++j) {
            const node1 = visNodes[i];
            const node2 = visNodes[j];

            if (node1.data.dataSource !== node2.data.dataSource) continue;

            const encoding1 = node1.data.spec.encoding;
            const encoding2 = node2.data.spec.encoding;

            const field1 = FieldExtractorFromEncoding(encoding1);
            const field2 = FieldExtractorFromEncoding(encoding2);
            this.props.addVisEdge(
              node1.id,
              node2.id,
              _.isEqual(field1, field2) ? 'SAME_FIELDS' : 'DIFFERENT_FIELDS',
            );
          }
        }
        this.setState({ loadTransformationLinks: false });
      },
    );
  }

  setRecommendedPath(i)
  {
    const sequences = JSON.parse(sessionStorage.getItem("sequences"));
    const {cost, sequence} = sequences[i];
    
    const removedEdgeIDs = this.props.visgraph.edges.filter(
            edge => edge.data.type === 'RECOMMENDED',
          );
    removedEdgeIDs.forEach(node => {
      this.props.removeVisEdge(node.id);
    });

    sequence.forEach((node, i) => {
      if (i !== 0) {
        this.props.addVisEdge(sequence[i - 1], node, 'RECOMMENDED');
      }
    });
    // set state for cost
    this.setState({cost});

  }
  handleRecommendedSequence() {
    this.setState(
      { recommendedSequence: !this.state.recommendedSequence },
      () => {
        if (!this.state.recommendedSequence) 
        {
          const removedEdgeIDs = this.props.visgraph.edges.filter(
            edge => edge.data.type === 'RECOMMENDED',
          );
          removedEdgeIDs.forEach(node => {
            this.props.removeVisEdge(node.id);
          });
          return;
        } else {
          this.setState({ loadRecommendedSequence: true });
          Axios({
            method: 'post',
            url: `http://localhost:7473/vis/sequenceRecommend`,
            data: {
              charts: this.props.visgraph.nodes.map(node => ({
                ...node.data.spec,
                id: node.id,
              })),
            },
            withCredentials: true,
          })
          .then(response => {
            this.setState({ loadRecommendedSequence: false });
            if (response.statusText !== 'OK') {
              var error = new Error(
                'Error ' + response.status + ': ' + response.statusText,
              );
              error.response = response;
              console.log(err);
              throw error;
            } else {
              return response.data;
            }
          })
          .then(sequence => {
            // sequence
            console.log("recommend sequence ", sequence);
            sessionStorage.setItem("sequences", JSON.stringify(sequence));
            
            this.setRecommendedPath(0);
          })
          .catch(err => console.trace(err));
        }
      },
    );
  }
  render() {
    return (
      <Fragment>
        <div className="app-main">
          <VisSideBar
            toggleNewNodeModal={this.toggleNewNodeModal}
            handleRecommendedSequence={this.handleRecommendedSequence}
            handleTransformationLinks={this.handleTransformationLinks}
            isSequenceRecommended={this.state.recommendedSequence}
            isTransformationLinks={this.state.transformationLinks}
            loadRecommendedSequence={this.state.loadRecommendedSequence}
            loadTransformationLinks={this.state.loadTransformationLinks}
            cost={this.state.cost}
            setRecommendedPath={this.setRecommendedPath}
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
                removeVisNode={this.props.removeVisNode}
                setVisNode={this.props.setVisNode}
                setVisPosition={this.props.setVisPosition}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;
