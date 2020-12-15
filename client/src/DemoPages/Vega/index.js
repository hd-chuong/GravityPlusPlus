import React from 'react';
import vegaEmbed from 'vega-embed';
import {v4 as uuidv4} from 'uuid';
// TODO: change to use react-vega once it is migrated to the latest version of vega-embed
export default class Vega extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: uuidv4()
    }
  }
  componentDidMount() {
    const {spec, config} = this.props;
    vegaEmbed(this.refs[this.state.id], spec, config);
  }
  componentDidUpdate() {
    const {spec, config} = this.props;
    vegaEmbed(this.refs[this.state.id], spec, config);
  }
  render() {
    return <div className={this.props.className} ref={this.state.id} />;
  }
}