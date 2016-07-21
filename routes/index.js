module.exports = function(app, KoreanWord)
{
  // GET ALL WORDS 
  app.get('/api/words', function(req,res){
    KoreanWord.find(function(err, koreanWords){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(koreanWords);
    });
  });

  // GET SINGLE WORD 
  app.get('/api/words/:word_id([0-9]+)', function(req, res){
    var word_id = Number(req.params.word_id);
    KoreanWord.find({id: word_id}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
      if(err) return res.status(500).json({error: err});
      if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
      res.json(koreanWords[0]);
    });
  });
  // GET RANDOM SINGLE WORD 
  app.get('/api/words/random', function(req, res){
    KoreanWord.count(function (err, count){
      if(err) return res.status(500).json({error: err});
      var word_id = 1 + Math.floor(Math.random() * count);

      KoreanWord.find({id: word_id}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
        if(err) return res.status(500).json({error: err});
        if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
        res.json(koreanWords[0]);
      });
    });
  });
}
