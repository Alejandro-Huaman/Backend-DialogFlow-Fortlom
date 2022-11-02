var express = require("express"),
bodyParser = require("body-parser"),
cors = require("cors"),
session = require("express-session"),
dialogflowIndex = require("./routes/api"),
mainRoute = require("./routes"),
errorhandler = require("errorhandler");


var isProduction = process.env.NODE_ENV === "production";

var app = express();


//app.use(cors({ origin: "http://localhost:4200" || process.env.FRONTEND_URL, credentials: true }));

//Cors Configuration - Start
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST, PUT, PATCH, GET, DELETE"
    )
    return res.status(200).json({})
  }
  next()
})
//Cors Configuration - End

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