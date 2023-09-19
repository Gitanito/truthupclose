if ('serviceWorker' in navigator) {
    let registration;

    const registerServiceWorker = async () => {
        registration = await navigator.serviceWorker.register('./service-worker.js');
    };

    registerServiceWorker();
}

let language = (window.navigator.userLanguage || window.navigator.language).substring(0, 2);

let oscillators = [];
let gains = [];
let pans = [];
let rotators = [];
let freqcount = 1;
let fullvolume = null;
let duration = 10;
let startsec = 0;
let endsec = 0;
let running = false;
let runningfreq = 0;
let runningindex = null;
let timeoutlist = [];
let bell = null;
let bellplayed = false;

    let minutesControl = null;
let volumeControl = null;
let mbControl = null;
let soloControl = null;
let solo = false;
let activelement = null;
let rotateControl = null;

let warning_ok = false;
let xon = {"de": "An", "en": "On", "es": "encendido", "fr": "allumé", "it": "acceso", "hr": "upaljeno"};
let xoff = {"de": "Aus", "en": "Off", "es": "apagado", "fr": "éteint", "it": "spento", "hr": "isključen"};
let w = {
    "de": "WARNUNG!\nVerwenden Sie diese Funktion NICHT während Sie ein Fahrzeug bewegen, oder in anderer Weise Ihre volle Aufmerksamkeit gefordert ist. Diese Frequenzen KÖNNEN direkt auf Ihr Wohlbefinden wirken. Nehmen Sie eine entspannte Position im Sitzen oder Liegen ein bevor Sie starten.\nDiese Nachricht wird alle 24 Stunden angezeigt.",
    "en": "WARNING!\nDO NOT use this feature while moving a vehicle or otherwise requires your full attention. These frequencies CAN have a direct effect on your well-being. Sit or lie down in a relaxed position before you start.\nThis message is displayed every 24 hours.",
    "es": "¡ADVERTENCIA!\nNO use esta función mientras mueve un vehículo o requiere toda su atención. Estas frecuencias PUEDEN tener un efecto directo en su bienestar. Siéntese o acuéstese en una posición relajada antes de comenzar.\nEste mensaje se muestra cada 24 horas.",
    "fr": "AVERTISSEMENT!\nN'utilisez PAS cette fonction pendant le déplacement d'un véhicule ou si elle requiert toute votre attention. Ces fréquences PEUVENT avoir un effet direct sur votre bien-être. Asseyez-vous ou allongez-vous dans une position détendue avant de commencer.\nCe message s'affiche toutes les 24 heures.",
    "it": "AVVERTIMENTO!\nNON utilizzare questa funzione durante lo spostamento di un veicolo o altrimenti richiede la massima attenzione. Queste frequenze POSSONO avere un effetto diretto sul tuo benessere. Siediti o sdraiati in una posizione rilassata prima di iniziare.\nQuesto messaggio viene visualizzato ogni 24 ore.",
    "hr": "UPOZORENJE!\nNEMOJTE koristiti ovu značajku dok se krećete vozilom ili na neki drugi način zahtijeva vašu punu pozornost. Ove frekvencije MOGU imati izravan učinak na vaše blagostanje. Sjednite ili legnite u opušteni položaj prije nego što počnete.\nOva poruka se prikazuje svaka 24 sata."
};
let cats = {
    "0": {
        "de": "Solfeggio Frequenzen",
        "en": "Solfeggio Frequencies",
        "es": "Frecuencias de solfeo",
        "fr": "Fréquences du solfège",
        "it": "Frequenze di solfeggio",
        "hr": "Solfeggio frekvencije"
    },
    "1": {"de": "Hilfe", "en": "Help", "es": "Ayuda", "fr": "Aider", "it": "Aiuto", "hr": "Pomozite"},
    "2": {"de": "Unterstützung", "en": "Support", "es": "Apoyo", "fr": "Soutien", "it": "Supporto", "hr": "Podrška"},
    "3": {
        "de": "Körperliche Entsprechungen",
        "en": "Physical equivalents",
        "es": "Equivalentes físicos",
        "fr": "équivalents physiques",
        "it": "Equivalenti fisici",
        "hr": "Fizički ekvivalenti"
    },
    "4": {
        "de": "Experimentell",
        "en": "Experimental",
        "es": "Experimental",
        "fr": "Expérimental",
        "it": "Sperimentale",
        "hr": "Eksperimentalni"
    },
    "5": {"de": "Verschiedenes", "en": "Various", "es": "Varios", "fr": "Divers", "it": "Vari", "hr": "Razne"},
    "6": {
        "de": "5er Set",
        "en": "Set of 5",
        "es": "Conjunto de 5",
        "fr": "Lot de 5",
        "it": "Insieme di 5",
        "hr": "Set od 5"
    },
    "7": {
        "de": "Frequenzen",
        "en": "Frequencies",
        "es": "Frecuencias",
        "fr": "Fréquences",
        "it": "Frequenze",
        "hr": "Frekvencije"
    },
    "8": {"de": "", "en": "", "es": "", "fr": "", "it": "", "hr": ""},
    "9": {
        "de": "432Hz Tonleiter",
        "en": "432Hz scale",
        "es": "escala de 432Hz",
        "fr": "Échelle 432Hz",
        "it": "Scala 432Hz",
        "hr": "Skala 432Hz"
    },
    "10": {
        "de": "Gefühle/Emotionen",
        "en": "Feelings/Emotions",
        "es": "Sentimientos/Emociones",
        "fr": "sentiments/émotions",
        "it": "sentimenti/emozioni",
        "hr": "osjećaji/emocije"
    },
    "11": {
        "de": "Programme",
        "en": "Programs",
        "es": "Programas",
        "fr": "Programmes",
        "it": "Programmi",
        "hr": "Programa"
    },

}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function drawTiles() {
    let lastgroup = "";
    for (let i = 0; i < list.length; i++) {
        if (list[i].type === listtype) {
            if (lastgroup !== list[i].group) {
                $('#freq').append('<div class="w-100"><h2><br>' + cats[list[i].group][language] + '</h2></div>');
            }
            lastgroup = list[i].group;

            let mytext = list[i]['de'];
            if (typeof list[i][language] !== "undefined" && list[i][language] !== "") {
                mytext = list[i][language];
            }
            mytext = mytext.charAt(0).toUpperCase() + mytext.slice(1);

            let desctext = mytext.split("|");
            if (typeof desctext[1] === "undefined") {
                desctext[1] = "";
            }

            $('#freq').append(
                '<div class="col ' + list[i].tags + '">\n' +
                '                        <div data-f="' + i + '" data-desc="' + desctext[1] + '" class="box card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style="border: 5px solid ' + list[i].col + ';background-size: cover; background-position-x: center; background-position-y: center; background-image: url(' + list[i].img + ');">\n' +
                '                            <img class="playbutton" src="img/play.png">' +
                '                            <img class="stopbutton" src="img/stop.png">' +
                '            <div class="balken" style="background-color: ' + list[i].col + '"></div>' +
                '            <div class="d-flex flex-column h-100 p-2 pb-3 text-white text-shadow-3">\n' +
                '                                <h2 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold text-white text-shadow text-decoration-none">\n' +
                '                                    ' + list[i].name + '</h2><h5 class="text-shadow"> ' + desctext[0] + '</h5>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                </div>'
            );
        }
    }
}

