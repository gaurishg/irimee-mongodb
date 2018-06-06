var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookSchema = new Schema(
{
    title:
    {
        type: String,
        required: true,
        trim: true
    },

    titlelowercase:
    {
        type: String
    },

    isbn10:
    {
        type: String,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },

    isbn13:
    {
        type: String,
        unique: true,
        trim: true,
        minlength: 13,
        maxlength: 13
    },

    authors:
    {
        type: [Schema.Types.ObjectId]
    },

    tags:
    {
        type: [Schema.Types.ObjectId]
    },

    book_instances:
    {
        type: [Schema.Types.ObjectId]
    },

    languages:
    {
        type: [Schema.Types.ObjectId]
    },

    image_file:
    {
        type: String,
        default: "default_book_cover.png"
    }
},
{
    collection: "books"
});

var Book = mongoose.model("Book", BookSchema);
module.exports = Book;
