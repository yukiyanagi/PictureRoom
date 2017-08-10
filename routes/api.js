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
      var name = files[i];
      var file = fs.statSync(thumbnailPath + '/' + name);

      var _destPath = destPath.replace('public', '');
      var _thumbnailPath = thumbnailPath.replace('public', '');
      pictures.push(new Picture({
        name: name,
        path: _destPath + name,
        thumbnailPath : _thumbnailPath + name,
        ctime: new Date(file.ctime),
        mtime: new Date(file.mtime)
      }));
    }
    pictures.sort(function(a,b){
      if(a.ctime<b.ctime) return -1;
      if(a.ctime > b.ctime) return 1;
      return 0;
    });
    var min = parseInt(req.query.min);
    if (min < 0) min = 0;
    if (min > pictures.length) {
      res.json({
        result: "failed",
        pictures: undefined
      });
      return;
    }
    var max = parseInt(req.query.max);
    if (max < min || pictures.length < min) {
      res.json({
        result: "failed",
        pictures: undefined
      });
      return;
    }
    if (max > pictures.length) max = pictures.length;

    pictures = pictures.splice(min, max);
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
