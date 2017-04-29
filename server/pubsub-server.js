require('dotenv').config();
var Redis = require('ioredis');
var fs = require('fs');
var redis, app;

const NOTIFICATION_EVENT = "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";

if (process.env.APP_ENV == "production") {
  var options = {
    key: fs.readFileSync('/var/www/collegemate/creds/cert.key'),
    cert: fs.readFileSync('/var/www/collegemate/creds/cert.pem')
  };

  app = require('https').createServer(options, handler);
  redis = new Redis(6379, process.env.REDIS_HOST);
} else {
  app = require('http').createServer(handler);
  redis = new Redis();
}

var io = require('socket.io')(app);
app.listen(6001, function() {
  console.log('Server is running!');
});

function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
     res.writeHead(200);
     res.end();
     return;
  }

  res.writeHead(200);
  res.end('');
}

io.on('connection', function(socket) {
  //
});

redis.psubscribe('*', function(err, count) {
  //
});

redis.on('pmessage', function(subscribed, channel, message) {
  message = JSON.parse(message);
  if(message.event == NOTIFICATION_EVENT)
  {
    message.event = "new-notification";
  }
  io.emit(channel + ':' + message.event, message.data);
});

