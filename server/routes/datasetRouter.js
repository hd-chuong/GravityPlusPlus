// API layer
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('./cors');
var path = require('path');
const {
  v4: uuiv4
} = require('uuid');
const router = express.Router();

router.use(bodyParser.json({
  limit: '50mb'
}));

const addHeader = async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://gravity2020.netlify.app/');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.session.name) {
    next();
  } else {
    console.log("Unknown dataname");
    next(new Error("Unknown database name"));
  }
}

router.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, addHeader, (req, res, next) => {
    const projName = req.session.name;

    for (const {
        dataset,
        name
      } of req.body) {
      // asynchronous
      fs.writeFile(__dirname + `/../data/${projName}/data/${uuiv4()}.json`, JSON.stringify({
        dataset,
        name
      }), (err) => {
        if (err) throw err;
      });
    }

    res.sendStatus(200);
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
