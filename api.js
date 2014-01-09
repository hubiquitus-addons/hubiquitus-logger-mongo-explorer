var express = require('express');
var mongo = require('mongodb');
var async = require('async');
var _ = require('lodash');

var router = new express.Router();
exports.middleware = router.middleware;

var db = null;
var conf = null;
var debug = false;

exports.configure = function (data) {
  conf = data.mongo;
  debug = data.debug;

  /* Mongo management */

  var server = new mongo.Server(conf.host, conf.port, {auto_reconnect: true});
  var client = new mongo.MongoClient(server);
  client.open(function (err, client) {
    if (err) throw new Error('Failed to connect to mongo - ' + err);
    db = client.db(conf.dbname);
    console.log('Connection to database established');

    if (conf.username) {
      db.authenticate(conf.username, conf.password, function (err, result) {
        if (err) throw new Error('Failed to authenticate - ' + err);
        if (result !== true) throw new Error('Failed to authenticate');
        console.log('Authentication to database done');
      });
    }
  });
};

/* Rest handlers */

router.get('/logs', function (req, res) {
  if (!db) {
    return console.error('Request /logs aborted : no database connection');
  }

  var levels = ['trace', 'debug', 'info', 'warn', 'err'];

  var regex = !(req.query.regex === 'false');
  var namespace = req.query.namespace;
  var level = req.query.level;
  var levelsAbove = !(req.query.levelsAbove === 'false');
  var filter = req.query.filter;
  var begin = parseInt(req.query.begin);
  var end = parseInt(req.query.end);
  var idx = parseInt(req.query.idx) || 0;
  var limit = parseInt(req.query.limit) || 30;

  var query = {};
  if (namespace) query.namespace = regex ? new RegExp('^.*' + namespace + '.*$') : namespace;
  if (level) {
    var regexLevel = null;
    var indexLevel = _.indexOf(levels, level);
    if (!levelsAbove || indexLevel === levels.length - 1) {
      regexLevel = '^.*' + level + '.*$';
    } else {
      regexLevel = '^(.*' + level + '.*)';
      for (var k = indexLevel + 1 ; k < levels.length ; k++) {
        regexLevel += '|(.*' + levels[k] + '.*)';
      }
      regexLevel += '$';
    }
    query.level = new RegExp(regexLevel);
  }
  if (begin || end) {
    query.date = {};
    if (begin) query.date.$gte = begin;
    if (end) query.date.$lte = end;
  }
  if (filter) query.messages = new RegExp('^.*' + filter + '.*$');

  var cursor = db.collection(conf.collection).find(query);
  var result = {};
  async.parallel([
    function (done) {
      cursor.skip(idx).limit(limit).sort({date: 1}).toArray(function (err, data) {
        result.logs = data;
        done();
      });
    },
    function (done) {
      cursor.count(function (err, data) {
        result.count = data;
        done();
      });
    }
  ], function () {
    if (debug) {
      console.log('\nRequest /logs', new Date());
      console.log('Query', {query: query, idx: idx, limit: limit});
      console.log('Result', {count: result.count})
    }
    res.json(result);
  });
});
