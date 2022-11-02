var router = require('express').Router();
var runIntent = require("./dialogflow").runIntent;



router.get("/", function(req, res){
    res.send("Hello from backend!");
});

// /api/requestText POST 
router.post("/requestText", function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    (async() => {
        console.log(req.body);
        var result = await runIntent(req.body.projectId, req.body.requestText);
        return res.send(
            {
                "responseMessage": result.Response,
                "originalQuery": result.Query, 
                "intent": result.intent
            }
        )
    })();
})

module.exports = router;