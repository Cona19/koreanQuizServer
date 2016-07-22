var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var userRecordSchema = new Schema({
    facebookUserId: String,
    cntCorrect: Number,
    cntWrong: Number
});
 
module.exports = mongoose.model('userRecord', userRecordSchema);
