var express = require('express')
var stormpath = require('express-stormpath')
 
var app = express()

app.use(stormpath.init(app, {
  expand: {
    customData: true,
  },
  web: {
    produces: ['application/json']
  }
}))
 
app.get('/notes', stormpath.apiAuthenticationRequired, function(req, res) {
  res.json({notes: req.user.customData.notes || "This is your notebook. Edit this to start saving your notes!"})
})
 
app.listen(8080)
