var express = require('express');
var router = express.Router();

var libraryController = require("../controllers/libraryController");

// My middleware which sets currentPath
router.use(function(req, res, next){
  res.locals.currentPath = "library";
  next();
});

router.get('/', libraryController.home);
router.get('/getbooks', function(req, res, next){
  console.log("inside /library/getbooks");
  res.redirect('/library/');
});

router.get('/addbook', libraryController.add_book_get);

router.post('/addbook', libraryController.add_book_post);

router.get('/bookdetail/:id', libraryController.book_detail_get);

router.get('/addbookinstance/:id', libraryController.add_book_instance_get);

router.post('/addbookinstance/:id', libraryController.add_book_instance_post);

router.get('/bookinstancedetail/:id', libraryController.book_instance_detail_get);


module.exports = router;