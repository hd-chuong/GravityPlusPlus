// business logic layer

// var neo4j = require('neo4j-driver');

module.exports = class DataGraph { 
    constructor()
    {
        this.neo4jDriver = null;
    }

    useDriver(neo4jDriver)
    {
        this.neo4jDriver = neo4jDriver;
    }

    addNode(name, type)
    {
        const session = this.neo4jDriver.session();
        const cypher = `
            CREATE 
                (node:DATA_NODE:${type} { name: $name}) 
            RETURN 
                toInteger(ID(node)) as id
        `;
        const params = {name, type};

        return session.writeTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            return res.records[0]["_fields"][0].toNumber();
        })
        .catch(e => {console.log(e)});
    }

    getNode(id)
    {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH 
                (node:DATA_NODE) 
            WHERE 
                id(node) = $id 
            RETURN node
        `;
        
        const params = {id};

        return session.readTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            if (res.records.length === 0)
            {
                return null;
            }
            else 
            {
                let record = res.records[0]["_fields"][0];
                return {
                    id: record["identity"].toNumber(),
                    types: record["labels"],
                    props: record["properties"]
                };
            }
        })
        .catch(e => {console.log(e)});
    }

    getAllNodes()
    {
        const session = this.neo4jDriver.session();

        const cypher = `
            MATCH 
                (n:DATA_NODE)  
            RETURN 
                n
        `;
        return session.readTransaction( tx => tx.run(cypher))
        .then(res => {
            session.close();
            return res.records.map(rec => {
                var record = rec["_fields"][0];
                return {
                    id: record["identity"].toNumber(),
                    types: record["labels"],
                    props: record["properties"]
                }
            });
        })
        .catch(e => {console.log(e)});
    }
    addEdge(source, target, operation)
    {
        const session = this.neo4jDriver.session();
        const cypher = `
            MATCH (a:DATA_NODE),(b:DATA_NODE)
            WHERE 
                id(a) = $source 
            AND 
                id(b) = $target
            CREATE 
                (a)-[r:DATA_EDGE { operation: $operation}]->(b)
            RETURN 
                r
        `;

        const params = {
                source, 
                target, 
                operation: JSON.stringify(operation) 
            };

        return session.writeTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            if (res.records.length === 0)
            {
                return null;
            }
            else 
            {
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
        .catch(e => {console.log(e)});
    }

    getEdge(source, target)
    {
        // only return one directed edge now
        const session = this.neo4jDriver.session();

        const cypher = `
            MATCH 
                (a:DATA_NODE)-[r:DATA_EDGE]->(b:DATA_NODE)
            WHERE
                id(a) = $source
            AND 
                id(b) = $target
            RETURN r 
        `;
        
        const params = {
                source, 
                target, 
            };

        return session.readTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            if (res.records.length === 0)
            {
                return null;
            }
            else 
            {
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
        .catch(e => {console.log(e)});
    }

    getAllEdges()
    {
        const session = this.neo4jDriver.session();

        const cypher = `
                MATCH 
                    (a:DATA_NODE)-[r:DATA_EDGE]->(b:DATA_NODE)
                RETURN 
                    r
            `;

        return session.readTransaction( tx => tx.run(cypher))
        .then(res => {
            // console.log(res.records);
            session.close();
            return res.records.map(rec => {
                var record = rec["_fields"][0];
                return {
                    id: record["identity"].toNumber(),
                    source: record["start"].toNumber(),
                    target: record["end"].toNumber(),
                    types: record["type"],
                    props: record["properties"]
                }
            });
        })
        .catch(e => {console.log(e)});
    }

    getGraph()
    {
        this.getAllEdges();
        this.getAllNodes();
    }
}