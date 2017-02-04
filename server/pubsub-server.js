require('dotenv').config();
var app = require('http').createServer(handler);
var io = require('socket.io')(app);

var Redis = require('ioredis');
var redis;
const NOTIFICATION_EVENT = "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";

if (process.env.APP_ENV == "production") {
  redis = new Redis(6379, process.env.REDIS_HOST);
} else {
  redis = new Redis();
}

app.listen(6001, function() {
  console.log('Server is running!');
});

function handler(req, res) {
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