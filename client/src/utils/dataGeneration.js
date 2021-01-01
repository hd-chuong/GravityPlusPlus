import Axios from 'axios';
import { DataSpecsBuilder } from './VegaSpecsBuilder';
import { View, parse } from 'vega';

async function calculateDataset(dataNodeId, datasets, params = {}) 
{
    return Axios({
        method: "get",
        url: `http://localhost:7473/data/subgraph/${dataNodeId}`,
    }).then(response => {
        if (response.statusText !== "OK")
        {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        } 
        else {
            return response.data;
        }
    })
    .then(data => {
        // resort to Vega to automatically return the data
        // Vega data is based on a dataflow graph
        const spec = DataSpecsBuilder(data, datasets);

        // arm with params
        spec.signals.forEach((signal) => {
            const signalID = signal.name;
            if (params.hasOwnProperty(signalID)) {
                signal.value = params[signalID];
            }
        });
        const view = new View(parse(spec)).renderer("none").initialize();
        view.toSVG();
        const result = view.data(dataNodeId); 
        
        const outputParams = {};
        spec.signals.forEach(signal => outputParams[signal.name] = "");

        return {data: result, params: outputParams};
    })
    .catch(error => {
      console.log('Unable to generate data: ' + error.message);
        
    });
}

export default calculateDataset;
