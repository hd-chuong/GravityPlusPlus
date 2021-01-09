export const GetNodeById = (graph, id) => {
    if (!Array.isArray(graph.nodes)) return null;
    const nodeList = graph.nodes.filter(node => node.id === id);
    if (nodeList.length > 0) return nodeList[0];
    else return null; 
  };
  
export const GetOutgoingEdgesFromId = (graph, id) => {
    if (!Array.isArray(graph.edges)) return null;
    return graph.edges.filter((edge) => edge.source === id);
}