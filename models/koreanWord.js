var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;
 
var koreanWordSchema = new Schema({
    id: Number,
    word: String,
    explanation: String
});

var KoreanWord = mongoose.model('koreanWord', koreanWordSchema);

fs.readFile('./korean_dict_utf8.csv', function(err, data) {
  if (err) throw err;

  rows = data.toString().split('\r\n');

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i].split(',');

    var doc = { id: Number(row[0]), word: row[1], explanation: row[2] };
    if (doc.id == 0){
      continue;
    }

    KoreanWord.update({id: doc.id}, doc, {upsert: true}, function(err) {
      if (err) throw err;
    });
  }
  console.log('Korean dictionary load completed');
});
 
module.exports = KoreanWord;
