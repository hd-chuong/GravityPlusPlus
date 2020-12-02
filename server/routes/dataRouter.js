const express = require('express');
const bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var Datagraph = require('../models/data');

const router = express.Router();

router.use(bodyParser.json());

driver = neo4j.driver(
    "bolt://gravity-neo4j", 
    neo4j.auth.basic("neo4j", "test")
);

var datagraph = new Datagraph();
datagraph.useDriver(driver);

router.route('/')
.get((req,res,next) => {
    datagraph.getGraph();
});

router.route('/nodes')
.get((req,res,next) => {
    datagraph.getAllNodes();
});

router.route('/nodes/:nodeID')
.get((req,res,next) => {
    datagraph.getNode(parseInt(req.params.nodeID));
});

router.route('/edges')
.get((req,res,next) => {
    datagraph.getAllEdges();
});

router.route('/edges/:source/:target')
.get((req,res,next) => {
    datagraph.getEdge(
        parseInt(req.params.source), 
        parseInt(req.params.target)
    );
});

module.exports = router;