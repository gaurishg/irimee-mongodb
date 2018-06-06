var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
{
    book_id:
    {
        type: Schema.Types.ObjectId,
        required: true
    },

    edition:
    {
        type: Number
    },

    status:
    {
        type: String,
        enum: ["A", "I", "R"],
        default: "A"
    },

    date_of_purchase:
    {
        type: Date
    },

    remarks:
    {
        type: String
    },

    price:
    {
        type: Number
    },

    image_file:
    {
        type: String
    }
},
{
    collection: "book_instances"
});

var BookInstance = mongoose.model('BookInstance', BookInstanceSchema);

module.exports = BookInstance;