#!/usr/bin/env node

var express = require('express');
var api = require('./api');
var commander = require('commander');

var app = express();

commander
  .version('0.0.1')
  .option('-p, --port [n]', 'HTTP port', parseInt)
  .option('-d, --debug', 'Debug')
  .option('-mhost, --mongo-host [str]', 'Mongo host')
  .option('-mport, --mongo-port [n]', 'Mongo port', parseInt)
  .option('-mdb, --mongo-dbname [str]', 'Mongo dbname')
  .option('-mcoll, --mongo-collection [str]', 'Mongo collection')
  .parse(process.argv);

var conf = {
  debug: commander.debug || false,
  port: commander.port || 3000,
  mongo: {
    host: commander.mongoHost || 'localhost',
    port: commander.mongoPort || '27017',
    dbname: commander.mongoDbname || 'logs',
    collection: commander.mongoCollection || 'logs'
  }
};

console.log('Using configuration', conf);

api.configure(conf);
app.use('/api', api.middleware);
app.use(express.static(__dirname + '/webapp/dist'));

app.listen(conf.port);
console.log('App running at http://*:' + conf.port);
