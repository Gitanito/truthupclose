
const newversion = '20230319151615';

const cacheName = 'vibrations';

// put the static assets and routes you want to cache here
const filesToCache = [
    'bootstrap/js/bootstrap.bundle.min.js',
    'bootstrap/css/bootstrap.min.css',
    'fontawesome/css/all.min.css',
    'fontawesome/js/all.min.js',
'3dcourse.html',
'binaural.html',
'bodysound.html',
'fullboost.html',
'index.html',
'jquery.min.js',
'list.js',
'manifest.json',
'papaparse.min.js',
'podcasts.html',
'service-worker.js',
'singlesound.html',
'sound.html',
'tools.html',
'vibrations.css',
'vibrations.js',
'video.html',
'img/259735.jpg',
'img/259929.jpg',
'img/3053969.jpg',
'img/3D.jpg',
'img/5250691.jpg',
'img/abacus-g4f6c2fe99_640.jpg',
'img/adult-ge16ab3c40_640.jpg',
'img/anatomy.jpg',
'img/animal-g6e29370ee_640.jpg',
'img/arm-g636c9e0fa_640.jpg',
'img/athens-g6f41add55_1280.jpg',
'img/background-ge4989a578_640.jpg',
'img/belly-gf80e2a51b_640.jpg',
'img/bg_space.jpg',
'img/bird-gec2d2722d_640.jpg',
'img/birds-in-flight-g79cbc6175_1280.jpg',
'img/black-hole-g00cc7c7dd_640.jpg',
'img/boarding-gbb481ed70_640.jpg',
'img/books-g545e686c6_640.jpg',
'img/books-g89d0d5e37_640.jpg',
'img/brain-gdf54a8d74_640.jpg',
'img/breakfast-g36eabe351_1280.jpg',
'img/care-gb1da9284c_640.jpg',
'img/castle-g24f13cd1d_1280.jpg',
'img/chakra-blau.jpg',
'img/chakra-flieder.jpg',
'img/chakra-gelb.jpg',
'img/chakra-gruen.jpg',
'img/chakra-lila.jpg',
'img/chakra-orange.jpg',
'img/chakra-rot.jpg',
'img/chakras-gd67167a40_640.png',
'img/colorful-gf04857371_640.jpg',
'img/compass-gb5b3731da_640.jpg',
'img/connective-tissue-ga6d7e598b_640.jpg',
'img/conversation-g36eb3ddfe_640.jpg',
'img/cy120l19-360-panorama-sunset-in-the-dark.jpeg',
'img/daisy-gae05a0139_640.jpg',
'img/dandelion-g0d325b257_640.jpg',
'img/dandelions-g3b04e8636_640.jpg',
'img/droplet-gf9fbdcf52_640.jpg',
'img/ear-ga3cfbb604_640.jpg',
'img/eet-g0d5463b75_1280.jpg',
'img/eye-g92873dafd_640.jpg',
'img/eye-gd05c61b68_640.jpg',
'img/filter-g5e7f24ab4_640.jpg',
'img/flower-g686369a58_640.jpg',
'img/forest-g8888c2f62_640.jpg',
'img/fox-g273081c1e_640.jpg',
'img/fractal-g2eed7d16c_640.jpg',
'img/frequency-g5def81d85_640.jpg',
'img/freude.jpg',
'img/galaxy-g22304fabb_640.jpg',
'img/gemstone-g28de21b17_640.jpg',
'img/gesund.jpg',
'img/ginger-g0c1145b24_640.jpg',
'img/glueck.jpg',
'img/hand-g507065235_640.jpg',
'img/hand-gca6fa87ca_640.png',
'img/hand-gd00280d7e_1280.jpg',
'img/hands-g27189ad3f_1280.jpg',
'img/hands-gc41d68a32_640.jpg',
'img/hands-gf96359ece_640.jpg',
'img/happy-mothers-day-gbdb1f8275_640.jpg',
'img/harmony-g46ec50c30_640.jpg',
'img/hd-wallpaper-g741dccedf_1280.jpg',
'img/headphones-g5f0ca1b5a_640.jpg',
'img/heart-g11c2ae39d_1920.jpg',
'img/heart-g9a27ca01c_640.jpg',
'img/heaven-g7a51feb35_640.jpg',
'img/hiking-gd967dfc21_640.jpg',
'img/homebutton.jpg',
'img/homebutton.png',
'img/infant-g57184ba03_640.jpg',
'img/inspiration-ge68dca3f4_1920.jpg',
'img/jonathan-borba-3eC5n6gHwe8-unsplash.jpg',
'img/kidney-g824c2738d_640.jpg',
'img/kiss-g4097dbd6e_640.jpg',
'img/kreativ.jpg',
'img/lamp-ga434e4fc3_640.jpg',
'img/light-gc12a26841_640.jpg',
'img/light-gcb07a0af4_640.jpg',
'img/lion-g89034e545_640.jpg',
'img/logo.png',
'img/logo1.jpg',
'img/lotus-g4284cce54_640.jpg',
'img/love-g0c3de754e_1280.jpg',
'img/male-g907e9db8b_640.jpg',
'img/man-g43f96aba3_640.jpg',
'img/man-g5106a4ee5_1280.jpg',
'img/man-g7652a3983_640.jpg',
'img/man-gd0343b94c_640.jpg',
'img/man-gd6adb4c93_640.jpg',
'img/mandala-1.jpg',
'img/mandala-2.jpg',
'img/maple-leaf-g038a1e4f1_640.jpg',
'img/meadow-ga6a0d7d67_640.jpg',
'img/men-g29e1ca941_640.jpg',
'img/nature-gf527aac49_640.jpg',
'img/night-view-g7f6fe0e4e_640.jpg',
'img/nose-g66bc60356_640.jpg',
'img/paper-g84892f294_640.jpg',
'img/planet-gd76ab1f98_640.jpg',
'img/play.png',
'img/pointing-gd2ad379fc_640.jpg',
'img/positive-g363c7b752_1280.jpg',
'img/profile.jpg',
'img/room-g791600391_1280.jpg',
'img/saint-ga85fbbdfc_640.jpg',
'img/selbstliebe.jpg',
'img/shoe-gad2c2199b_640.jpg',
'img/silhouette-g31411df0b_640.jpg',
'img/singing-bowls-g49e03b978_640.jpg',
'img/singing-bowls-gd99284f40_640.jpg',
'img/slimming-gd616c88f2_640.jpg',
'img/sound.png',
'img/soundoff.png',
'img/sounds.jpg',
'img/stomach-gc91ce83a7_640.png',
'img/stop.png',
'img/stud-g343e83bcd_640.jpg',
'img/swirl-geda463af3_640.jpg',
'img/symbol-gd2ba77619_640.jpg',
'img/tealights-geb8741839_640.jpg',
'img/teeth-g1ca9189ed_640.jpg',
'img/testicles-g3c5f2b0e9_640.jpg',
'img/thanks-g411edba99_1920.jpg',
'img/the-breakers-g260f2eb2e_1280.jpg',
'img/tribal-g6fb1667ac_640.jpg',
'img/upper-body-g61a50f82f_640.jpg',
'img/vacation-g4cdf340f8_1280.jpg',
'img/virtual-reality-g843fa476e_1280.jpg',
'img/wave-g3268afc0d_1280.jpg',
'img/whale-g9b2a1dedb_640.jpg',
'img/wildlife-g82dff3606_640.jpg',
'img/wohlstand.jpg',
'img/woman-g0e390c31b_640.jpg',
'img/woman-g3e45f5c16_1280.jpg',
'img/woman-g4836b432a_640.jpg',
'img/woman-g7443a7634_640.jpg',
'img/woman-g904eb5e0b_640.jpg',
'img/woman-gffb1fd51d_640.jpg',
'img/yoga-gea58ede33_640.jpg',
'img/yt.jpg'
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
});