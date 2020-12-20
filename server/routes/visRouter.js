// API layer
const express = require('express');
const bodyParser = require('body-parser');
const { RecommendSequence } = require('../services/sequenceRecommendation');

// cors.cors for all GET methods
// cors.corsWithOptions for all other
const cors = require('./cors');

const router = express.Router();
router.use(bodyParser.json());

router.route('/sequenceRecommend')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.cors, (req, res, next) => {
    var charts = req.body.charts;
    RecommendSequence(charts).then(result => {
      res.json(result);
    }, err => res.json(err))
    .catch(err => res.json(err));
});


module.exports = router;