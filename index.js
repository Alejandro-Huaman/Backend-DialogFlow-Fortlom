var express = require("express"),
bodyParser = require("body-parser"),
cors = require("cors"),
session = require("express-session"),
dialogflowIndex = require("./routes/api"),
mainRoute = require("./routes"),
errorhandler = require("errorhandler");
const PORT =  process.env.PORT || 3000

var isProduction = process.env.NODE_ENV === "production";

var app = express();

app.use(cors())

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


app.listen(PORT, function(){
  console.log(`Listening on port: ${PORT}`);
});