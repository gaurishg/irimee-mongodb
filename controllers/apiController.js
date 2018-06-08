var async = require("async");
var moment = require("moment");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var ObjectID = require("mongodb").ObjectID;
var dbHandle = require('../db');
var db;

dbHandle.getDatabaseHandle(function(database){
    db = database;
});

function extractIntsFromArray(arr)
{
    var newarr = [];
    for (const element of arr) 
    {
        if(!isNaN(element))
            newarr.push(parseInt(element));    
    }
    return newarr;
}

function getBookById(_id, callback)
{
    var Book;
    if(typeof _id == 'string' && _id.length != 24)
    {
        callback({found: "no"});
        return;
    }

    async.series([
        function(cb1) // Get book by id
        {
            db.collection("books").findOne({_id: ObjectID(_id)}, function(error, result){
                if(error)
                {
                    Book = ({found: "no", error: "yes"});
                    callback(Book);
                    cb1();
                }
                if(result == null)
                {
                    Book = ({found: "no"});
                    callback(Book);
                    cb1();
                }
                else
                {
                    Book = result;
                    // console.log(Book);
                    cb1();
                }
            }); // findBookById ends
        },

        function(cb1) // populate languages, authors, tags, publisher and book_instances parallely
        {
            if(Book)
            {
                async.parallel([
                    function(cb2) // populate languages
                    {
                        if(Book.languages)
                        {
                            db.collection("languages").find({_id: {$in: Book.languages}}).toArray(function(error, results){
                                if(error) res.send({found: "no", error: "yes"});
                                Book.languages = results.map(function(e){
                                    // return {_id: e._id, name: e.name};
                                    return e.name;
                                });
                                cb2();
                            });
                        }
                        else
                        {
                            Book.languages = [];
                            cb2();
                        }
                        
                    },
    
                    function(cb2) // populate authors
                    {
                        if(Book.authors)
                        {
                            db.collection("authors").find({_id: {$in: Book.authors}}).toArray(function(error, results){
                                if(error) res.send({found: "no", error: "yes"});
                                Book.authors = results.map(e => e.name);
                                cb2();
                            });
                        }
                        else
                        {
                            Book.authors = [];
                            cb2();
                        }
                    },
    
                    function(cb2) // populate tags
                    {
                        if(Book.tags)
                        {
                            db.collection("tags").find({_id: {$in: Book.tags}}).toArray(function(error, results){
                                if(error) res.send({found: "no", error: "yes"});
                                Book.tags = results.map(e => e.name);
                                cb2();
                            });
                        }
                        else
                        {
                            Book.tags = [];
                            cb2();
                        }
                    },
    
                    function(cb2) // populate publisher
                    {
                        if(Book.publisher)
                        {
                            db.collection("publishers").findOne({_id: Book.publisher}, function(error, results){
                                if(error) res.send({found: "no", error: "yes"});
                                Book.publisher = results.name;
                                cb2();
                            });
                        }
                        else
                        {
                            Book.publisher = null;
                            cb2();
                        }
                    },

                    function(cb2) // populate book_instances
                    {
                        if(Book.book_instances)
                        {
                            db.collection("book_instances").find({_id: {$in: Book.book_instances}}, {books: 0}).toArray(function(error, results){
                                if(error) res.send({found: "no", error: "yes"});
                                Book.book_instances = results;
                                cb2();
                            });
                        }
                        else
                        {
                            Book.book_instances = [];
                            cb2();
                        }
                        
                    }
                ],
                function(error, result)
                {
                    cb1();
                }); // async.parallel ends
            }
            
        }
    ],
    function(error, result)
    {
        // console.log(Book);
        if(!error)
            callback({...Book, ...{found: "yes"}});
    }) // async.series ends
}
exports.getBookById = getBookById;

exports.all_languages_get = function(req, res, next)
{
    db.collection("languages").find().toArray(function(error, results){
        if(error) throw error;
        // console.log(results);
        res.send(results);
    });
} 

exports.all_tags_get = function(req, res, next)
{
    db.collection("tags").find().toArray(function(error, results){
        if(error) throw error;
        // console.log(results);
        res.send(results);
    })
}

