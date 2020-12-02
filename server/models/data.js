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
                id(node) as id
        `;
        const params = {name, type};

        session.writeTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            return res;
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
            RETURN id(node)
        `;
        
        const params = {id};

        session.readTransaction( tx => tx.run(cypher, params))
        .then(res => {
            console.log(res);
            session.close();
            return res;
        })
        .catch(e => {console.log(e)});
    }

    addEdge(source, target, type, operation)
    {
        const session = this.neo4jDriver.session();
        const cypher = `
            MATCH (a:DATA_NODE),(b:DATA_NODE)
            WHERE 
                id(a) = $source 
            AND 
                id(b) = $target
            CREATE 
                (a)-[r:DATA_EDGE:${type} { operation: $operation}]->(b)
            RETURN 
                type(r) as type, r.operation as operation
        `;

        const params = {
                source, 
                target, 
                operation: JSON.stringify(operation) 
            };

        session.writeTransaction( tx => tx.run(cypher, params))
        .then(res => {
            session.close();
            return res;
        })
        .catch(e => {console.log(e)});
    }

    getEdge(source, target)
    {
        const session = this.neo4jDriver.session();

        const cypher = `
            MATCH 
                (a:DATA_NODE)-[r:DATA_EDGE]->(b:DATA_NODE)
            WHERE
                id(a) = $source
            AND 
                id(b) = $target
            RETURN type(r) as type, r.operation as operation 
        `;
        
        const params = {
                source, 
                target, 
            };

        session.readTransaction( tx => tx.run(cypher, params))
        .then(res => {
            console.log(res.records);
            session.close();
            return res;
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

        session.readTransaction( tx => tx.run(cypher))
        .then(res => {
            console.log(res.records);
            session.close();
            return res;
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

        session.readTransaction( tx => tx.run(cypher))
        .then(res => {
            console.log(res);
            session.close();
            return res;
        })
        .catch(e => {console.log(e)});
    }

    getGraph()
    {
        this.getAllEdges();
        this.getAllNodes();
    }
}