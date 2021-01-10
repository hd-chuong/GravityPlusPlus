import {GetNodeById, GetOutgoingEdgesFromId} from "./graphUtil";
import calculateDataset from "./dataGeneration";
import AttributeExtractor from "./AttributeExtractor";
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

// finite state machine getter
export function GetState(datasets, datagraph, visgraph, intgraph, intNodeId, params, setter)
{
    const {dataId, visId, intId} = GetGraphIds(datagraph, visgraph, intgraph, intNodeId);
    
    return calculateDataset(dataId, datasets, params).then(({data, params, spec}) => {
        return data;
    }).then((data) => {
        // update signals
        const nextEdges = GetOutgoingEdgesFromId(intgraph, intNodeId);
        const signals = nextEdges.map(edge => edge.data.signal);
        const bindings = nextEdges.map(edge => edge.data.binding);
        
        const events = signals.map((signal, i) => {
            return (event, item) => {
                const nextNodeId = nextEdges[i].target;
                
                // binding signal nanoid to the attribute of the item
                const binding = bindings[i];
                
                const paramDict = Object.keys(binding)
                                .reduce((result, newKey) => ({...result, [newKey]: item[`${binding[newKey]}`]}), {});
                const nextState = GetState(datasets, datagraph, visgraph, intgraph, nextNodeId, paramDict, setter);
                return nextState;
            }
        });
        
        // update spec
        const visNode = GetNodeById(visgraph, visId);

        const thisState = {
            data, 
            spec: visNode.data.spec, 
            signals: signals.map((signal, i) => ({signal, eventHandler: events[i]})),
            intNodeId 
        };
        // ??? 
        setter({...thisState});
        return thisState;
    });
}

 