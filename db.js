var MongoClient = require('mongodb').MongoClient;

var db = null;

// exports.connect = function(URI, callback)
// {
//     if(db)
//     {
//         return callback();
//     }
//     else
//     {
//         MongoClient.connect(URI, function(err, database){
//             if(err) return callback(err);
//             db = database;
//             callback();
//         })
//     }
// }

exports.getDatabaseHandle = function(callback)
{
    if(db)
    {
        callback(db);
    }
    else
    {
        MongoClient.connect('mongodb://localhost:27017', function(err, database){
            if(err)
            {
                console.log("Error connecting database");
                console.log(err.message);
                process.exit(1);
            }
            else
            {
                console.log("mongodb server connected in db.js");
                
                db = database.db('irimee');
                callback(db);
            }
        });
    }
}

// exports.db = db;