var async = require("async");
var moment = require("moment");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var ObjectID = require("mongodb").ObjectID;

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

exports.all_languages_get = function(req, res, next)
{
    req.db.collection("languages").find().toArray(function(error, results){
        if(error) throw error;
        // console.log(results);
        res.send(results);
    });
}

exports.all_tags_get = function(req, res, next)
{
    req.db.collection("tags").find().toArray(function(error, results){
        if(error) throw error;
        console.log(results);
        res.send(results);
    })
}

exports.book_detail_get = function(req, res, next)
{
    var _id = req.params.id;
    var Book;

    async.series([
        function(cb1) // Get book by id
        {
            req.db.collection("books").findOne({_id: ObjectID(_id)}, function(error, result){
                if(error) throw error;
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
                            req.db.collection("languages").find({_id: {$in: Book.languages}}).toArray(function(error, results){
                                if(error) throw error;
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
                            req.db.collection("authors").find({_id: {$in: Book.authors}}).toArray(function(error, results){
                                if(error) throw error;
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
                            req.db.collection("tags").find({_id: {$in: Book.tags}}).toArray(function(error, results){
                                if(error) throw error;
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
                            req.db.collection("publishers").findOne({_id: Book.publisher}, function(error, results){
                                if(error) throw error;
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
                            req.db.collection("book_instances").find({_id: {$in: Book.book_instances}}, {books: 0}).toArray(function(error, results){
                                if(error) throw error;
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
        res.send({...Book, ...{found: "yes"}});
    }) // async.series ends
}