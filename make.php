<?php

    $list = [];
    $exclude = ["CNAME", "make.php"];

    $scanned_directory = array_diff(scandir('./'), array('..', '.'));
    foreach($scanned_directory as $sd) {
        if (is_file('./'.$sd) && !in_array($sd, $exclude)) {
            $list[] = $sd;
        }
    }

    $scanned_directory = array_diff(scandir('./img'), array('..', '.'));
    foreach($scanned_directory as $sd) {
        if (is_file('./img/' . $sd) && !in_array($sd, $exclude)) {
            $list[] = '/img/' . $sd;
        }
    }

    $out = ",
'".join("',
'", $list)."'";

$template = "const cacheName = 'vibrations';

// put the static assets and routes you want to cache here
const filesToCache = [
    '/',
    '/bootstrap/js/bootstrap.bundle.min.js',
    '/bootstrap/css/bootstrap.min.css',
    '/fontawesome/css/all.min.css',
    '/fontawesome/js/all.min.js'".$out."
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event
// typically used to cache assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(filesToCache))
    );
});

// the fetch event handler, to intercept requests and serve all
// static assets from the cache
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(response => response ? response : fetch(e.request))
    )
});";
file_put_contents("service-worker.js", $template);
#print_r($template);