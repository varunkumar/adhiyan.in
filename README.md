Order is important
1. uglifyjs jquery.js bootstrap.min.js jquery.easing.min.js classie.js cbpAnimatedHeader.js jqBootstrapValidation.js contactme.js app.js -o app.min.js --source-map app.min.js.map -c
(run from public/assets/js)
2. uncss --htmlroot .  --ignore '.navbar-fixed-top.navbar-shrink','.navbar-fixed-top.navbar-shrink .navbar-brand','.floating-label-form-group-with-value label','.floating-label-form-group-with-focus label','.alert-danger','.alert','.close','button.close' index-src.html > assets/css/uncss.css 
(run from public)
3. 

Notes:
http://www.html5rocks.com/en/tutorials/service-worker/introduction/
https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web?hl=en
https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en

 TODO:
 - Enable compression
 - Installable banner
 - 

Learnings:
Real estate - reserving handles, Name announcement. No personal photos.
Host details: VPS, nginx, 
CloudFlare - SSL (Flexible mode)
ServiceWorker - Ondemand caching, Network panel, font issue.  (AppCache)
Webapp manifest - Installable web app
Installable app banners
Parallax effect
Grunt build process

is a simple JSON file that gives you, the developer, the ability to control how your app appears to the user in the areas that they would expect to see apps (for example the mobile homescreen), direct what the user can launch and more importantly how they can launch it. In the future the manifest will give you even more control over your app, but right now we are just focusing on how your app can be launched.

/Me and my wife were blessed with a baby boy last month. We were as excited as any first-time parents would be. Initial few weeks were quite challenging and beautiful, and we were slowly getting used to parenting. Selecting the name came out as the next big challenge. In our family tradition, newborns are named on their 30th day. We were not constrained by too many things like starting letters, horoscope, etc. I had set only one constraint for myself - the name has to be a Tamil one. After a few back and forth discussions with the wife and the family, we have selected the name as 'Adhiyan' (அதியன்). As soon as the name was finalised, I wanted to give an identity for my son in the digital world. I have reserved a mail account, twitter handle and a domain name for him to use in the future. I have built a personal site for him with some basic information to announce his name to my friends and colleagues. In the process of building the site, I have experimented with some new technologies. Here is a quick summary of my learnings and technical details:

Single page site and parallax

The website is a very simple one with basic information. It has been built as a single page responsive web app using Bootstrap. I have added a simple parallax effect to the page using CSS. Parallax scrolling is a technique in which the background and the contents are moved at different speeds. Scroll through the page (in desktop only) to see the background and the content move at different phases (very subtle though). I have built some cool CSS animations in the past but this is my first experience with parallax effects.  Learnt some new techniques of parallax effects and their performance implications in the process.

VPS hosting

I own a Virtual Private Server (VPS) for hosting my sites. Adhiyan's site has also been hosted on the same server and is served by an nginx web server. I played around with HTTP/2 using the HTTP/2 patch on nginx but then reverted back the changes for production use. 

Cloudflare and HTTPS

All the sites that I have built so far are being served over HTTP. I wanted to try out HTTPS. Initial thought was to host it on github which supports HTTPS hosting but I don't want to host the repo public for personal reasons. The next option I had was to CloudFlare which provides free SSL support. Updated my nameserver configurations to route the calls via CloudFlare. CloudFlare provides quite a bunch of content delivery configurations. I haven't played much with them. I have just configured SSL and cache management for the site. SSL configuration supports two mode: Flexible SSL and Full SSL. I am using Flexible SSL mode in which the communication between my server and CloudFlare is unencrypted and the communication between CloudFlare and the client browser is encrypted. In Full SSL mode, both the links have to be encrypted.

CloudFlare settings

ServiceWorker - the next big thing on the web

ServiceWorker is an experimental technology which allows us to run scripts in the background. Typically all scripts  (web workers being an exception) in a web app are executed in the main thread.  ServiceWorker executes in a separate thread and can chose to run even after the page is closed. (Browser's version of TSR?) This opens up the door for features that don't need a web page or user interaction. On the mobile front, this will help bridge the gap between native app and web app by bringing in features like push messages, background sync, etc.  On the desktop front, the best feature IMO is "On-demand caching". It gives the ability to intercept and handle network requests, including programmatically managing a cache of responses. Browsers have provided various solutions for cache management in the past like AppCache but none of the solutions were programmer friendly and had their own share of issues. As ServiceWorker can intercept network calls and change the response, HTTPS is mandatory for sites to use ServiceWorker. 

In Adhiyan's site, I am using it mainly for caching the contents. The recipe I am using caches static files css and JS when the page is loaded first. Subsequently, it will intercept all network calls from the page to see if there are any other static resources being requested. If there is any request to static resource, it will lookup for the contents in cache. If the resource is not available, it will send the actual request to the server (via fetch api) and caches the response for subsequent access. Note: This should not be confused with the browser caching static resources. 

Check out the service worker I have employed on the site here. Chrome, Chrome for Android and Opera are the only browsers supporting service worker so far. Try out the site in Chrome. The first time you load the cache will be updated. Refresh the page to see the site loading faster. Open the network panel in Chrome devtools to confirm that the contents are served from ServiceWorker (check 'size' column). You can see the cached contents from Resources panel > Cache storage section. There seems to be some issues with serving favicons using serviceworker. 

Contents served from ServiceWorker
 

Web app manifest and install banner

There are lots of advancements happening on the mobile browsers making the mobile web app closer to native apps. Web app manifest is a step in that direction. It is a simple JSON file that gives us the ability to control how our app appears to the user in the areas that they would expect to see apps (for example the mobile homescreen), direct what the user can launch and more importantly how they can launch it. Here is the link to Adhiyan site's manifest. In the manifest, I am mentioning the name,  short_name, icons set, start_url and display attributes. These attributes will be used when the user adds the site to the home screen (Chrome > Settings > Add to Home screen). Adding the site to home screen will help in improving the engagement of your user with the site. 

Another interesting feature that has been added to Chrome recently is "Install banner". This feature prompts the user to add the site to home screen instead of the user having to do it manually. Chrome decides when to prompt the user depending on certain criteria. Currently, it seems to be based on the user visits. If the user visits the site on two different days, Chrome shows up the prompt. There is no option for developers to control the prompt. Your web app has to meet certain criteria to be eligible for the prompt - it should be served over HTTPS, should support ServiceWorker, should have web app manifest. Adhiyan's site is meeting all the criteria. If you visit the site on two different days, you should see a prompt for adding to home screen. This should work in Chrome for Android and Chrome for iOS at the moment. 



Some of the technologies used above are very much experimental and are expected to break. I have used the site as an opportunity to try out some of those. Be judgemental in using these technologies in production.

-- Varun 