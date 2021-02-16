import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import MetisMenu from 'react-metismenu';
// import ReactFileReader from 'react-file-reader';

import path from 'path';
import AsyncDataFileHandler from '../../utils/DataFileHandler';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  state = {};

  handleFiles(event) {
    const {files} = event.target;
    // const file = files[0];
    files.forEach(file => {
      var filename = path.basename(file.name).split('.')[0];
      AsyncDataFileHandler(file).then(data => {
        this.props.addDataset({ name: filename, dataset: data });
      });
    })
  }

  render() {
    return (
      <Fragment>
        <h5 className="app-sidebar__heading">Datasets</h5>
        <div className="metismenu vertical-nav-menu">
          <ul className="metismenu-container">
            <li className="metismenu-item">
              {/* <ReactFileReader
                handleFiles={this.handleFiles.bind(this)}
                fileTypes={['.csv', '.json']}
              > */}
                <input 
                  type="file" 
                  multiple
                  accept=".json,.csv" 
                  ref={input=> this.uploadButton = input}
                  style={{display: "none"}} 
                  onChange={this.handleFiles.bind(this)}
                />
                <a className="metismenu-link" target="_blank" onClick={() => {this.uploadButton.click()}}>
                  <i className="metismenu-icon fa fa-upload fa-lg"></i> Upload
                  new dataset
                </a>
              {/* </ReactFileReader> */}
            </li>
          </ul>
        </div>
        <MetisMenu
          content={[
            {
              icon: 'fa fa-table',
              label: 'Current datasets',
              content: this.props.datasets.datasets.map(record => ({
                label: record.name,
              })),
            },
          ]}
          active
          className="vertical-nav-menu"
          iconNamePrefix=""
        />

        <h5 className="app-sidebar__heading">Toolbox</h5>
        <div className="metismenu vertical-nav-menu" active>
          <ul className="metismenu-container">
            <li
              className="metismenu-item"
              onClick={this.props.toggleNewNodeModal}
            >
              <div className="metismenu-link" target="_blank">
                <i className="metismenu-icon fa fa-asterisk fa-lg"></i> Add new
                Node
              </div>
            </li>
          </ul>
        </div>

        {/* <MetisMenu  content={DomainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix=""/> */}
      </Fragment>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Nav);
