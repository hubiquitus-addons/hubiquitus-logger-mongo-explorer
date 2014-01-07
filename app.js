var express = require('express');
var api = require('./api');

var app = express();

app.use('/api', api.middleware);
app.use(express.static(__dirname + '/webapp/dist'));

app.listen(3000);
