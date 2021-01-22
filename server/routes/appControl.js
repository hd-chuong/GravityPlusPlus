// API layer
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('./cors');
var path = require('path');
const router = express.Router();
router.use(bodyParser.json());

router.all('*', (req,res,next)=> {
  next();
})

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get((req,res,next) => {
    let files = fs.readdir(__dirname + `/../data/`, (err, files) => {
      files = files.filter(file => file !== '.gitignore');
      if (err) next(err);
      res.json(files);
    })
  })  
  .post((req, res, next) => {
    const {name} = req.body;
    // console.log("id", req.sessionID);

    console.log(req.cookies);
    const dir = __dirname + `/../data/${name}`;

    if (!fs.existsSync(dir))
    {
      fs.mkdirSync(dir);
      fs.mkdirSync(dir + "/data/");
      req.session.name = name;
      res.json(req.session);
    }
    else {
      res.json({error: "Name already exists"}); 
      // next(new Error(`Project with ${name} has already existed.`));
    }
    
    console.log(req.sessionID);
    // console.log(req.session);
  })

router.route('/:projectName')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    fs.readFile(__dirname + `/../data/${req.params.datasetName}.json`, (err, data) => {
        if (err) throw err;
        let dataset = JSON.parse(data);
        res.json(dataset);
    });
  });


module.exports = router;
