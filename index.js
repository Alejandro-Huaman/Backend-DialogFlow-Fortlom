var express = require("express"),
bodyParser = require("body-parser"),
cors = require("cors"),
session = require("express-session"),
dialogflowIndex = require("./routes/api"),
mainRoute = require("./routes"),
errorhandler = require("errorhandler");

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
 
var isProduction = process.env.NODE_ENV === "production";

var app = express();

app.use(cors())
app.use(allowCrossDomain);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require("method-override")()); 
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction){
  app.use(errorhandler());
}

app.use("/", mainRoute,cors());
app.use("/api", dialogflowIndex,cors(),function(req, res, next){
  res.json({msg: 'This is CORS-enabled for a Single Route'})
});

app.use(function(err, req, res, next){ 
  res.status(err.status || 500);
  res.json({'error': {
    message: err.message,
    error: {}
  }})
});

var server = app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port: " + server.address().port);
});