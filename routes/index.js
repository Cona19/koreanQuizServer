module.exports = function(app, models)
{
  /* Test route */
  app.get('/', function(req, res){
    res.send('success');
  });
  /* post record to db */
  app.post('/api/record', function(req, res){
    console.log('post record message');
    var facebookUserId = req.body.facebookUserId;
    var succeed = req.body.succeed;
    var wordId = req.body.wordId;
    console.log(facebookUserId);

    /* If the corresponding document has been found, just update that, and if not, insert a new element. */
    models.UserWord.find({facebookUserId: facebookUserId, wordId: wordId}, {succeed: 1}, function(err, userwords){
      if (err) console.log(err);
      /* If the corresponding document has been found, just update that. */
      if (userwords.length == 0){
        var userWord = new models.UserWord();
        userWord.facebookUserId = facebookUserId;
        userWord.wordId = wordId;
        userWord.succeed = succeed;
        userWord.save(function(err){
          if(err) console.log(err);
        });
      }
      /* If not, insert a new element. */
      else{
        if (!userwords[0].succeed){
          userwords[0].update({succeed:succeed}, { safe: true}, function(err){
            if (err) console.log(err);
          });
        }
      }
    });

    models.UserRecord.find({facebookUserId: facebookUserId}, {cntCorrect: 1, cntWrong: 1}, function(err, userRecords){
      if (err) console.log(err);
      /* If the corresponding document has not been found, insert a new element. */
      if (userRecords.length == 0){
        var userRecord = new models.UserRecord();
        userRecord.facebookUserId = facebookUserId;
        userRecord.cntCorrect = (succeed ? 1 : 0);
        userRecord.cntWrong = (succeed ? 0 : 1);
        userRecord.save(function(err){
          if (err) console.log(err);
        });
      }
      /* If there is the corresponding document, update the document.*/
      else{
        var doc = {cntCorrect : userRecords[0].cntCorrect + (succeed ? 1 : 0), cntWrong : userRecords[0].cntWrong + (succeed ? 0 : 1)};
        userRecords[0].update(doc, {safe : true}, function(err){
          if (err) console.log(err);
        });
      }
    });

    res.status(200).send();
  });

  /* Get user's statistics */
  app.get('/api/record/:facebookUserId([0-9]+)', function(req,res){
    console.log('get records');
    var facebookUserId = Number(req.params.facebookUserId);
    var statistics = {};
    models.UserRecord.find({facebookUserId: facebookUserId}, {cntCorrect: 1, cntWrong: 1}, function(err, userRecords){
      if(err) return res.status(500).send({error: 'database failure'});
      /* If there is no record about the user, return default json */
      if (userRecords.length == 0){
        res.json({
          cntCorrectTry: 0,
          cntWrongTry: 0,
          cntCorrectProblem: 0,
          cntWrongProblem: 0
        });
      }
      /* If there is a record, get each value from db and send to client */
      else{
        statistics.cntCorrectTry = userRecords[0].cntCorrect;
        statistics.cntWrongTry = userRecords[0].cntWrong;
        models.UserWord.find({facebookUserId: facebookUserId, succeed: true}, {}, function(err, userWords){
          if(err) return res.status(500).send({error: 'database failure'});
          statistics.cntCorrectProblem = userWords.length;
          models.UserWord.find({facebookUserId: facebookUserId, succeed: false}, {}, function(err, userWords){
            if(err) return res.status(500).send({error: 'database failure'});
            statistics.cntWrongProblem = userWords.length;
            console.log(statistics);
            res.json(statistics);
          });
        });
      }
    });
  });

  /* Get all words of db */ 
  app.get('/api/words', function(req,res){
    console.log('get all words');
    models.KoreanWord.find(function(err, koreanWords){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(koreanWords);
    });
  });

  /* Get a specific word */
  app.get('/api/words/:wordId([0-9]+)', function(req, res){
    console.log('get single word');
    var wordId = Number(req.params.wordId);
    models.KoreanWord.find({id: wordId}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
      if(err) return res.status(500).json({error: err});
      if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
      res.json(koreanWords[0]);
    });
  });
  /* Get a random word */
  app.get('/api/words/random', function(req, res){
    console.log('get random one word');
    models.KoreanWord.count(function (err, count){
      if(err) return res.status(500).json({error: err});
      var word_id = 1 + Math.floor(Math.random() * count);

      models.KoreanWord.find({id: word_id}, {id: 1, word: 1, explanation: 1},  function(err, koreanWords){
        if(err) return res.status(500).json({error: err});
        if(koreanWords.length === 0) return res.status(404).json({error: 'word not found'});
        res.json(koreanWords[0]);
      });
    });
  });
}
