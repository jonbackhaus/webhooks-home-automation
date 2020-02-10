var express = require('express')
  , request = require('request')
  , multer  = require('multer');

var app = express();
var upload = multer({ dest: '/tmp/' });

var job = process.env.IFTTT_JOB;
var key = process.env.IFTTT_KEY;
var event = process.env.PLEX_EVENT;
var media = process.env.PLEX_MEDIA;
var port = process.env.TRIGGER_PORT;

app.post('/', upload.single('thumb'), function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload.event);

  var options = {
    method: 'POST',
    json: true,
  };

  if (payload.Metadata.librarySectionType.toLowerCase() == media.toLowerCase()
      && payload.event.toLowerCase() == event.toLowerCase() ) {
    // Trigger IFTTT
    console.log('Trigger IFTTT: ' + job);

    options.url = 'https://maker.ifttt.com/trigger/' + job + '/with/key/' + key;

    switch (payload.Metadata.librarySectionType) {
      case 'show':
        options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: (payload.Metadata.grandparentTitle + ' - ' + payload.Metadata.title) };
        break;
      case 'movie':
        options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: payload.Metadata.title };
        break;
      case 'artist':
        options.body = { value1: payload.Account.title, value2: payload.Player.title, value3: (payload.Metadata.grandparentTitle + ' - ' + payload.Metadata.parentTitle + ' - ' + payload.Metadata.title) };
        break;
      default:
    }

    request(options);
  }

  res.sendStatus(200);
});

app.listen(port);
