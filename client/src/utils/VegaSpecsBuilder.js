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
                    "label": node.props.name
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
                break;
        }
    }
    return specs;
}