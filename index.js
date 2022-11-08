var express = require("express"),
bodyParser = require("body-parser"),
cors = require("cors"),
session = require("express-session"),
dialogflowIndex = require("./routes/api"),
mainRoute = require("./routes"),
errorhandler = require("errorhandler");

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,Access-Control-Allow-Origin,Content-Type,Accept,Authorization,Origin,Accept,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers');

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

app.use(allowCrossDomain);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,Access-Control-Allow-Origin,Content-Type,Accept,Authorization,Origin,Accept,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers');
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

app.use("/", mainRoute,function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,Access-Control-Allow-Origin,Content-Type,Accept,Authorization,Origin,Accept,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers');
  next();
});
app.use("/api", dialogflowIndex,function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,Access-Control-Allow-Origin,Content-Type,Accept,Authorization,Origin,Accept,X-Requested-With,Access-Control-Request-Method,Access-Control-Request-Headers');
  next();
});

app.use(function(err, req, res, next){ 
  res.status(err.status || 500);
  res.json({'error': {
    message: err.message,
    error: {}
  }})
});

const PORT =  process.env.PORT || 3000
app.listen(PORT, function(){
  console.log(`Listening on port: ${PORT}`);
});