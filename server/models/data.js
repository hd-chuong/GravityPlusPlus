// business logic layer
const {
  v4: uuidv4
} = require('uuid');

const {
  SetQueryBuilder
} = require("../utils/query");

module.exports = class DataGraph {
  constructor() {
    this.neo4jDriver = null;
  }

  useDriver(neo4jDriver) {
    this.neo4jDriver = neo4jDriver;
  }

  addNode(name, type, source, transform, format) {
    const session = this.neo4jDriver.session();
    const cypher = `
            CREATE 
                (node:DATA_NODE:${type} { id: $id, 
                                        name: $name, 
                                        source: $source, 
                                        transform: $transform, 
                                        createdAt: datetime(),
                                        format: $format }) 
            RETURN 
                node
        `;
    const params = {
      name,
      type,
      id: uuidv4(),
      source,
      transform: JSON.stringify(transform),
      format: JSON.stringify(format)
    };

    return session
      .writeTransaction(tx => tx.run(cypher, params))
      .then(res => {
        if (res.records.length === 0) {
          return null;
        } else {
          let record = res.records[0]["_fields"][0];
          let result = {
            id: record["properties"]["id"],
            types: record["labels"],
            props: record["properties"]
          }
          return result;
        }
      })
      .catch(e => {
        console.log(e)
      });
  }

  getNode(id) {
    const session = this.neo4jDriver.session();

    const cypher = `
            MATCH 
                (node:DATA_NODE) 
            WHERE 
                node.id = $id 
            RETURN node
        `;

    const params = {
      id
    };

    return session.readTransaction(tx => tx.run(cypher, params))
      .then(res => {
        session.close();
        if (res.records.length === 0) {
          return null;
        } else {
          let record = res.records[0]["_fields"][0];
          return {
            id: record["properties"]["id"],
            types: record["labels"],
            props: record["properties"]
          };
        }
      })
      .catch(e => {
        console.log(e)
      });
  }

  removeNode(id) {
    const params = {
      id
    };

    const cypher = `
    MATCH (n: DATA_NODE {id: $id})
    OPTIONAL MATCH(n)-[r]->(children:DATA_NODE)
    DETACH delete n

    WITH children, r
    REMOVE children:JOINED:TRANSFORMED
    SET children:DATA_NODE:RAW, children.source = children.name
    DELETE r
    
    WITH children
    OPTIONAL MATCH (parent:DATA_NODE)-[r: DATA_EDGE]->(children)
    DELETE r
    
    RETURN children  
    `;

    const session = this.neo4jDriver.session();

    return session.writeTransaction(tx => tx.run(cypher, params))
      .then(() => {
        session.close();
        return 0;
      })
      .catch(e => {
        console.log(e)
      });
  }

  getAllNodes() {
    const session = this.neo4jDriver.session();

    const cypher = `
            MATCH 
                (n:DATA_NODE)  
            RETURN 
                n
        `;
    return session.readTransaction(tx => tx.run(cypher))
      .then(res => {
        session.close();
        return res.records.map(rec => {
          var record = rec["_fields"][0];
          return {
            id: record["properties"]["id"],
            types: record["labels"],
            props: record["properties"]
          }
        });
      })
      .catch(e => {
        console.log(e)
      });
  }

  addEdge(source, target, type, operation) {
    const id = uuidv4();
    const params = {
      source,
      target,
      id,
      type,
      operation: JSON.stringify(operation)
    };

    const cypher = `
            MATCH (a:DATA_NODE),(b:DATA_NODE)
            WHERE 
                a.id = $source 
            AND 
                b.id = $target
            CREATE 
                (a)-[r:DATA_EDGE {id: $id, type: $type, operation: $operation}]->(b)
            RETURN 
                r, a.id as source_id, b.id as target_id
        `;

    const session = this.neo4jDriver.session();

    return session.writeTransaction(tx => tx.run(cypher, params))
      .then(res => {
        session.close();
        if (res.records.length === 0) {
          return null;
        } else {
          let record = res.records[0]["_fields"];
          let result = {
            id: record[0].properties.id,
            source: record[1],
            target: record[2],
          }
          console.log(result);
          return result;
        }
      })
      .catch(e => {
        console.log(e)
      });
  }

  getEdge(source, target) {
    // only return one directed edge now
    const session = this.neo4jDriver.session();

    const cypher = `
            MATCH 
                (a:DATA_NODE)-[r:DATA_EDGE]->(b:DATA_NODE)
            WHERE
                a.id = $source
            AND 
                b.id = $target
            RETURN r 
        `;

    const params = {
      source,
      target,
    };

    return session.readTransaction(tx => tx.run(cypher, params))
      .then(res => {
        session.close();
        if (res.records.length === 0) {
          return null;
        } else {
          let record = res.records[0]["_fields"][0];
          return {
            id: record["identity"].toNumber(),
            source: record["start"].toNumber(),
            target: record["end"].toNumber(),
            types: record["type"],
            props: record["properties"]
          };
        }
      })
      .catch(e => {
        console.log(e)
      });
  }

  getAllEdges() {
    const session = this.neo4jDriver.session();

    const cypher = `
                MATCH 
                    (a:DATA_NODE)-[r:DATA_EDGE]->(b:DATA_NODE)
                RETURN 
                    r, a.id as source, b.id as target
            `;

    return session.readTransaction(tx => tx.run(cypher))
      .then(res => {
        session.close();
        return res.records.map(rec => {
          var record = rec["_fields"];
          return {
            type: record[0].type,
            source: record[1],
            target: record[2],
            id: record[0].properties.id,
            props: record[0].properties
          }
        });
      }).catch(e => {
        console.log(e)
      });
  }

  getGraph() {
    this.getAllEdges();
    this.getAllNodes();
  }

  getSubgraphTo(target) {
    const params = {
      id: target
    }

    const cypher = `
        MATCH (p:DATA_NODE {id: $id})
        CALL apoc.path.subgraphNodes(p, {
          relationshipFilter: "DATA_EDGE<",
            minLevel: 0
        })
        yield node
        with node 
        OPTIONAL MATCH (node)<-[r]-(x)
        RETURN node, collect(r) as edge, collect(x.id) as source_id ORDER BY node.createdAt DESC;
      `;
    const session = this.neo4jDriver.session();

    return session.readTransaction(tx => tx.run(cypher, params))
      .then(res => {
        session.close();

        let result = res.records.map(record => ({
          node: {
            id: record["_fields"][0].properties.id,
            props: record["_fields"][0].properties,
            types: record["_fields"][0].labels,
          },
          // exposing id, type and operations
          edges: record["_fields"][1].map((edge, i) => ({
            properties: edge.properties,
            source_id: record["_fields"][2][i]
          }))
        }));
        return result;
      }).catch(e => {
        console.log(e)
      });
  }

  getChildren(nodeId) {
    const params = {
      id: nodeId
    };
    const cypher = `
    MATCH 
      (p:DATA_NODE {id: $id})-[r:DATA_EDGE]->(dest:DATA_NODE)
      return dest.id as id, dest.name as name
    `;
    const session = this.neo4jDriver.session();
    return session.readTransaction(tx => tx.run(cypher, params))
      .then(res => {
        console.log(res.records);
        let result = res.records.map(record => ({
          id: record["_fields"][0],
          name: record["_fields"][1]
        }));
        return result;
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteSubgraphFrom(target) {
    const params = {
      id: target
    }

    const fetchIdCypher = `
        MATCH (p:DATA_NODE {id: $id})
        CALL apoc.path.subgraphNodes(p, {
          relationshipFilter: "DATA_EDGE>",
            minLevel: 0
        })
        yield node 
        with node
        RETURN node.id as id;
      `;

    const deleteIdCypher = `
        MATCH (p:DATA_NODE {id: $id})
        CALL apoc.path.subgraphNodes(p, {
          relationshipFilter: "DATA_EDGE>",
            minLevel: 0
        })
        yield node 
        with node
        DETACH DELETE node;
    `;
    const session = this.neo4jDriver.session();

    return session.readTransaction(tx => tx.run(fetchIdCypher, params))
      .then(res => {
        console.log(res.records);
        let result = res.records.map(record => (
          record["_fields"][0]
        ));
        return result;
      })
      .then(res => {
        session.writeTransaction(tx => tx.run(deleteIdCypher, params))
        return res;
      })
      .catch(e => {
        console.log(e)
      });
  }

  setNodeProperty(nodeId, property)
  {
    const params = {
      id: nodeId,
      // property: SetQueryBuilder("node", property)
    }

    const cypher = `MATCH (node {id: $id}) SET ` + SetQueryBuilder("node", property);
    const session = this.neo4jDriver.session();
    return session.writeTransaction(tx => tx.run(cypher, params))
      .then(res => {
        console.log(res);
        return "UPDATE SUCCESSFUL";
      })
      .catch(e => {
        console.log(e);
        return "UNSUCCESSFUL";
      });
  }
}
