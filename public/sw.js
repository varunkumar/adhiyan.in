importScripts('/assets/js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'adhiyan-cache-20160710';
var urlsToCache = [
  '/',
  '/index.html',
  '/one/',
  '/one/index.html',
  '/assets/css/app.min.css',
  '/assets/js/app.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) {
        console.log('Cache hit for \'' + event.request.url + '\'- return response');
        return response;
      }

      console.log('Cache miss for \'' + event.request.url + '\'');

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            console.log('Invalid response for \'' + event.request.url + '\'');
            return response;
          }

          // Cache only '/assets'
          if (event.request.url.indexOf('/assets') == -1) {
            console.log('Not an asset \'' + event.request.url + '\'');
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have 2 stream.
          var responseToCache = response.clone();
          console.log('Updating cache for \'' + event.request.url + '\'');
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);

  fetch('/notifications').then(function(response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      throw new Error();
    }

    return response.json().then(function(data) {
      if (data.error || !data.notification) {
        console.error('The API returned an error.', data.error);
        throw new Error();
      }

      var title = data.notification.title;
      var message = data.notification.message;
      var icon = data.notification.icon;
      var notificationTag = data.notification.tag;

      return self.registration.showNotification(title, {
        body: message,
        icon: icon,
        tag: notificationTag
      });
    });
  }).catch(function(err) {
    console.error('Unable to retrieve data', err);

    var title = 'An error occurred';
    var message = 'We were unable to get the information for this push message';
    var icon = '/assets/favicons/android-icon-192x192.png';
    var notificationTag = 'notification-error';
    return self.registration.showNotification(title, {
      body: message,
      icon: icon,
      tag: notificationTag
    });
  });
});
