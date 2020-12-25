import Axios from 'axios';
import { DataSpecsBuilder } from './VegaSpecsBuilder';
import { View, parse } from 'vega';

async function calculateDataset(dataNodeId, datasets) {
  return Axios({
    method: 'get',
    url: `http://localhost:7473/data/subgraph/${dataNodeId}`,
  })
    .then(response => {
      if (response.statusText !== 'OK') {
        var error = new Error(
          'Error ' + response.status + ': ' + response.statusText,
        );
        error.response = response;
        throw error;
      } else {
        return response.data;
      }
    })
    .then(data => {
      // resort to Vega to automatically return the data
      // Vega data is based on a dataflow graph
      const specs = DataSpecsBuilder(data, datasets);
      const view = new View(parse(specs)).renderer('none').initialize();
      view.toSVG();
      const result = view.data(dataNodeId);
      return result;
    })
    .catch(error => {
      alert('Unable to generate data: ' + error.message);
    });
}

export default calculateDataset;
