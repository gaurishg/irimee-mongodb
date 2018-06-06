var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AuthorSchema = Schema(
{
    name:
    {
        type: String,
        required: true
    },

    namelowercase:
    {
        type: String,
    },

    books:
    {
        types: [Schema.Types.ObjectId]
    }
},
{
    collection: "authors"
});

var Author = mongoose.model("Author", AuthorSchema);
module.exports = Author;