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

  updateChart()
  {
    const { spec, data, signals} = this.props;

    // console.log(spec, data);
    var copiedSpec = {};

    if (Array.isArray(spec) && spec.length === data.length) {
      copiedSpec = JSON.parse(JSON.stringify(concatTemplates));      
      spec.forEach((spec, i) => {        
        var singleSpec = JSON.parse(JSON.stringify(spec));

        console.log(spec, data[i]);
        // singleSpec.width = "container";
        if (singleSpec.data) delete singleSpec.data.name;
        delete singleSpec.height;
        delete singleSpec.$schema;
        delete singleSpec.description;

        AttachDataToSpec(
          singleSpec, 
          JSON.parse(JSON.stringify(data[i]))
        );
      
        copiedSpec.vconcat.push(singleSpec);
      })
    }
    else 
    {  
      // do a deep copy of spec
      var copiedSpec = JSON.parse(JSON.stringify(spec));
      AttachDataToSpec(copiedSpec, JSON.parse(JSON.stringify(data)));
    }
    // do a deep copy of data
    // console.log(copiedSpec);

    var config = {
      actions: { compiled: true, editor: false, source: false },
      tooltip: handler.call,
      config: { mark: { tooltip: true } },
    };

    vegaEmbed(this.refs[this.state.id], copiedSpec, {
      ...config, patch: (copiedSpec) => {
        if (!copiedSpec.hasOwnProperty("signals"))
        {
          copiedSpec.signals = [];
        }
        if (Array.isArray(signals)) 
        {
          const signalNames = signals.map(signal => signal.signal);
          copiedSpec.signals.push(...signalNames);
        }

        // console.log(copiedSpec);
        return copiedSpec;
      }
    }).then(result => {
      if (Array.isArray(signals))
      {
        signals.forEach(signal => {
          result.view.addSignalListener(signal.signal.name, signal.eventHandler);
        });
      }
    }).catch(console.warn);
  }

  componentDidMount() 
  {    
    this.updateChart();  
  }

  componentDidUpdate() 
  {
    this.updateChart();
  }

  render() {
    return <div className={this.props.className} ref={this.state.id} style={{height: 500, width: 500}}/>;
  }
}

const AttachDataToSpec = (spec, data) => {
  if (Array.isArray(spec.data)) {
    // if vega 
    for (let i = 0; i < spec.data.length; ++i)
    {
      let item = spec.data[i];
      if (item.values) item.values = data;
    }
  }
  else {
    // if vega-lite
    spec.data.values = data;
    return;
  }
}

const concatTemplates = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "vconcat": [],
    "width": "container",
    "height": "container",
}