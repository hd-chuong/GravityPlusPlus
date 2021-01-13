// API layer
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('./cors');
var path = require('path');
const router = express.Router();

router.use(bodyParser.json());

router.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, (req, res, next) => {
    const {data, name} = req.body;
    fs.writeFile(__dirname + `/../data/${name}.json`, JSON.stringify(data), (err) => {
        if (err) throw err;
        res.end("write finished");
    });
  });  

router.route('/:datasetName')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    fs.readFile(__dirname + `/../data/${req.params.datasetName}.json`, (err, data) => {
        if (err) throw err;
        let dataset = JSON.parse(data);
        res.json(dataset);
    });
  });


module.exports = router;
