var express = require('express');
var fs = require('fs');
var Picture = require('../models/picture.js');
var router = express.Router();

var destPath = 'public/images/uploads/';
var thumbnailPath = 'public/images/thumbnails/';

/* GET users listing. */
router.get('/file', function(req, res, next) {
  fs.readdir(thumbnailPath, function(err, files){
    if (err) {
      throw err;
    }
    var pictures = [];
    for(var i in files) {
      if (req.query.limit && i >= req.query.limit) {
        break;
      }
      var name = files[i];
      var _destPath = destPath.replace('public', '');
      var _thumbnailPath = thumbnailPath.replace('public', '');
      pictures.push(new Picture({
        name: name,
        path: _destPath + name,
        thumbnailPath : _thumbnailPath + name
      }));
    }
    res.json({
      result: "success",
      pictures: pictures
    });
  });
});
router.get('/file/:name', function(req, res, next) {
  
  res.json({ result: "success"});
});


module.exports = router;
