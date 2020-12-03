// API layer

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
    result = {nodes: [], edges: []}
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
.get((req,res,next) => {
    datagraph
    .getAllNodes()
    .then(result => {
        res.json(result)
    }, err => next(err))
    .catch(err => next(err));
})
.post((req,res,next) => {
    datagraph
    .addNode(req.body.name, req.body.type)
    .then(result => {
        res.json(result)
    }, err => next(err))
    .catch(err => next(err));
});

router.route('/nodes/:nodeID')
.get((req,res,next) => {
    datagraph
    .getNode(parseInt(req.params.nodeID))
    .then(result => {
        res.json(result)
    }, err => next(err))
    .catch(err => next(err));
});

router.route('/edges')
.get((req,res,next) => {
    datagraph
    .getAllEdges()
    .then(result => {
        res.json(result)
    }, err => next(err))
    .catch(err => next(err));
})
.post((req,res,next) => {
    datagraph
    .addEdge(
        req.body.source, 
        req.body.target, 
        req.body.operation
    )
    .then((newEdge) => {res.json(newEdge)},
    err => next(err))
    .catch(err => next(err)
)});

router.route('/edges/:source/:target')
.get((req,res,next) => {
    datagraph
    .getEdge(
        parseInt(req.params.source), 
        parseInt(req.params.target)
    )
    .then(result => {
        res.json(result)
    }, err => next(err))
    .catch(err => next(err));
});


module.exports = router;