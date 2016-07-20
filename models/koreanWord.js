var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var koreanWordSchema = new Schema({
    word: String,
    explanation: String,
});
 
module.exports = mongoose.model('koreanWord', koreanWordSchema);
