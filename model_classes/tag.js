var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = Schema({
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
    collection: "tags"
});

var Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;