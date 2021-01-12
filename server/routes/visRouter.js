// API layer
const express = require('express');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var Visgraph = require('../models/visualisation');

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

var visgraph = new Visgraph();
visgraph.useDriver(driver);

router.route('/nodes')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    visgraph
      .getAllNodes()
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    const {name, dataSource, spec} = req.body;
    visgraph
      .addNode(name, dataSource, spec)
      .then(result => {
        res.json(result)
      }, err => next(err))
      .catch(err => next(err));
  });

// router.route('/nodes/:nodeID')
//   .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//   .get(cors.cors, (req, res, next) => {
//     datagraph
//       .getNode(req.params.nodeID)
//       .then(result => {
//         res.json(result)
//       }, err => next(err))
//       .catch(err => next(err));
//   })
//   .delete(cors.corsWithOptions, (req, res, next) => {
//     datagraph.removeNode(req.params.nodeID)
//       .then(result => {
//         res.json(result)
//       }, err => next(err))
//       .catch(err => next(err));
//   })
//   .put(cors.corsWithOptions, (req, res, next) => {
//     datagraph.setNodeProperty(req.params.nodeID, req.body)
//       .then(result => {
//         res.json(result)
//       }, err => next(err))
//       .catch(err => next(err));
//   })

  // sequence recommendation services
router.route('/sequenceRecommend')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.cors, (req, res, next) => {
    var charts = req.body.charts;
    const process = fork("./services/sequenceRecommendation.js");
    process.send({
      charts
    });

    // listen for message from forked process
    process.on("message", (message) => {
      console.log(message.result);
      res.json(message.result);
    });
  });


module.exports = router;
