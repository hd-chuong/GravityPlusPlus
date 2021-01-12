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

driver = neo4j.driver(
  "bolt://gravity-neo4j",
  neo4j.auth.basic("neo4j", "test")
);

var datagraph = new Datagraph();
datagraph.useDriver(driver);

router.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    result = {
      nodes: [],
      edges: []
    }
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
  .get(cors.cors, (req, res, next) => {
    datagraph
      .getAllNodes()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    datagraph
      .addNode(req.body.name, req.body.type, req.body.source, req.body.transform, req.body.format)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

router.route('/nodes/:nodeID')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    datagraph
      .getNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    datagraph.removeNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    datagraph.setNodeProperty(req.params.nodeID, req.body)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })

router.route('/edges')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    datagraph
      .getAllEdges()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
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
  .get(cors.cors, (req, res, next) => {
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
  .get(cors.cors, (req, res, next) => {
    datagraph
      .getSubgraphTo(req.params.target)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
// .delete(cors.cors, (req, res, next) => {
//   datagraph
//     .deleteSubgraphFrom(req.params.target)
//     .then(result => {
//       res.json(result)
//     }, err => next(err))
//     .catch(err => next(err));
// });

router.route("/nodes/:nodeId/children")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    datagraph
      .getChildren(req.params.nodeId)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

module.exports = router;
