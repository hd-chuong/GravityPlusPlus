// API layer
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('./cors');
var path = require('path');
var glob = require('glob');
var Datagraph = require('../models/data');
var Visgraph = require('../models/visualisation');
var Intgraph = require('../models/interaction');

const {after} = require('underscore');
// neo4j driver
var neo4j = require('neo4j-driver');

// inside a docker container, please use
driver = neo4j.driver(
  "bolt://gravity-neo4j",
  neo4j.auth.basic("neo4j", "test")
);

// driver = neo4j.driver(
//   "bolt://0.0.0.0:7687",
//   neo4j.auth.basic("neo4j", "test")
// );

var datagraph = new Datagraph();
datagraph.useDriver(driver);

var visgraph = new Visgraph();
visgraph.useDriver(driver);

var intgraph = new Intgraph();
intgraph.useDriver(driver);

const router = express.Router();
router.use(bodyParser.json());

const addHeader = async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:7472');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get((req, res, next) => {
  const newSession = driver.session();
  newSession.readTransaction(tx => tx.run(`SHOW DATABASES`))
    .then(result => {
      const dbLists = result.records.map(record => record._fields[0])
                                    .filter(name => !["neo4j", "system"].includes(name));     
      res.json(dbLists);
      console.log("Successfully retrieve all project details");
    }).catch(e => {
      console.error(`Failed to retrieve all project details ${e}`);
    }).finally(() => {
      newSession.close();
  });
})  
.post((req, res, next) => {
  const {name} = req.body;
  const dir = __dirname + `/../data/${name}`;

  if (!fs.existsSync(dir))
  {
    // create the directory
    fs.mkdirSync(dir);
    fs.mkdirSync(dir + "/data/");
    
    const session = driver.session();

    session.writeTransaction(tx => {
      tx.run(`CREATE DATABASE $name`, {name});    
    })
    .then(res => {
    })
    .catch(e => {
      console.log(e);
    })
    .finally(() => {
      console.log("close in app control"); 
      session.close();
    });
    
    req.session.name = name;
    res.json(req.session);
  
  }
  else {
    res.json({error: "Name already exists"}); 
  }
})

router.route('/:projectName')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, addHeader, (req, res, next) => {
  const state = {
    datasets: {
      datasets: [],
      errMess: null
    },
    datagraph: {
      datagraph: {},
      errMess: null
    },
    visgraph: {
      visgraph: {},
      errMess: null
    },
    intgraph: {
      intgraph: {},
      errMess: null
    }
  };
  const {projectName: projName} = req.params;
  
  req.session.name = projName;
  const finished = after(4, () => res.json({...req.session, ...state}));

  // get the datagraph
  datagraph.useDatabase(projName).then(() => {
    datagraph.getGraph().then((dgraph) => {
      state.datagraph.datagraph = dgraph;
      finished();
    });
  });

  // get visgraph
  visgraph.useDatabase(projName).then(() => {
    visgraph.getGraph().then((vgraph) => {
      state.visgraph.visgraph = vgraph;
      finished();
    })
  });

  // get intgraph
  intgraph.useDatabase(projName).then(() => {
    intgraph.getGraph().then((igraph) => {
      state.intgraph.intgraph = igraph;
      finished();
    })
  });
  
  glob(__dirname + `/../data/${req.params.projectName}/data/*.json`, function(err, files) { // read the folder or folders if you want: example json/**/*.json
    if(err) {
      console.log("cannot read the folder, something goes wrong with glob", err);
    }
    
    // note: when after argument === 0, it does not automatically invoke finished.
    // have to place a conditional check
    
    if (files.length === 0) finished();
    const readAllJSONFiles = after(files.length, () => finished());
    files.forEach(function(file) {
      fs.readFile(file, 'utf8', function (err, data) { // Read each file
        if (err) {
          console.error(`Can not read ${file}.json`);
        }
        console.log(JSON.parse(data).name);
        state.datasets.datasets.push(JSON.parse(data));
        readAllJSONFiles();
      });
    });
    
  });
})
.post(cors.corsWithOptions, addHeader, (req, res, next) => {

  const {datagraph: dgraph, visgraph: vgraph, intgraph: igraph} = req.body;
  const {projectName: projName} = req.params;
  
  req.session.name = projName;

  const finished = after(3, () => res.json(req.session));

  // get the datagraph
  datagraph.useDatabase(projName).then(() => {
    datagraph.setGraph(dgraph) //.then((dgraph) => {
      // state.datagraph.datagraph = dgraph;
      finished();
    });

  // get visgraph
  visgraph.useDatabase(projName).then(() => {
    visgraph.setGraph(vgraph) //.then((vgraph) => {
      // state.visgraph.visgraph = vgraph;
    finished();
    //})
  });

  // get intgraph
  intgraph.useDatabase(projName).then(() => {
    intgraph.setGraph(igraph) //.then((igraph) => {
      finished();
    // })
  });
});

module.exports = router;
