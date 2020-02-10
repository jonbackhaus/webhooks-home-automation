var express = require('express')
  , request = require('request')
  , multer  = require('multer');

var app = express();
var upload = multer({ dest: '/tmp/' });

var job = process.env.IFTTT_JOB;
var key = process.env.IFTTT_KEY;
var port = process.env.TRIGGER_PORT;

app.post('/', upload.single('thumb'), function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  //console.log('Got webhook for', payload.event);

  var options = {
    method: 'POST',
    json: true,
  };

  options.url = 'https://maker.ifttt.com/trigger/' + job + '/with/key/' + key;

  request(options);

  res.sendStatus(200);
});

app.listen(port);
