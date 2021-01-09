import {GetNodeById, GetOutgoingEdgesFromId} from "./graphUtil";
import {calculateDataset} from "./dataGeneration";
// each state includes:
// the data (after parameterized)
// the specs
// the list of interaction available in form of signal
export function GetGraphIds(datagraph, visgraph, intgraph, intNodeId)
{
    const intNode = GetNodeById(intgraph, intNodeId);
    if (!intNode) return null;

    const visNodeIds = intNode.data.source;

    const visNodes = visNodeIds.map(visId => GetNodeById(visgraph, visId));
    const dataNodeIds = visNodes.map(node => node.data.dataSource);
    
    const dataId = dataNodeIds[0];

    return {dataId, visId: visNodeIds[0], intId: intNodeId};
}

export function GetState(datasets, datagraph, visgraph, intgraph, intNodeId, params)
{
    const {dataId, visId, intId} = GetGraphIds(datagraph, visgraph, intgraph, intNodeId);

    var result = {};

    calculateDataset(dataId, datasets, params).then(({data, params, spec}) => {
        result.data = data;
    })

    const visNode = GetNodeById(visgraph, visId);
    result.spec = visNode.data.spec;
    
    const nextEdges = GetOutgoingEdgesFromId(intgraph, intNodeId);
    const signals = nextEdges.map(edge => edge.data.signal);

    return result;
}

