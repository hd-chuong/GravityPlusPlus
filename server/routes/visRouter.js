// API layer
const express = require('express');
const bodyParser = require('body-parser');

// cors.cors for all GET methods
// cors.corsWithOptions for all other
const cors = require('./cors');
const {
  fork
} = require("child_process");

const router = express.Router();
router.use(bodyParser.json());

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
