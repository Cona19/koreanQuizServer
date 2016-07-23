var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

// [CONFIGURE mongoose]
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

var mongodbUrl = (
process.env.OPENSHIFT_MONGODB_DB_HOST ?
'mongodb://admin:P8wRWVllGnxU@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':'+ process.env.OPENSHIFT_MONGODB_DB_PORT + '/koreanquiz' :
'mongodb://localhost/koreanquiz'
);

mongoose.connect(mongodbUrl); 

// DEFINE MODEL
var models = {
  UserWord: require('./models/userWord'),
  KoreanWord: require('./models/koreanWord'),
  UserRecord: require('./models/userRecord')
};
 
// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;
 
// [CONFIGURE ROUTER]
var router = require('./routes')(app, models)
 
// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
