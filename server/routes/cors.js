const express = require("express");
const cors = require("cors");

const whitelist = [
  "http://localhost:7472",
]

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  console.log("header: ", req.header('Origin'));

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true // it is okay for the client side to receive the response from the server
    }
  } else {
    corsOptions = {
      origin: false
    };
  }
  callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