function startRotation() {
    for (let o = 0; o < freqcount; o++) {
        rotators[o].connect(pans[o].pan);
    }
}

function modify(oscillator, gain, pan, freq, vol, panv, changespeedsec, style = "linear") {
    let old_o = oscillator.frequency.value;
    let old_g = gain.gain.value;
    let old_p = pan.pan.value;
    oscillator.frequency.setValueAtTime(old_o, audioCtx.currentTime);
    gain.gain.setValueAtTime(old_g, audioCtx.currentTime);
    pan.pan.setValueAtTime(old_p, audioCtx.currentTime);

    if (style === "exponential") {
        oscillator.frequency.exponentialRampToValueAtTime(freq, audioCtx.currentTime + changespeedsec);
        gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + changespeedsec);
        pan.pan.exponentialRampToValueAtTime(panv, audioCtx.currentTime + changespeedsec);
    }
    if (style === "linear") {
        oscillator.frequency.linearRampToValueAtTime(freq, audioCtx.currentTime + changespeedsec);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + changespeedsec);
        pan.pan.linearRampToValueAtTime(panv, audioCtx.currentTime + changespeedsec);
    }
    if (style === "peak") {
        oscillator.frequency.linearRampToValueAtTime(freq, audioCtx.currentTime + changespeedsec / 2);
        gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + changespeedsec / 2);
        pan.pan.linearRampToValueAtTime(panv, audioCtx.currentTime + changespeedsec / 2);
        timeoutlist.push(
            window.setTimeout(
                function () {
                    oscillator.frequency.setValueAtTime(oscillator.frequency.value, audioCtx.currentTime);
                    gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
                    pan.pan.setValueAtTime(pan.pan.value, audioCtx.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(old_o, audioCtx.currentTime + changespeedsec / 2);
                    gain.gain.linearRampToValueAtTime(old_g, audioCtx.currentTime + changespeedsec / 2);
                    pan.pan.linearRampToValueAtTime(old_p, audioCtx.currentTime + changespeedsec / 2);
                },
                changespeedsec / 2 * 1000
            )
        );
    }
}

