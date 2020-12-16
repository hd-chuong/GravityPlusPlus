import {v4 as uuidv4} from 'uuid';

export const AggregationMethods = [
    "count", 
    "valid", 
    "missing", 
    "distinct", 
    "sum", 
    "product",
    "mean",
    "average",
    "variance",
    "variancep",
    "stdev",
    "stdevp",
    "stderr",
    "median",
    "q1",
    "q3",
    "ci0",
    "ci1",
    "min",
    "max",
    "argmin",
    "argmax",
    "values"
];

export const JoinTypes = [
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    // "OUTER JOIN"
];

function GetDatasetByName(datasets, filename)
{
    // datasets as an array
    let matched =  datasets.filter(dataset => dataset.name === filename);
    if (matched.length < 1) return null;
    else return matched[0].dataset;
}

export function DataSpecsBuilder(subgraph, datasets)
{
    const specs = {data: []}
    for (let i = subgraph.length - 1; i >= 0; --i)
    {
        let record = subgraph[i];
        let node = record.node;
        let edge = record.edges;
        
        switch(edge.length)
        {
            // case raw node
            case 0:
                specs.data.push({
                    "name": node.id,
                    "values": GetDatasetByName(datasets, node.props.source),
                    "label": node.props.name,
                    "format": JSON.parse(node.props.format)
                });
                break;
            
            // transformed
            case 1:
                specs.data.push({
                    "name": node.id,
                    "source": edge[0].source_id,
                    "transform": [JSON.parse(edge[0].properties.operation)] 
                })
                break;

            case 2:
                console.log("JOIN operations will be treated here")
                console.log(node.props);
                specs.data.push({
                    "name": node.id,
                    "source": node.props.source,
                    "transform": JSON.parse(node.props.transform)
                })
                console.log(JSON.stringify(JSON.parse(node.props.transform), null, 4));
                break;
        }
    }
    // console.log(JSON.stringify(specs, null, 4));

    return specs;
}

// JOINING based on either 
// LEFT JOIN, 
// RIGHT JOIN, 
// INNER JOIN, 
// OUTER JOIN
export function JoinSpecsBuilder(leftNode, rightNode, joinType)
{
    const {id: leftId, attribute: leftAttribute, headers: leftHeaders, name: leftDatasetName} = leftNode;
    const {id: rightId, attribute: rightAttribute, headers: rightHeaders, name: rightDatasetName} = rightNode;
    
    var pseudoAttribute = uuidv4();

    var newLeftHeaders = leftHeaders.map((header) => `${leftDatasetName}_${header}`);
    var newRightHeaders = rightHeaders.map((header) => `${rightDatasetName}_${header}`);
    
    switch(joinType)
    {
        case "LEFT JOIN":
            return [
                    {
                        "type": "project",
                        "fields": leftHeaders,
                        "as": newLeftHeaders,
                    },
                    {
                        "type": "lookup",
                        "key": rightAttribute,
                        "from": rightId,
                        "fields": [`${leftDatasetName}_${leftAttribute}`], 
                        "values": rightHeaders.filter((header) => (header !== rightAttribute)),
                        "as": rightHeaders.filter((header) => (header !== rightAttribute)).map((header) => `${rightDatasetName}_${header}`)
                    }
                ]    

        case "RIGHT JOIN":
            return [
                {
                    "type": "project",
                    "fields": rightHeaders,
                    "as": newRightHeaders,
                },
                {
                    "type": "lookup",
                    "key": leftAttribute,
                    "from": leftId,
                    "fields": [`${rightDatasetName}_${rightAttribute}`], 
                    "values": leftHeaders.filter((header) => (header !== leftAttribute)),
                    "as": leftHeaders.filter((header) => (header !== leftAttribute)).map((header) => `${leftDatasetName}_${header}`)
                }
            ]
        
        case "INNER JOIN":
            return [
                {
                    "type": "project",
                    "fields": leftHeaders,
                    "as": newLeftHeaders,
                },
                {
                    "type": "lookup",
                    "key": rightAttribute,
                    "from": rightId,
                    "fields": [`${leftDatasetName}_${leftAttribute}`], 
                    "as": [pseudoAttribute] 
                },
                {
                    "type": "filter",
                    "expr": `isValid(datum[\"${pseudoAttribute}\"])`
                },
                {
                    "type": "project",
                    "fields": [...newLeftHeaders, ...rightHeaders.filter((header) => (header !== rightAttribute)).map((header) => `${pseudoAttribute}.${header}`)],
                    "as":     [...newLeftHeaders, ...newRightHeaders.filter((header) => (header !== `${rightDatasetName}_${rightAttribute}`))]
                }
            ]
        // case "OUTER JOIN":
        default:
            return []
    }
}