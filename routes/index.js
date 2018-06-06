var express = require('express');
var router = express.Router();

// My middleware which sets currentPath
router.use(function(req, res, next){
  res.locals.currentPath = "";
  next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
