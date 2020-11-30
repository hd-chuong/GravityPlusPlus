import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import MetisMenu from 'react-metismenu';
import {ResizableBox} from 'react-resizable';
import ReactFileReader from 'react-file-reader';

import {MainNav, DomainNav, FormsNav, WidgetsNav, ChartsNav, DatasetNav} from './NavItems';

import path from 'path';
import AsyncDataFileHandler from '../../utils/DataFileHandler';

class Nav extends Component {

    constructor(props) 
    {
        super(props);
    }
    state = {};

    handleFiles(files)
    {
        const file = files[0];
        var filename = path.basename(file.name).split('.')[0];       
        AsyncDataFileHandler(file).then((data) => {this.props.addDataset({filename, dataset: data})});
    }

    render() {
        return (
            <Fragment>
                <ResizableBox width={200} height={200}>
                
                <h5 className="app-sidebar__heading">Datasets</h5>
                {/* <MetisMenu content={DatasetNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix=""/> */}
                <div className="metismenu vertical-nav-menu">
                    <ul className="metismenu-container">
                        <li className="metismenu-item" >                            
                            <ReactFileReader handleFiles={this.handleFiles.bind(this)} fileTypes={['.csv', '.json']}>
                                <a className="metismenu-link" target="_blank">
                                    {/* <i className="metismenu-icon pe-7s-diamond"></i> */}
                                    {/* <span className="fa fa-table"> </span> */}
                                    {/* <input type="file" className="btn-primary" placeholder={null}></input> */}
                                    <i className="metismenu-icon fa fa-upload fa-lg"></i> Upload new dataset
                                </a>
                            </ReactFileReader>
                        </li>
                        <li className="metismenu-item">
                            <a className="metismenu-link" target="_blank">
                                <i className="metismenu-icon fa fa-table fa-lg"></i> Current datasets
                            </a>
                        </li>

                    </ul>
                </div>
                
                <h5 className="app-sidebar__heading">Toolbox</h5>
                <MetisMenu content={DomainNav} activeLinkFromLocation className="vertical-nav-menu" iconNamePrefix=""/>
                </ResizableBox>
            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

export default withRouter(Nav);