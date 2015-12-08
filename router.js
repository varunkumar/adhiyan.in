var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  secret = require('./secret.js').secret,
  moment = require('moment'),
  request = require('request');

mongoose.connect('mongodb://localhost:27017/adhiyan');
var PushSubscriptionSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  device: {
    type: String,
    required: true,
    trim: true
  },
  endpoint: {
    type: String,
    required: true,
    trim: true
  },
  subscription: {
    type: String,
    required: true,
    trim: true
  }
});

var PushSubscription = mongoose.model('PushSubscription', PushSubscriptionSchema);

exports.subscribe = function(req, res) {
  var cookies = req.cookies;
  var queryString = req.query;

  if (cookies[secret.COOKIENAME] == secret.PASSWORD) {
    PushSubscription.update({
      username: secret.USERNAME,
      device: cookies[secret.COOKIENAME + '_device']
    }, {
      username: secret.USERNAME,
      device: cookies[secret.COOKIENAME + '_device'],
      endpoint: queryString.endpoint,
      subscription: queryString.subscription
    }, {
      upsert: true
    }, function(err, raw) {
      if (err) {
        console.log(err);
        res.status(400).send('Unable to persist subscription');
      } else {
        res.send('Done');
      }
    });
  } else {
    // Ignore 
    res.send('Done');
  }
};

exports.notifications = function(req, res) {
  res.json({
    notification: {
      title: 'Hello halo!!',
      message: 'Hi appa, amma is looking for you!!',
      tag: 'adhiyan-notification-tag',
      icon: '/assets/favicons/android-icon-192x192.png'
    }
  });
};

exports.pushNotifications = function(req, res) {
  PushSubscription.find({
    username: secret.USERNAME
  }, function(err, docs) {
    if (docs.length > 0) {
      var subscriptionIds = [];
      for (var i = 0; i < docs.length; i++) {
        subscriptionIds.push(docs[i].subscription);
      }
      request.post(docs[0].endpoint, {
        body: {
          registration_ids: subscriptionIds
        },
        json: true,
        headers: {
          'Authorization': secret.GCM_SERVER_KEY
        }
      }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json(docs);
        } else {
          res.status(400).json(docs);
        }
      });
    }
  });
};

// Render login page only for /login/<YYYYMMDD>
exports.loginPage = function(req, res) {
  var date = req.params.date;
  var expectedDate = moment().format('YYYYMMDD');
  if (date == expectedDate) {
    res.render('login');
  } else {
    res.clearCookie(secret.COOKIENAME);
    res.status(404).send('Page not found');
  }
};

exports.authenticate = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var device = req.body.device;

  if (username == secret.USERNAME && password == secret.PASSWORD) {
    res.cookie(secret.COOKIENAME, secret.PASSWORD, {
      expires: new Date(1864000000000),
      httpOnly: true
    });
    res.cookie(secret.COOKIENAME + '_device', device, {
      expires: new Date(1864000000000),
      httpOnly: true
    });
    res.send('Done');
  } else {
    res.clearCookie(secret.COOKIENAME);
    res.send('Incorrect username or password');
  }
};