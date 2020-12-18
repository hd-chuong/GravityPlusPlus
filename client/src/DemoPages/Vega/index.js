import React from 'react';
import vegaEmbed from 'vega-embed';
import {v4 as uuidv4} from 'uuid';
import * as vegaTooltip from "vega-tooltip";

var tooltipOptions = {
  theme: "dark",
  offsetX: 0
};
var handler = new vegaTooltip.Handler(tooltipOptions);


// TODO: change to use react-vega once it is migrated to the latest version of vega-embed
export default class Vega extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: uuidv4()
    }
  }
  
  componentDidMount() {    
    const {spec, data} = this.props;

    // do a deep copy of spec
    const copiedSpec = JSON.parse(JSON.stringify(spec));
    // do a deep copy of data
    copiedSpec.data.values = JSON.parse(JSON.stringify(data));
    var config = {actions: {compiled: false, editor: false, source: false}, tooltip: handler.call, config: {mark: {tooltip: true}}};
    vegaEmbed(this.refs[this.state.id], copiedSpec, config);
  }

  componentDidUpdate() {
    const {spec, data} = this.props;

    // do a deep copy of spec
    const copiedSpec = JSON.parse(JSON.stringify(spec));
    // do a deep copy of data
    copiedSpec.data.values = JSON.parse(JSON.stringify(data));
    var config = {actions: {compiled: false, editor: false, source: false}, tooltip: handler.call, config: {mark: {tooltip: true}}};
    vegaEmbed(this.refs[this.state.id], copiedSpec, config);
  }

  render() {
    return <div className={this.props.className} ref={this.state.id} />;
  }
}