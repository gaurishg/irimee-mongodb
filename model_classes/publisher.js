var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PublisherSchema = Schema({
    name:
    {
        type: String,
        required: true,
        unique: true
    },

    namelowercase:
    {
        type: String
    },

    books:
    {
        type: [Schema.Types.ObjectId]
    }
},
{
    collection: "publishers"
});

var Publisher = mongoose.model("Publisher", PublisherSchema);
module.exports = Publisher;