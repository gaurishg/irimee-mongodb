var express = require('express');
var router = express.Router();
var apiController = require("../controllers/apiController");

// My middleware which sets currentPath
router.use(function(req, res, next){
  res.locals.currentPath = "api";
  next();
});


// Get languages
router.get('/all-languages', apiController.all_languages_get);

// Get all tags
router.get('/all-tags', apiController.all_tags_get);

// router.post("/insert-language", apiController.insert_language_post);

// router.post("/insert-author", apiController.insert_author_post);

// router.post("/insert-tag", apiController.insert_tag_post);

// router.post("/insert-publisher", apiController.insert_publisher_post);

router.get("/bookdetail/:id", apiController.book_detail_get);

// router.get("/bookinstancedetail/:id", apiController.book_instance_detail_get);

// router.get("/getbooks", apiController.all_books_get);

module.exports = router;