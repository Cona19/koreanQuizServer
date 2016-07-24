var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var http        = require('http');

/* Configure mongoose */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    /* Connected to mongodb server */
    console.log(mongodbUrl);
    console.log("Connected to mongod server");
});

/* Set url to connect to mongodb server */
var mongodbUrl = (
process.env.OPENSHIFT_MONGODB_DB_HOST ?
('mongodb://admin:P8wRWVllGnxU@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':'+ process.env.OPENSHIFT_MONGODB_DB_PORT + '/koreanquiz') :
'mongodb://localhost/koreanquiz'
);

mongoose.connect(mongodbUrl); 

/* Define models */
var models = {
  UserWord: require('./models/userWord'),
  KoreanWord: require('./models/koreanWord'),
  UserRecord: require('./models/userRecord')
};
 
/* Configure app to use bodyParser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
/* Configure Server ip and port */
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
 
/* Configure router */
var router = require('./routes')(app, models)
 
/* Run server */
var server = http.createServer(app);
server.listen(port, ip);
server.on('error', function(error){
 console.log("Express server has failed to listen");
});
server.on('listening', function(){
 console.log("Express server has started on port " + port)
});
