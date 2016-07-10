var express = require('express'),
  router = require('./router'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  app = express();

app.set('view engine', 'jade');
app.use(cookieParser());
app.use(function(req, res, next) {
  if (req.path.indexOf('/one/assets') === 0) {
    router.restrict(req, res);
  }
  next(); 
});
app.use(express.static('public'));


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.get('/subscribe', router.subscribe);
app.get('/login/:date', router.loginPage);
app.post('/login', urlencodedParser, router.authenticate);
app.get('/notifications', router.notifications);
app.get('/push-notifications', router.pushNotifications);

var server = app.listen(3700);

if (process.send) {
  process.send('online');
}

process.on('message', function(message) {
  if (message === 'shutdown') {
    process.exit(0);
  }
});