function start() {
    stop();
    if (running) {
        running = false;
        return;
    }

    if (getCookie("warningok") !== "yes" && !warning_ok) {
        if (confirm(w[language])) {
            setCookie("warningok", "yes", 1);
            warning_ok = true;
        } else {
            return;
        }
    }

    running = true;

    activelement.parent().addClass('sticky-element');
    $("#settings").addClass('sticky-settings');

    if (activelement.data("desc") !== "") {
        $("#playingdesc").html("<br><h5>Details:</h5>" + activelement.data("desc") + "<br><br><br>");
    }
    let set = list[activelement.data("f")];
    runningindex = activelement.data("f");

    $('#lightshow').css('animation-duration', (Math.round(set.lightshow * 100) / 100) + 's');
    $('#lightshowbutton').show();

    freqcount = set.freq.length;
    activelement.find('.balken').addClass('activebalken');
    activelement.find('.playbutton').hide();
    activelement.find('.stopbutton').show();
    $('#freq div.col').addClass('transparent');
    activelement.parent('.col').removeClass("transparent");

    oscillators = [];
    gains = [];
    pans = [];
    rotators = [];

    audioCtx = new window.AudioContext({
        latencyHint: "playback",
        sampleRate: 8000
    });


    for (let o = 0; o < freqcount; o++) {
        oscillators.push(audioCtx.createOscillator());
        gains.push(audioCtx.createGain());
        pans.push(new StereoPannerNode(audioCtx));
        rotators.push(audioCtx.createOscillator());
    }

    fullvolume = audioCtx.createGain();
    fullvolume.gain.value = 0.0001;
    fullvolume.connect(audioCtx.destination);

    for (let o = 0; o < freqcount; o++) {
        oscillators[o].connect(gains[o]);
        oscillators[o].type = 'sine';
        pans[o].connect(fullvolume);
        gains[o].connect(pans[o]);
        if (solo) {
            gains[o].gain.value = (!o ? 1 : 0.0001);
        } else {
            gains[o].gain.value = set.vol[o];
        }
        pans[o].pan.value = set.pan[o];
        rotators[o].type = 'sine';
        rotators[o].frequency.value = .5;

        window.setTimeout(function () {
            try {
                rotators[o].start();
            } catch (e) {
            }
        }, 1000 / freqcount * o);
    }

    runningfreq = set;
    changeFreq(runningfreq);

    for (let o = 0; o < freqcount; o++) {
        oscillators[o].start();
    }

    fullvolume.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    fullvolume.gain.linearRampToValueAtTime(volumeControl.value, audioCtx.currentTime + 2);

    if (rotateControl.value === "1") {
        startRotation();
    }


    if (typeof list[runningindex].program !== "undefined") {
        for (let p = 0; p < list[runningindex].program.length; p++) {
            let loopme = 1;
            if (list[runningindex].program[p].loop > 1) {
                loopme = list[runningindex].program[p].loop;
            }
            let startsec = list[runningindex].program[p].startsec;
            for (let l = 0; l < loopme; l++) {
                timeoutlist.push(
                    window.setTimeout(
                        function () {
                            for (let o = 0; o < list[runningindex].program[p].freq.length; o++) {

                                modify(oscillators[o], gains[o], pans[o], list[runningindex].program[p].freq[o], list[runningindex].program[p].vol[o], list[runningindex].program[p].pan[o], list[runningindex].program[p].changespeedsec, list[runningindex].program[p].style);

                            }
                        },
                        (startsec + (list[runningindex].program[p].changespeedsec * l) ) * 1000
                    )
                );
                if (list[runningindex].program[p].style !== "peak" && loopme > 1 && l < loopme - 1) {
                    timeoutlist.push(
                        window.setTimeout(
                            function () {
                                for (let o = 0; o < runningfreq.freq.length; o++) {

                                    modify(oscillators[o], gains[o], pans[o], runningfreq.freq[o], runningfreq.vol[o], runningfreq.pan[o], .01, "linear");
                                }
                            },
                            (startsec + (list[runningindex].program[p].changespeedsec * (l + 1)) + .1 ) * 1000
                        )
                    );
                }
            }
        }
        duration = list[runningindex].durationsec / 60;
    } else {
        duration = minutesControl.value;
    }

    startsec = Date.now();
    endsec = startsec + (duration * 60000);

}


