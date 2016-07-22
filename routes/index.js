module.exports = function(app, dbs)
{
  app.post('/api/record', function(req, res){
    console.log('post record message');
    var facebookUserId = req.body.facebookUserId;
    var succeed = req.body.succeed;
    var wordId = req.body.wordId;
    console.log(facebookUserId);

    dbs.UserWord.find({facebookUserId: facebookUserId, wordId: wordId}, {succeed: 1}, function(err, userwords){
      if (err) console.log(err);
      if (userwords.length == 0){
        var userWord = new dbs.UserWord();
        userWord.facebookUserId = facebookUserId;
        userWord.wordId = wordId;
        userWord.succeed = succeed;
        userWord.save(function(err){
          if(err) console.log(err);
        });
      }
      else{
        if (!userwords[0].succeed){
          userwords[0].update({succeed:succeed}, { safe: true}, function(err){
            if (err) console.log(err);
          });
        }
      }
    });

    dbs.UserRecord.find({facebookUserId: facebookUserId}, {cntCorrect: 1, cntWrong: 1}, function(err, userRecords){
      if (err) console.log(err);
      if (userRecords.length == 0){
        var userRecord = new dbs.UserRecord();
        userRecord.facebookUserId = facebookUserId;
        userRecord.cntCorrect = (succeed ? 1 : 0);
        userRecord.cntWrong = (succeed ? 0 : 1);
        userRecord.save(function(err){
          if (err) console.log(err);
        });
      }
      else{
        var inc = {cntCorrect : (succeed ? 1 : 0), cntWrong : (succeed ? 0 : 1)};
        userRecords[0].update({$inc: inc}, {safe : true}, function(err){
          if (err) console.log(err);
        });
      }
    });

    res.status(200).send();
  });

  // GET ALL WORDS 
  app.get('/api/record/:facebookUserId([0-9]+)', function(req,res){
    console.log('get records');
    var facebookUserId = Number(req.params.facebookUserId);
    var statistics = {};
    dbs.UserRecord.find({facebookUserId: facebookUserId}, {cntCorrect: 1, cntWrong: 1}, function(err, userRecords){
      if(err) return res.status(500).send({error: 'database failure'});
      statistics.cntCorrectTry = userRecords[0].cntCorrect;
      statistics.cntWrongTry = userRecords[0].cntWrong;
      dbs.UserWord.find({facebookUserId: facebookUserId, succeed: true}, {}, function(err, userWords){
        if(err) return res.status(500).send({error: 'database failure'});
        statistics.cntCorrectProblem = userWords.length;
        dbs.UserWord.find({facebookUserId: facebookUserId, succeed: false}, {}, function(err, userWords){
          if(err) return res.status(500).send({error: 'database failure'});
          statistics.cntWrongProblem = userWords.length;
          console.log(statistics);
          res.json(statistics);
        });
      });
    });
  });

  // GET ALL WORDS 
  app.get('/api/words', function(req,res){
    console.log('get all words');
    dbs.KoreanWord.find(function(err, koreanWords){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(koreanWords);
    });
  });

  // GET SINGLE WORD 
  app.get('/api/words/:wordId([0-9]+)', function(req, res){
    console.log('get single word');
    var wordId = Number(req.params.wordId);
    dbs.KoreanWord.find({id: wordId}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
      if(err) return res.status(500).json({error: err});
      if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
      res.json(koreanWords[0]);
    });
  });
  // GET RANDOM SINGLE WORD 
  app.get('/api/words/random', function(req, res){
    console.log('get random one word');
    dbs.KoreanWord.count(function (err, count){
      if(err) return res.status(500).json({error: err});
      var word_id = 1 + Math.floor(Math.random() * count);

      dbs.KoreanWord.find({id: word_id}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
        if(err) return res.status(500).json({error: err});
        if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
        res.json(koreanWords[0]);
      });
    });
  });
}
