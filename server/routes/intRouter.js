// API layer
const express = require('express');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var Intgraph = require('../models/interaction');

// cors.cors for all GET methods
// cors.corsWithOptions for all other
const cors = require('./cors');
const {
  fork
} = require("child_process");

const router = express.Router();
router.use(bodyParser.json());

const driver = neo4j.driver(
  "bolt://gravity-neo4j",
  neo4j.auth.basic("neo4j", "test")
);

var intgraph = new Intgraph();
intgraph.useDriver(driver);

router.route('/nodes')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    intgraph
      .getAllNodes()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    const {name, source} = req.body;
    intgraph
      .addNode(name, source)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

router.route('/nodes/:nodeID')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    intgraph
      .getNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    intgraph.removeNode(req.params.nodeID)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    intgraph.setNodeProperty(req.params.nodeID, req.body)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })

router.route('/edges')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    intgraph
    .getAllEdges()
    .then(result => {
    res.json(result)
    }, err => next(err))
    .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
    const {source, target, signal, binding, label} = req.body;
    intgraph
    .addEdge(
    source,
    target,
    signal,
    binding, 
    label
    )
    .then((newEdge) => {
        res.json(newEdge)
    },
    err => next(err))
    .catch(err => next(err))
})  

router.route('/edges/:edgeID')
.put(cors.corsWithOptions, (req, res, next) => {
    intgraph
    .setEdgeProperty(req.params.edgeID, req.body)
    .then(result => {
        res.json(result)
        }, err => next(err))
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    intgraph
    .removeEdge(req.params.edgeID)
    .then(result => {
        res.json(result)
        }, err => next(err))
    .catch(err => next(err));
});

module.exports = router;
