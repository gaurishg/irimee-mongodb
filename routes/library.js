var express = require('express');
var router = express.Router();

var libraryController = require("../controllers/libraryController");

// My middleware which sets currentPath
router.use(function(req, res, next){
  res.locals.currentPath = "library";
  next();
});

router.get('/addbook', libraryController.add_book_get);

router.post('/addbook', libraryController.add_book_post);

router.get('/bookdetail/:id', libraryController.book_detail_get);

module.exports = router;