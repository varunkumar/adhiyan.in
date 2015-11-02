importScripts('/assets/js/serviceworker-cache-polyfill.js');

var CACHE_NAME = 'adhiyan-cache-v1';
var urlsToCache = [
  '/',
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