function changeFreq(set) {
    //console.log(freq);

    let freq = set.freq;

    if (mbControl.value === "1" && freq[0] > 80) {
        switch (Math.floor(Math.random() * 6)) {
            case 0:
                for (let o = 0; o < freq.length; o++) {
                    freq[o] = freq[o] * 1.002;
                }
                break;
            case 1:
                for (let o = 0; o < freq.length; o++) {
                    freq[o] = freq[o] * 0.998;
                }
                break;
        }
    }

    if (oscillators[0].frequency.value !== freq[0]) {
        for (let o = 0; o < freqcount; o++) {
            oscillators[o].frequency.linearRampToValueAtTime(freq[o], .25);
        }
    }

}


function changeFreqProgram(set, time) {
    //console.log(freq);

    let freq = set.freq;

    if (oscillators[0].frequency.value !== freq[0]) {
        for (let o = 0; o < freq.length; o++) {
            console.log(time);
            console.log(oscillators[o].frequency.value + " --- " + freq[o]);
            oscillators[o].frequency.linearRampToValueAtTime(freq[o], time + 5);
        }
    }

}

function stop() {
    if (running) {
        hideLightshow();
        $('#lightshowbutton').hide();

        $('.activebalken').css('width', '0%');
        $('.activebalken').removeClass('activebalken');
        $('.stopbutton').hide();
        $('.playbutton').show();
        $('.transparent').removeClass('transparent');
        activelement.parent().removeClass('sticky-element');
        $("#settings").removeClass('sticky-settings');
        $("#playingdesc").html("");

        runningindex = null;
        bell = null;
        bellplayed = false;

        try {

            fullvolume.gain.setValueAtTime(fullvolume.gain.value, audioCtx.currentTime);
            fullvolume.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + .25);

            window.setTimeout(function () {
                for (let o = 0; o < freqcount; o++) {
                    oscillators[o].stop();
                }
                for (let x = 0; x < timeoutlist.length; x++) {
                    clearTimeout(timeoutlist[x]);
                }
            }, 250);
        } catch (e) {
        }
    }
}

function changeLang() {
    if (language !== "en" && language !== "de") {
        language = "en";
    }
    if (typeof getCookie("language") !== "undefined") {
        language = getCookie("language");
    }

    $('.lang').hide();
    $('.' + language).show();
    $('.xon').text(xon[language]);
    $('.xoff').text(xoff[language]);

    if (typeof list !== "undefined") {
        $('#freq').empty();
        drawTiles();
        $('.box').on('click', function () {
            activelement = $(this);
            start();
        });
    }
}

