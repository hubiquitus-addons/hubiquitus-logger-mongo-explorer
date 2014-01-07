var express = require('express');
var mongo = require('mongodb');

var router = new express.Router();
exports.middleware = router.middleware;

var conf = {host: 'localhost', port: 27017, dbname: 'logs', collection: 'logs'};

/* Mongo management */

var db = null;
var server = new mongo.Server(conf.host, conf.port, {auto_reconnect: true});
var client = new mongo.MongoClient(server);
client.open(function (err, client) {
  if (err) throw new Error('Failed to connect to mongo - ' + err);
  db = client.db(conf.dbname);

  if (conf.username) {
    db.authenticate(conf.username, conf.password, function (err, result) {
      if (err) throw new Error('Failed to authenticate - ' + err);
      if (result !== true) throw new Error('Failed to authenticate');
    });
  }
});

/* Rest handlers */

router.get('/logs', function (req, res) {
  var regex = !(req.query.regex === 'false');
  var namespace = req.query.namespace;
  var level = req.query.level;
  var filter = req.query.filter;
  var begin = parseInt(req.query.begin);
  var end = parseInt(req.query.end);

  var query = {};
  if (namespace) query.namespace = regex ? new RegExp('^.*' + namespace + '.*$') : namespace;
  if (level) query.level = new RegExp('^.*' + level + '.*$');
  if (begin || end) {
    query.date = {};
    if (begin) query.date.$gte = begin;
    if (end) query.date.$lte = end;
  }
  if (filter) query.messages = new RegExp('^.*' + filter + '.*$');

  console.log('/logs', new Date(), query);

  db.collection(conf.collection).find(query).toArray(function (err, results) {
    res.json(results);
  });
});
