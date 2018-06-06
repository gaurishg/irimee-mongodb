var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LanguageSchema = Schema({
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
    collection: "languages"
});

var Language = mongoose.model("Language", LanguageSchema);
module.exports = Language;