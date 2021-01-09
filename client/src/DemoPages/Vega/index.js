import React from 'react';
import vegaEmbed from 'vega-embed';
import { v4 as uuidv4 } from 'uuid';
import * as vegaTooltip from 'vega-tooltip';

var tooltipOptions = {
  theme: 'dark',
  offsetX: 0,
};

var handler = new vegaTooltip.Handler(tooltipOptions);

// TODO: change to use react-vega once it is migrated to the latest version of vega-embed
export default class Vega extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: uuidv4(),
    };
  }

  componentDidMount() {
    const { spec, data, signal } = this.props;
    // do a deep copy of spec
    const copiedSpec = JSON.parse(JSON.stringify(spec));
    // do a deep copy of data
    AttachDataToSpec(copiedSpec, JSON.parse(JSON.stringify(data)));
 
    var config = {
      actions: { compiled: false, editor: false, source: false },
      tooltip: handler.call,
      config: { mark: { tooltip: true } },
    };

    vegaEmbed(this.refs[this.state.id], copiedSpec, {
      ...config, patch: (copiedSpec) => {
        if (!copiedSpec.hasOwnProperty("signals"))
        {
          copiedSpec.signals = [];
        }
        console.log(signal);
        if (signal) copiedSpec.signals.push(signal);
        return copiedSpec;
      }
    }).then(result => {
      if (signal)
      {
        result.view.addSignalListener(signal.name, (event, item) => {
          console.log(item);
        });
      }
    }).catch(console.warn);
  }

  componentDidUpdate() {
    const { spec, data, signal } = this.props;
    // do a deep copy of spec
    const copiedSpec = JSON.parse(JSON.stringify(spec));
    // do a deep copy of data
    AttachDataToSpec(copiedSpec, JSON.parse(JSON.stringify(data)));
    var config = {
      actions: { compiled: false, editor: false, source: false },
      tooltip: handler.call,
      config: { mark: { tooltip: true } },
    };

    vegaEmbed(this.refs[this.state.id], copiedSpec, {
      ...config, patch: (copiedSpec) => {
        if (!copiedSpec.hasOwnProperty("signals"))
        {
          copiedSpec.signals = [];
        }
        console.log(signal);
        if (signal) copiedSpec.signals.push(signal);
        return copiedSpec;
      }
    }).then(result => {
      if (signal)
      {
        result.view.addSignalListener(signal.name, (event, item) => {
          console.log(item);
        });
      }
    }).catch(console.warn);
  }

  render() {
    return <div className={this.props.className} ref={this.state.id} />;
  }
}

const AttachDataToSpec = (spec, data) => {
  if (Array.isArray(spec.data)) {
    // if vega 
    for (let i = 0; i < spec.data.length; ++i)
    {
      let item = spec.data[i];
      if (item.values) item.values = data;
      return;
    }
  }
  else {
    // if vega-lite
    spec.data.values = data;
    return;
  }
}