exports.book_detail_get = function(req, res, next)
{
    var _id = req.params.id;
    var Book;
    if(_id.length != 24)
    {
        res.send({found: "no"});
    }
    else
    {
        async.series([
            function(cb1) // Get book by id
            {
                db.collection("books").findOne({_id: ObjectID(_id)}, function(error, result){
                    if(error)
                    {
                        res.send({found: "no", error: "yes"});
                    }
                    if(result == null)
                    {
                        res.send({found: "no"});
                        cb1();
                    }
                    else
                    {
                        Book = result;
                        // console.log(Book);
                        cb1();
                    }
                }); // findBookById ends
            },
    
            function(cb1) // populate languages, authors, tags, publisher and book_instances parallely
            {
                if(Book)
                {
                    async.parallel([
                        function(cb2) // populate languages
                        {
                            if(Book.languages)
                            {
                                db.collection("languages").find({_id: {$in: Book.languages}}).toArray(function(error, results){
                                    if(error) res.send({found: "no", error: "yes"});
                                    Book.languages = results.map(function(e){
                                        // return {_id: e._id, name: e.name};
                                        return e.name;
                                    });
                                    cb2();
                                });
                            }
                            else
                            {
                                Book.languages = [];
                                cb2();
                            }
                            
                        },
        
                        function(cb2) // populate authors
                        {
                            if(Book.authors)
                            {
                                db.collection("authors").find({_id: {$in: Book.authors}}).toArray(function(error, results){
                                    if(error) res.send({found: "no", error: "yes"});
                                    Book.authors = results.map(e => e.name);
                                    cb2();
                                });
                            }
                            else
                            {
                                Book.authors = [];
                                cb2();
                            }
                        },
        
                        function(cb2) // populate tags
                        {
                            if(Book.tags)
                            {
                                db.collection("tags").find({_id: {$in: Book.tags}}).toArray(function(error, results){
                                    if(error) res.send({found: "no", error: "yes"});
                                    Book.tags = results.map(e => e.name);
                                    cb2();
                                });
                            }
                            else
                            {
                                Book.tags = [];
                                cb2();
                            }
                        },
        
                        function(cb2) // populate publisher
                        {
                            if(Book.publisher)
                            {
                                db.collection("publishers").findOne({_id: Book.publisher}, function(error, results){
                                    if(error) res.send({found: "no", error: "yes"});
                                    Book.publisher = results.name;
                                    cb2();
                                });
                            }
                            else
                            {
                                Book.publisher = null;
                                cb2();
                            }
                        },
    
                        function(cb2) // populate book_instances
                        {
                            if(Book.book_instances)
                            {
                                db.collection("book_instances").find({_id: {$in: Book.book_instances}}, {books: 0}).toArray(function(error, results){
                                    if(error) res.send({found: "no", error: "yes"});
                                    Book.book_instances = results;
                                    cb2();
                                });
                            }
                            else
                            {
                                Book.book_instances = [];
                                cb2();
                            }
                            
                        }
                    ],
                    function(error, result)
                    {
                        cb1();
                    }); // async.parallel ends
                }
                
            }
        ],
        function(error, result)
        {
            // console.log(Book);
            if(!error)
                res.send({...Book, ...{found: "yes"}});
        }) // async.series ends
    }
    
}

exports.book_instance_detail_get = function(req, res, next)
{
    if(req.params.id.length != 24)
    {
        res.send({found: "no"});
    }
    else
    {
        db.collection("book_instances").findOne({_id: ObjectID(req.params.id)}, function(err, book_instance){
            if(err)
            {
                res.send({found: "no", error: "yes"});
            }
            else
            {
                if(book_instance == null)
                    res.send({found: "no"});
                else
                {
                    var book_id = book_instance.book_id;
                    var url = '/api/bookdetail/' + book_id;
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function()
                    {
                        if(xhr.readyState == 4 && xhr.status == 200)
                        {
                            var book = JSON.parse(xhr.responseText);
                            if(book.found == "no")
                            {
                                res.send({found: "no", error: "yes"});
                            }
                            else
                            {
                                for (const key in book) 
                                {
                                    if (book.hasOwnProperty(key) && !book_instance.hasOwnProperty(key) && key!="book_instances") 
                                    {
                                        book_instance[key] = book[key];
                                    }
                                }
                                res.send({...book_instance, ...{found: "yes"}});
                            }
                        }
                    }
                    xhr.open("GET", url, true);
                    xhr.send(null);
                }
            }
        });
    }
    
}

exports.all_books_get = function(req, res, next)
{
    var offset = 0, number_of_books = 40, tag_ids = [], author_ids = [], language_ids = [], book_ids;
    var query = {};

    // Convert tag_id, author_id, language_id to array
    if(req.query.tag_ids)
    {
        if(!(req.query.tag_ids instanceof Array))
        {
            tag_ids = [req.query.tag_ids].map(e => ObjectID(e));
        }
        else
        {
            tag_ids = req.query.tag_ids.map(e => ObjectID(e));
        }
    }

    if(req.query.author_ids)
    {
        if(!(req.query.author_ids instanceof Array))
        {
            author_ids = [req.query.author_ids].map(e => ObjectID(e));
        }
        else
        {
            author_ids = req.query.author_ids.map(e => ObjectID(e));
        }
    }

    if(req.query.language_ids)
    {
        if(!(req.query.language_ids instanceof Array))
        {
            language_ids = [req.query.language_ids].map(e => ObjectID(e));
        }
        else
        {
            language_ids = req.query.language_ids.map(e => ObjectID(e));
        }
    }

    if(tag_ids.length)
    {
        query.tags = {'$all': tag_ids};
    }

    if(author_ids.length)
    {
        query.authors = {'$all': author_ids};
    }

    if(language_ids.length)
    {
        query.languages = {"$all": language_ids};
    }

    var cursor = db.collection("books").find(query, {_id: 1});

    // Apply skip/offset
    if(req.query.offset && !isNaN(req.query.offset))
    {
        offset = parseInt(req.query.offset);
    }

    cursor = cursor.skip(offset);

    // Apply limit/number of books
    if(req.query.items && !isNaN(req.query.items))
    {
        number_of_books = parseInt(req.query.items);
    }
    cursor = cursor.limit(number_of_books);


    async.series([
        function(cb) // Get Book ids
        {
            cursor.toArray(function(err, results){
                book_ids = results.map(obj => obj._id);
                cb(null, book_ids);
            });
        },

        function(cb)
        {
            var books = [];
            var functions = [];
            for(var i=0, j=0; i<book_ids.length; ++i)
            {
                functions.push(function(callback){
                    getBookById(book_ids[j++], function(result){
                        callback(null, result);
                    });
                })
            }

            async.series(functions, function(err, results){
                cb(err, results);
            })
        }
    ],
    function(errors, results)
    {
        // consolse.log(results);
        res.send(results[1]);
    })
    

    // console.log(books);
    // res.send(books);
}