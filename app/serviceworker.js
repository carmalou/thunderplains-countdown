self.oninstall = function(event) {
    // this function runs on install
    // first it opens/defines a cache for our files to live
    // next it adds those files to the cache
    // last it catches any errors

    // var version = require('./../package.json').version;
    var version = '1.0.0';
    var cacheName = 'ThunderplainsCountdown' + version;

    // first we open/define our cache
    caches.open(cacheName)
    .then(function(cache) {
        cache.addAll([
            '/',
            'index.html',
            '/src/index.js'
        ])
        .catch(function(err) {
            console.log('Files not added ', err);
        })
    })
    .catch(function(err) {
        console.log('Err: ', err);
    })
}

self.onfetch = function(event) {
    // this function runs on fetch
    // first it takes the request and finds a match in our app's caches
    // if it finds a match, it returns
    // if it doesn't find a match, it goes over the network
    // after it gets the response via the network, it adds it to our cache

    // if it's not a GET, go ahead and just return
    if(event.request.method != "GET") {
        console.log('if');
        return;
    }

    event.respondWith(
        caches.match(event.request)
        .then(function(cachedFiles) {
            if(cachedFiles) {
                return cachedFiles;
            } 
            else {
                // make a fetch req over the network
                return fetch(event.request)
                .then(function(response) {
                    // add files to cache so we have them for next time
                    return response;
                })
            }
        })
        .catch(function(err) {
            console.log('Err ', err);
        })
    )
}

self.onpush = function(event) {
    // this function runs on push

    console.log('WOO!');
    console.log('we got a push event!');
    console.log(event);
}