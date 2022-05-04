var express = require('express');
var router = express.Router();
var fs = require('fs');
 

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        var file = `${__dirname}/uploads/result.json`;
    }
    catch {
        res.json("error");
    }
    res.download(file); // Set disposition and send it.

});

router.post('/', function(req, res, next) {
    console.log(req.body.text);
    // writeFile function with filename, content and callback function
    uploadPath = __dirname + '/uploads/' + 'result.json';
    fs.writeFile(uploadPath, req.body.text, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
    });
    
});



module.exports = router;
