var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
/* Define a schema of userWord */
var userWordSchema = new Schema({
    facebookUserId: String,
    wordId: Number,
    succeed: Boolean
});
 
module.exports = mongoose.model('userWord', userWordSchema);
