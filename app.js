var express = require('express'),
  router = require('./router'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  app = express();

app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(cookieParser());

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.use(passport.initialize());

app.get('/subscribe', router.subscribe);
app.get('/login/:date', router.loginPage);
app.post('/login', urlencodedParser, router.authenticate);
app.get('/notifications', router.notifications);
app.get('/push-notifications', router.pushNotifications);

var server = app.listen(3700);

if (process.send) {
  process.send('online');
}

process.on('message', function() {
  if (message === 'shutdown') {
    process.exit(0);
  }
});