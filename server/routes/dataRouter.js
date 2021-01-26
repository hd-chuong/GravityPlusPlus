// API layer
const express = require('express');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var Datagraph = require('../models/data');

// cors.cors for all GET methods
// cors.corsWithOptions for all other
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

// inside a docker container, please use
driver = neo4j.driver(
  "bolt://gravity-neo4j",
  neo4j.auth.basic("neo4j", "test")
);

// driver = neo4j.driver(
//   "bolt://0.0.0.0:7687",
//   neo4j.auth.basic("neo4j", "test")
// );

var datagraph = new Datagraph();
datagraph.useDriver(driver);

const addHeader = async (req, res, next) => {
  console.log("session name: ", req.session.name, "session id: ", req.sessionID);
  res.header('Access-Control-Allow-Origin', 'http://localhost:7472');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.session.name)
  {
    const result = await datagraph.useDatabase(req.session.name); 
    next();
  }
  else 
  {
    console.log("Unknown dataname");
    next(new Error("Unknown database name"));
  }
}

router.route('/')
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, addHeader, (req, res, next) => {
    result = {
      nodes: [],
      edges: []
    };
    datagraph
      .getAllNodes()
      .then(allNodes => {
        result.nodes = allNodes;
        return datagraph.getAllEdges()
      })
      .then(allEdges => {
        result.edges = allEdges;
        res.json(result);
      }, err => next(err))
      .catch(err => next(err));
});

router.route('/nodes')
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getAllNodes()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, addHeader, (req, res, next) => {
    datagraph
      .addNode(req.body.name, req.body.type, req.body.source, req.body.transform, req.body.format)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

router.route('/nodes/:nodeID')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, addHeader, (req, res, next) => {
    datagraph.removeNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, addHeader, (req, res, next) => {
    datagraph.setNodeProperty(req.params.nodeID, req.body)
    .then(result => {
      res.json(result)
    }, err => next(err))
    .catch(err => next(err));
  });

router.route('/edges')
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getAllEdges()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, addHeader, (req, res, next) => {
    datagraph
      .addEdge(
        req.body.source,
        req.body.target,
        req.body.type,
        req.body.operation
      )
      .then((newEdge) => {
          res.json(newEdge)
        },
        err => next(err))
      .catch(err => next(err))
  });

router.route('/edges/:source/:target')
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getEdge(
        req.params.source, req.params.target
      )
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

router.route('/subgraph/:target')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getSubgraphTo(req.params.target)
      .then(result => {
        res.json(result);
      }, err => next(err))
      .catch(err => next(err));
  })

router.route("/nodes/:nodeId/children")
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, addHeader, (req, res, next) => {
    datagraph
      .getChildren(req.params.nodeId)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = router;