var path = require("path");
var async = require("async");
var randomstring = require("randomstring");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var numToWords = require("number-to-words");
var multer = require("multer");
var ObjectID = require("mongodb").ObjectID;

function makeUrlQuery(object)
{
    var str = "";
    for (const key in object) 
    {
        if (object.hasOwnProperty(key)) 
        {
            const element = object[key];
            if(element instanceof Array)
            {
                for (const e of element) 
                {
                    str += key + "=" + e + "&";    
                }
            }
            else
            {
                str += key + "=" + element + "&";
            }
            
        }
    }

    return str.substr(0, str.length -1);
}

function toIntArray(arr)
{
    var newarr = [];
    arr.forEach(element => {
        if(!isNaN(element))
            newarr.push(parseInt(element));
    });
    return newarr;
}

function extractDigits(isbn)
{
    var newisbn = "";
    for (let index = 0; index < isbn.length; index++) {
        const element = isbn[index];
        var pattern = /\d/;
        if(element.match(pattern)) newisbn += element;
    }
    return newisbn;
}

// Set Storage Engine
var storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, "./public/images/book-covers/")
    },
    filename: function(req, file, cb) {
      cb(null, randomstring.generate() + '-' + Date.now() + path.extname(file.originalname));
    }
  });

// Init upload
var upload = multer({
    storage: storage //,
    // fileFilter: function(req, file, cb)
    // {
    //     if(!file)
    //     {
    //         cb();
    //     }

    //     var image = file.mimetype.startsWith('image/');
    //     if(image)
    //     {
    //         console.log("Photo is being uploaded");
    //         cb(null, true);
    //     }
    //     else
    //     {
    //         console.log("File not supported");
    //         cb();
    //     }
    // }
}).single("image_file");


exports.add_book_get = function(req, res, next)
{
    async.parallel({
        languages: function(cb)
        {
            req.db.collection("languages").find().toArray(function(err, results){
                if(err) 
                {
                    cb(err, null);
                    return;
                }
                else
                {
                    cb(null, results);
                }
            })
        },

        authors: function(cb)
        {
            req.db.collection("authors").find().toArray(function(error, results){
                if(error)
                {
                    cb(error, null);
                    return;
                }
                else
                {
                    cb(null, results);
                }
            })
        },

        tags: function(cb)
        {
            req.db.collection("tags").find().toArray(function(error, results){
                if(error)
                {
                    cb(error, null);
                    return;
                }
                else
                {
                    cb(null, results);
                }
            });
        },

        publishers: function(cb)
        {
            req.db.collection("publishers").find().toArray(function(error, results){
                if(error)
                {
                    cb(error, null);
                    return;
                }
                else
                {
                    cb(null, results);
                }
            });
        }
    },
    function(errors, results)
    {
        results.languages.forEach(element => {
            if(element.namelowercase == "english")
            {
                element.checked = true;
            }
        })
        res.render('library/add-book', results);
    }); // async.parallel ends
}

