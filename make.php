<?php

    $list = [];
    $exclude = ["CNAME", "make.php",'meditation0.mp3','meditation1.mp3','robots.txt', 'sitemap.xml'];

    $sitemap = [];

    $scanned_directory = array_diff(scandir('./'), array('..', '.'));
    foreach($scanned_directory as $sd) {
        if (is_file('./'.$sd) && !in_array($sd, $exclude)) {
            $list[] = $sd;
            if (substr($sd, -5) === ".html") {
                $sitemap[] = $sd;
            }
        }
    }

    $scanned_directory = array_diff(scandir('./img'), array('..', '.'));
    foreach($scanned_directory as $sd) {
        if (is_file('./img/' . $sd) && !in_array($sd, $exclude)) {
            $list[] = 'img/' . $sd;
        }
    }
/*
    $scanned_directory = array_diff(scandir('./img/icons'), array('..', '.'));
    foreach($scanned_directory as $sd) {
        if (is_file('./img/icons/' . $sd) && !in_array($sd, $exclude)) {
            $list[] = 'img/icons/' . $sd;
        }
    }
*/
    $out = ",
'".join("',
'", $list)."'";

$template = "
const newversion = '".date("YmdHis")."';

const cacheName = 'vibrations';

// put the static assets and routes you want to cache here
const filesToCache = [
    'bootstrap/js/bootstrap.bundle.min.js',
    'bootstrap/css/bootstrap.min.css',
    'fontawesome/css/all.min.css',
    'fontawesome/js/all.min.js'".$out."
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

$smtemplate = '<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
';
foreach($sitemap as $smurl) {
    $smtemplate .= '    <url>
        <loc>https://truthupclose.com/'.$smurl.'</loc>
        <lastmod>'.date("Y-m-d").'</lastmod>
    </url>
';
}
$smtemplate .= '</urlset>';
file_put_contents("sitemap.xml", $smtemplate);


$findlangs = ["de","en","es","fr","it","hr"];
$list_ = file_get_contents("list.js");
$tokens = explode("{", $list_);
$groups = [];
foreach($tokens as $t) {
    // find group
    $g_ = explode('"type": "', $t);
    $g =  explode('"', $g_[1]);
    if (!isset($groups[$g[0]])) {
        $groups[$g[0]] = [];
    }

    $n_ = explode('"name": "', $t);
    $n =  explode('"', $n_[1]);

    $z = [];
    foreach($findlangs as $r) {
        $u_ = explode('"'.$r.'": "', $t);
        $u = explode('"', $u_[1]);
        $z[$r] = $n[0] . " " . $u[0];
    }
    $groups[$g[0]][] = $z;
}

$fillupfiles = [
    'sound.html' => ["sound"],
    'binaural.html' => ["bin"],
    'fullboost.html' => ["five"]
];
foreach ($fillupfiles as $fuf => $cats) {

    $mylist = [];
    foreach ($cats as $c) {
        foreach($groups[$c] as $line) {
            foreach($findlangs as $lang) {
                $mylist[] = "<h2 lang='".$lang."'>" . $line[$lang] . "</h2>";
            }
        }
    }

    $content = file_get_contents($fuf);
    $start = explode("<!-- freqstart -->", $content);
    $end  = explode("<!-- freqend -->", $start[1]);
    $out = $start[0]."<!-- freqstart -->".join(" ", $mylist)."<!-- freqend -->".$end[1];
    file_put_contents($fuf, $out);
}