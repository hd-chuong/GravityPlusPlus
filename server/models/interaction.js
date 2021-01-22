// business logic layer
const {
    v4: uuidv4
  } = require('uuid');
  
const {
    SetQueryBuilder
} = require("../utils/query");

const {toNumber} =require('neo4j-driver/lib/integer.js');

module.exports = class IntGraph {
    constructor() {
      this.neo4jDriver = null;
    }
  
    useDriver(neo4jDriver) {
      this.neo4jDriver = neo4jDriver;
    }

    useDatabase(name)
    {
      //
      // should close the new session
      //    
      const newSession = this.neo4jDriver.session();
      
      return newSession
        .readTransaction(tx => tx.run(`SHOW DATABASES`))
        .then(res => {
          const dbLists = res.records.map(record => record._fields[0]);     
          
          if (dbLists.includes(name)) 
          {
            this.dbName = name;
          }
          else 
          {
            throw new Error("Can not find the database");
          }
  
        }).catch(e => {
          console.log(e);
        }).finally(() => {
          newSession.close();
        });
    }
  
    getSession()
    {
      return this.neo4jDriver.session({database: this.dbName});
    }
  
    addNode(name, source) {
      const session = this.getSession();
      const cypher = `
              CREATE 
                  (node:INT_NODE { id: $id, 
                                          name: $name, 
                                          source: $source
                                          }) 
              RETURN 
                  node
          `;
      const params = {
        id: uuidv4(),
        name,
        source: JSON.stringify(source),
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
      const session = this.getSession();
  
      const cypher = `
              MATCH 
                  (node:INT_NODE) 
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
        MATCH (n: INT_NODE {id: $id})
        DETACH delete n
      `;
  
      const session = this.getSession();
  
      return session.writeTransaction(tx => tx.run(cypher, params))
        .then(() => {
          session.close();
          return 0;
        })
        .catch(e => {
          console.log(e)
        });
    }

    removeEdge(id) {
      const params = {
        id
      };
  
      const cypher = `
        MATCH (n) - [edge {id: $id}] -> (m)
        DETACH delete edge
      `;
  
      const session = this.getSession();
  
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
      const session = this.getSession();
  
      const cypher = `
              MATCH 
                  (n:INT_NODE)  
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
  
    addEdge(source, target, signal, binding, label) {
      const params = {
        source,
        target,
        id: uuidv4(),
        signal: JSON.stringify(signal),
        binding: JSON.stringify(binding),
        label
      };
  
      const cypher = `
              MATCH (a:INT_NODE),(b:INT_NODE)
              WHERE 
                  a.id = $source 
              AND 
                  b.id = $target
              CREATE 
                  (a)-[r:INT_EDGE {
                        id: $id, 
                        signal: $signal,
                        binding: $binding,
                        label: $label
                    }]->(b)
              RETURN 
                  r, a.id as source_id, b.id as target_id
          `;
  
      const session = this.getSession();
  
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
  
    getEdge(id) {
      // only return one directed edge now
      const session = this.getSession();
  
      const cypher = `
            MATCH (n)-[r:INT_EDGE {id: $id}]->(m) return r 
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
              id: record.properties.id,
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
      const session = this.getSession();
  
      const cypher = `
                  MATCH 
                      (a:INT_NODE)-[r:INT_EDGE]->(b:INT_NODE)
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
      const graph = {
        edges: [],
        nodes: []
      }
  
      return this.getAllNodes().then(res => {
        graph.nodes = res.map(node => {
          let {id, props} = node;
          let {name, source, x, y} = props;

          x = (x && parseInt(x)) || Math.random() * 100;
          y = (y && parseInt(y)) || Math.random() * 100;
          return {
            id,
            type: "default",
            data: {
              label: name,
              source: JSON.parse(source),
            },
            position: {
              x, y
            }
          }
        });
        return this.getAllEdges();
      })
      .then(res => {
        graph.edges = res.map(edge => {
          const {source, target, id, props} = edge;
          let {binding, label, signal} = props;
          
          binding = JSON.parse(binding);
          signal = JSON.parse(signal);

          return {
            source,
            target,
            id,
            label,
            data: {
              binding, signal
            }
          }
        });
        return graph;
      });
    }
  
    
    setNodeProperty(nodeId, property)
    {
      const params = {
        id: nodeId,
        // property: SetQueryBuilder("node", property)
      }
  
      const cypher = `MATCH (node {id: $id}) SET ` + SetQueryBuilder("node", property);
      const session = this.getSession();
      return session.writeTransaction(tx => tx.run(cypher, params))
        .then(res => {
          return "UPDATE SUCCESSFUL";
        })
        .catch(e => {
          console.log(e);
          return "UNSUCCESSFUL";
        });
    }

    setEdgeProperty(edgeId, property)
    {
      const params = {
        id: edgeId,
      }
  
      const cypher = `MATCH (source)-[edge {id: $id}]->(target) SET ` + SetQueryBuilder("edge", property);
      const session = this.getSession();
      return session.writeTransaction(tx => tx.run(cypher, params))
        .then(res => {
          console.log(res);
          return "SUCCESSFUL EDGE UPDATE";
        })
        .catch(e => {
          console.log(e);
          return "UNSUCCESSFUL EDGE UPDATE";
        });
    }
  }
  