exports.add_book_post = function(req, res, next)
{
    upload(req, res, function(err)
    {
        if(err)
        {
            console.log("Error occured while uploding book image_file.");
            res.send("Error occured while uploading image file");
        }
        else
        {
            var errors = [];
            async.series([
                // Convert authors, languages and tags to array and seperate new values entered
                // and convert isbns
                (next) =>
                {
                    if(!(req.body.language instanceof Array))
                    {
                        if(typeof req.body.language === 'undefined') req.body.language = [];
                        else req.body.language = new Array(req.body.language);
                    }

                    if(!(req.body.new_language instanceof Array))
                    {
                        if(typeof req.body.new_language === 'undefined') req.body.new_language = [];
                        else req.body.new_language = new Array(req.body.new_language);
                    }

                    if(!(req.body.author instanceof Array))
                    {
                        if(typeof req.body.author === 'undefined') req.body.author = [];
                        else req.body.author = new Array(req.body.author);
                    }

                    if(!(req.body.new_author instanceof Array))
                    {
                        if(typeof req.body.new_author === 'undefined') req.body.new_author = [];
                        else req.body.new_author = new Array(req.body.new_author);
                    }

                    if(!(req.body.tag instanceof Array))
                    {
                        if(typeof req.body.tag === 'undefined') req.body.tag = [];
                        else req.body.tag = new Array(req.body.tag);
                    }

                    if(!(req.body.new_tag instanceof Array))
                    {
                        if(typeof req.body.new_tag === 'undefined') req.body.new_tag = [];
                        else req.body.new_tag = new Array(req.body.new_tag);
                    }

                    // // Seperate new publisher
                    // if(req.body.publisher) // if it is not undefined
                    // {
                    //     if(!(req.body.publisher).startsWith("publisher"))
                    //         req.body.new_publisher = req.body.publisher;
                    // }
                        

                    if(!req.body.isbn10) req.body.isbn10 = "";
                    req.body.isbn10 = extractDigits(req.body.isbn10);
                    if(!req.body.isbn13) req.body.isbn13 = "";
                    req.body.isbn13 = extractDigits(req.body.isbn13);
                    next(null, null);
                }, // First fn to convert values into array and int ends

                // Second fn to validate fields
                (next) =>
                {
                    if(req.body.title.length <= 0)
                    {
                        errors.push({
                            field: "title",
                            msg: "Title must not be empty"
                        });
                        // console.log("Book Title was missing, so errors are: ");
                        // console.log(errors);
                    }

                    if(req.body.isbn10.length != 10 && req.body.isbn10.length != 0)
                    {
                        errors.push({
                            field: "isbn10",
                            msg: "ISBN-10 must be 10 digits long"
                        })
                        // console.log("ISBN-10 was wrong, so errors are: ");
                        // console.log(errors);
                    }

                    if(req.body.isbn13.length != 13 && req.body.isbn13.length != 0)
                    {
                        errors.push({
                            field: "isbn13",
                            msg: "ISBN-13 must be 13 digits long"
                        });
                        // console.log("ISBN-13 was wrong, so errors are: ");
                        // console.log(errors);
                    }
                    next(null, null);
                },

                function(next) // Check if ISBN10 Already exists
                {
                    if(req.body.isbn10.length == 10)
                    {
                        req.db.collection("books").find({isbn10: req.body.isbn10}).toArray(function(error, results){
                            if(error) throw error;
                            if(results.length!=0)
                            {
                                errors.push({
                                    field: "isbn10",
                                    msg: "ISBN-10 already exists."
                                });
                            }
                            next(null, null);
                        });
                    }
                    else
                    {
                        next(null, null);
                    }
                },

                function(next) // Check if ISBN13 Already exists
                {
                    if(req.body.isbn13.length == 13)
                    {
                        req.db.collection("books").find({isbn13: req.body.isbn13}).toArray(function(error, results){
                            if(error) throw error;
                            if(results.length!=0)
                            {
                                errors.push({
                                    field: "isbn13",
                                    msg: "ISBN-13 already exists."
                                })
                            }
                            next(null, null);
                        })
                    }
                    else
                    {
                        next(null, null);
                    }
                },

                function(next) // Add new languages to database
                {
                    if(req.body.new_language.length)
                    {
                        var languages_to_insert = [];
                        for (let index = 0; index < req.body.new_language.length; index++) 
                        {
                            const lang = req.body.new_language[index];
                            var langobj = {
                                name: lang,
                                namelowercase: lang.toLowerCase()
                            }
                            languages_to_insert.push(langobj);
                        }

                        req.db.collection("languages").insertMany(languages_to_insert, function(error, results){
                            if(error) throw error;
                            for (const insertedId of results.insertedIds) 
                            {
                                req.body.language.push(insertedId);    
                            }
                            next(null, null);
                        });
                    }
                    else
                    {
                        next(null, null);
                    }
                    
                },

                function(next) // Add new authors to database
                {
                    if(req.body.new_author.length)
                    {
                        var authors_to_insert = [];
                        for(var i = 0; i < req.body.new_author.length; ++i)
                        {
                            var auth = req.body.new_author[i];
                            var authobj = {
                                name: auth,
                                namelowercase: auth.toLowerCase()
                            }
                            authors_to_insert.push(authobj);
                        }
                        req.db.collection("authors").insertMany(authors_to_insert, function(error, results){
                            if(error) throw error;
                            for (const insertedId of results.insertedIds) 
                            {
                                req.body.author.push(insertedId);    
                            }
                            next(null, null);
                        });
                    }
                    else
                    {
                        next(null, null);
                    }
                    
                },

                function(next) // Add new tags to database
                {
                    if(req.body.new_tag.length)
                    {
                        var tags_to_insert = [];
                        for(var i = 0; i < req.body.new_tag.length; ++i)
                        {
                            var tag = req.body.new_tag[i];
                            var tagobj = {
                                name: tag,
                                namelowercase: tag.toLowerCase()
                            }
                            tags_to_insert.push(tagobj);
                        }
                        req.db.collection("tags").insertMany(tags_to_insert, function(error, results){
                            if(error) throw error;
                            for (const insertedId of results.insertedIds) 
                            {
                                req.body.tag.push(insertedId);    
                            }
                            next(null, null);
                        });
                    }
                    else
                    {
                        next(null, null);
                    }
                    
                },

                function(next) // Add new publisher to database
                {
                    if(req.body.new_publisher)
                    {
                        var pubobj = {
                            name: req.body.new_publisher,
                            namelowercase: req.body.new_publisher.toLowerCase()
                        }
                        req.db.collection("publishers").insertOne(pubobj, function(error, results){
                            if(error) throw error;
                            req.body.publisher = results.insertedId;
                            next(null, null);
                        });
                    }
                    else
                    {
                        next(null, null);
                    }
                },


                function(next) // Process request after validation and sanitazion
                {
                    if(errors.length) // Error
                    {
                        // Re-render the form with sanitized values and error messages
                        
                        // Get values to repopulate the form
                        async.parallel({
                            languages: function(cb)
                            {
                                req.db.collection("languages").find().toArray(function(error, results){
                                    if(error) throw error;
                                    for (let index = 0; index < results.length; index++) 
                                    {
                                        var element_id = results[index]._id;
                                        if(req.body.language.includes(element_id)) 
                                            results[index].checked = true;
                                    }
                                    cb(null, results);
                                });
                            }, // Got languages
                            authors: function(cb)
                            {
                                req.db.collection("authors").find().toArray(function(error, results){
                                    if(error) throw error;
                                    for (let index = 0; index < results.length; index++) 
                                    {
                                        var element_id = results[index]._id;
                                        if(req.body.language.includes(element_id)) 
                                            results[index].checked = true;
                                    }
                                    cb(null, results);
                                });
                            }, // Got authors

                            publishers: function(cb)
                            {
                                req.db.collection("publishers").find().toArray(function(error, results){
                                    if(error) throw error;
                                    for (let index = 0; index < results.length; index++) 
                                    {
                                        var element_id = results[index]._id;
                                        if(req.body.publisher == element_id)
                                        {
                                            results[index].checked = true;
                                            break;
                                        } 
                                    }
                                    cb(null, results);
                                });
                            }, // Got publishers

                            tags: function(cb)
                            {
                                req.db.collection("tags").find().toArray(function(error, results){
                                    if(error) throw error;
                                    for (let index = 0; index < results.length; index++) 
                                    {
                                        var element_id = results[index]._id;
                                        if(req.body.tag.includes(element_id))
                                        {
                                            results[index].checked = true;
                                            break;
                                        } 
                                    }
                                    cb(null, results);
                                });
                            }
                        },
                        function(error, results)
                        {
                            var data = {
                                title: req.body.title,
                                languages: languages,
                                authors: authors,
                                tags: tags,
                                publishers: publishers,
                                isbn10: req.body.isbn10,
                                isbn13: req.body.isbn13,
                                errors: errors
                            }
                            res.render('library/add-book', data);
                            next(null, null);
                        }); // async.parallel ends
                    }// if errors ends
                    else // No errors in input
                    {
                        var Book = {
                            title: req.body.title
                        }

                        if(req.body.isbn10.length == 10) Book.isbn10 = req.body.isbn10;
                        if(req.body.isbn13.length == 13) Book.isbn13 = req.body.isbn13;
                        if(req.file) Book.image_file = req.file.filename;
                        else Book.image_file = "default_book_cover.png";
                        if(req.body.language.length)
                        {
                            Book.languages = [];
                            req.body.language.forEach(language => {
                                Book.languages.push(ObjectID(language));
                            });
                        }
                        if(req.body.author.length)
                        {
                            Book.authors = [];
                            req.body.author.forEach(author => {
                                Book.authors.push(ObjectID(author));
                            })
                        }
                        if(req.body.tag.length)
                        {
                            Book.tags = [];
                            req.body.tag.forEach(tag => {
                                Book.tags.push(ObjectID(tag));
                            })
                        }
                        if(req.body.publisher)
                        {
                            Book.publisher = ObjectID(req.body.publisher);
                        }

                        async.series([
                            function(cb) // create book document
                            {
                                req.db.collection("books").insertOne(Book, function(error, result){
                                    if(error) throw error;
                                    Book._id = ObjectID(result.insertedId);
                                    cb();
                                })
                            },

                            function(cb) // Add book to languages
                            {
                                req.body.language.forEach(language => {
                                    req.db.collection("languages").updateOne({_id: ObjectID(language)}, {$push: {books: Book._id}}, function(err, result){

                                    });
                                });
                                cb();
                            },

                            function(cb) // Add book to publisher
                            {
                                if(!Book.publisher)
                                {
                                    cb();
                                    return;
                                }
                                req.db.collection("publishers").updateOne({_id: ObjectID(Book.publisher)}, {$push: {books: Book._id}}, function(err, result){
                                    cb();
                                });
                            },

                            function(cb) // Add book to authors
                            {
                                req.body.author.forEach(author => {
                                    req.db.collection("authors").updateOne({_id: ObjectID(author)}, {$push: {books: Book._id}}, function(err, result){

                                    });
                                });
                                cb();
                            },

                            function(cb) // Add book to tags
                            {
                                req.body.tag.forEach(tag => {
                                    req.db.collection("tags").updateOne({_id: ObjectID(tag)}, {$push: {books: Book._id}}, function(err, result){

                                    });
                                });
                                cb();
                            }
                        ],
                        function(errors, result)
                        {
                            res.redirect('/library/bookdetail/' + Book._id);
                            next();
                        }) // async.series ends
                    }
                }
            ]) // async.series to upload image ends
        } // else part of upload image ends
    })
}

exports.book_detail_get = function(req, res, next)
{
    var xhr = new XMLHttpRequest();
    var url = '/api/bookdetail/' + req.params.id;
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            var data = JSON.parse(xhr.responseText);
            if(data.found == "no")
            {
                next();
                return;
            }
            else
            {
                res.render('library/book-detail', data);
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send(null);
}