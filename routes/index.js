var express = require('express');
var im = require('imagemagick');
var multer = require('multer');
var destPath = 'public/images/uploads/';
var thumbnailPath = 'public/images/thumbnails/';
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, destPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  },
});
var upload = multer({ storage: storage });

var router = express();

var multerSetting = upload.single('picture');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/', multerSetting, function(req, res, next) {
  var result = true;
  if (!req.file) {
    result = false;
    res.json({"result": result});
  } else {
    // create thumbnail
    im.resize({
      srcPath: destPath + req.file.filename,
      dstPath: thumbnailPath + req.file.filename,
      width: 160,
      height: 160
    }, function(err, stdout, stderr){
      if(err) throw err;
      res.json({"result": result});
    });
  }
});

module.exports = router;
