var express = require("express"),
bodyParser = require("body-parser"),
session = require("express-session"),
cors = require("cors"),
dialogflowIndex = require("./routes/api"),
mainRoute = require("./routes"),
errorhandler = require("errorhandler");


var isProduction = process.env.NODE_ENV === "production";

var app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Methods','POST');
  //headers clients can use in their requests
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  //allow request to continue and be handled by routes
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

app.use("/", mainRoute);
app.use("/api", dialogflowIndex);

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