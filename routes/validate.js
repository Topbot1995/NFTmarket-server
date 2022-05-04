var express = require('express');
var router = express.Router();
//import  {parse}  from 'json-parser';

router.post('/', function(req, res, next) {
    console.log(req.body.text);
     var draft = req.body.draft;
     try {
        draft = JSON.parse(draft);
        res.json({result:"1"});
     }
     catch {
        res.json({result:"0"});
     }
        
});



module.exports = router;