$(document).ready(function () {

    changeLang();

    if (typeof list !== "undefined") {
        freqcount = list[0].freq.length;
        minutesControl = document.querySelector("#minutes");
        volumeControl = document.querySelector("#volume");
        mbControl = document.querySelector("#boost");
        soloControl = document.querySelector("#solo");
        rotateControl = document.querySelector("#rotate");


        volumeControl.addEventListener(
            "input",
            () => {
                try {
                    $('#volumeshow').text(Math.floor(volumeControl.value * 100));

                    fullvolume.gain.setValueAtTime(fullvolume.gain.value, audioCtx.currentTime);
                    fullvolume.gain.linearRampToValueAtTime(volumeControl.value, audioCtx.currentTime + .001);

                } catch (e) {
                }
            },
            false
        );

        minutesControl.addEventListener(
            "input",
            () => {
                try {
                    $('#minutesshow').text(minutesControl.value);
                    duration = minutesControl.value;
                    endsec = startsec + (duration * 60000);
                } catch (e) {
                }
            },
            false
        );

        mbControl.addEventListener(
            "input",
            () => {
                try {
                    if (mbControl.value === "1") {
                        $('#boostshow').text(xon[language]);
                    } else {
                        $('#boostshow').text(xoff[language]);
                        changeFreq(runningfreq);
                    }
                } catch (e) {
                }
            },
            false
        );

        rotateControl.addEventListener(
            "input",
            () => {
                try {
                    if (rotateControl.value === "1") {
                        $('#rotateshow').text(xon[language]);
                        startRotation();
                    } else {
                        $('#rotateshow').text(xoff[language]);
                        for (let o = 0; o < freqcount; o++) {
                            rotators[o].disconnect();
                            pans[o].pan.value = list[activelement.data("f")].pan[o];
                        }
                    }
                } catch (e) {
                }
            },
            false
        );
        soloControl.addEventListener(
            "input",
            () => {
                try {
                    if (soloControl.value === "1") {
                        $('#soloshow').text(xon[language]);
                        solo = false;
                        for (let o = 0; o < freqcount; o++) {
                            gains[o].gain.setValueAtTime(gains[o].gain.value, audioCtx.currentTime);
                            gains[o].gain.linearRampToValueAtTime(runningfreq.vol[o], audioCtx.currentTime + .01);
                            //gains[o].gain.value = runningfreq.vol[o];
                        }
                    } else {
                        $('#soloshow').text(xoff[language]);
                        solo = true;
                        for (let o = 0; o < freqcount; o++) {

                            gains[o].gain.setValueAtTime(gains[o].gain.value, audioCtx.currentTime);
                            gains[o].gain.linearRampToValueAtTime((!o ? 1 : 0.0001), audioCtx.currentTime + .01);
                            //gains[o].gain.value = (!o?1:0);
                        }
                    }
                } catch (e) {
                }
            },
            false
        );

        window.setInterval(function () {
            if (endsec > Date.now()) {
                let newwidth = ((Date.now() - startsec) / ((endsec - startsec) / 100));
                $('.activebalken').css('width', newwidth + '%');
                if (newwidth >= 95 && !bellplayed && running) {
                    bellplayed = true;
                    bell = new Audio("bell.mp3");
                    //bell.volume = volumeControl.value;
                    bell.preload = "auto";
                    bell.loop = false;
                    bell.play();
                }

                if (newwidth >= 99) {
                    stop();
                    running = false;
                }

                if (running && mbControl.value === "1") {
                    changeFreq(runningfreq);
                }
            }
        }, 250);
    }

    initializeCookieBanner();








// Get all share buttons
    const shareButtons = document.querySelectorAll('.share-button');

// Add click event listener to each button
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the URL of the current page
            const url = window.location.href;

            // Get the social media platform from the button's class name
            const platform = button.classList[1];

            // Set the URL to share based on the social media platform
            let shareUrl;
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
                    break;
                case 'pinterest':
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
                    break;
            }

            // Open a new window to share the URL
            window.open(shareUrl, '_blank');
        });
    });

});

window.onpopstate = function () {
    if (running) {
        stop();
        running = false;
        return false;
    }
};
history.pushState({}, '');


/* Javascript to show and hide cookie banner using localstorage */

/* Shows the Cookie banner */
function showCookieBanner() {
    let cookieBanner = document.getElementById("cb-cookie-banner");
    cookieBanner.style.display = "block";
}

/* Hides the Cookie banner and saves the value to localstorage */
function hideCookieBanner() {
    localStorage.setItem("cb_isCookieAccepted", "yes");
    let cookieBanner = document.getElementById("cb-cookie-banner");
    cookieBanner.style.display = "none";
}

/* Checks the localstorage and shows Cookie banner based on it. */
function initializeCookieBanner() {
    let isCookieAccepted = localStorage.getItem("cb_isCookieAccepted");
    if (isCookieAccepted === null) {
        localStorage.setItem("cb_isCookieAccepted", "no");
        showCookieBanner();
    }
    if (isCookieAccepted === "no") {
        showCookieBanner();
    }
}

function showLightshow() {
    $('#lightshow').show();
}

function hideLightshow() {
    $('#lightshow').hide();
    //$('#lightshow').css('animation-duration', '1000s');
}