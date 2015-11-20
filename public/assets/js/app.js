// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
  $('body').on('click', '.page-scroll a', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});

// Floating label headings for the contact form
$(function() {
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
  target: '.navbar-fixed-top'
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  $('.navbar-toggle:visible').click();
});

// Install ServiceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    initPush(registration);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

function initPush() {
  // Are Notifications supported in the service worker?  
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.  
  // If its denied, it's a permanent block until the  
  // user changes the permission  
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported  
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }

  // We need the service worker registration to check for a subscription  
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Do we already have a push message subscription?  
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        if (!subscription) {
          serviceWorkerRegistration.pushManager.subscribe({
              userVisibleOnly: true
            })
            .then(function(subscription) {
              return sendSubscriptionToServer(subscription);
            });
        }

        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);
      })
      .catch(function(err) {
        console.warn('Error during getSubscription()', err);
      });
  });
}

function sendSubscriptionToServer(subscription) {
  var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';
  var endpoint = subscription.endpoint;
  if (subscription.endpoint.indexOf(GCM_ENDPOINT) != -1) {
    endpoint = GCM_ENDPOINT;
    subscription = subscription.endpoint.replace(GCM_ENDPOINT + '/', '');
  }
  $.get('/subscribe?endpoint=' + endpoint + "&subscription=" + subscription).done(function() {
    console.log('Subscription id sent to server');
  }).fail(function() {
    console.log('Unable to send subscription id to server');
  });
}