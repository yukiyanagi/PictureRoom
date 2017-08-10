var express = require('express');
var router = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('gallery', { title: 'Picture Room' });
});

module.exports = router;
