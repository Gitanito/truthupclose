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
let rvaudio = null;
let rvaudiolist = null;
let rvxaudio = null;
let rvaudioplayed = false;

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

    "12": {
        "de": "Information Research Technique (IRT)",
        "en": "Information Research Technique (IRT)",
        "es": "Information Research Technique (IRT)",
        "fr": "Information Research Technique (IRT)",
        "it": "Information Research Technique (IRT)",
        "hr": "Information Research Technique (IRT)"
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
        rvaudiolist = null;
        if (typeof list[runningindex].randomfilelist === "object") {
            rvaudiolist = list[runningindex].randomfilelist;
        }
        for (let p = 0; p < list[runningindex].program.length; p++) {
            let loopme = 1;
            if (typeof list[runningindex].program[p].loop !== "undefined" && list[runningindex].program[p].loop > 1) {
                loopme = list[runningindex].program[p].loop;
            }
            let startsec = list[runningindex].program[p].startsec;
            for (let l = 0; l < loopme; l++) {
                if (typeof list[runningindex].program[p].freq !== "undefined") {
                    timeoutlist.push(
                        window.setTimeout(
                            function () {
                                for (let o = 0; o < list[runningindex].program[p].freq.length; o++) {

                                    modify(oscillators[o], gains[o], pans[o], list[runningindex].program[p].freq[o], list[runningindex].program[p].vol[o], list[runningindex].program[p].pan[o], list[runningindex].program[p].changespeedsec, list[runningindex].program[p].style);

                                }
                            },
                            (startsec + (list[runningindex].program[p].changespeedsec * l)) * 1000
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
                                (startsec + (list[runningindex].program[p].changespeedsec * (l + 1)) + .1) * 1000
                            )
                        );
                    }
                }
            }
            if (typeof list[runningindex].program[p].file !== "undefined") {
                let randomt = 0;
                if (typeof list[runningindex].program[p].maxrandomsec !== "undefined") {
                    randomt = Math.round(Math.random() * (list[runningindex].program[p].maxrandomsec - 1));
                }
                if (typeof list[runningindex].program[p].prefile !== "undefined") {
                    timeoutlist.push(
                        window.setTimeout(
                            function () {
                                rvxaudio = new Audio(list[runningindex].program[p].prefile);
                                rvxaudio.loop = false;
                                rvxaudio.play();
                            },
                            (startsec  + randomt) * 1000
                        )
                    );
                    randomt += 1;
                }
                timeoutlist.push(
                    window.setTimeout(
                        function () {
                            let myaudiofile = list[runningindex].program[p].file;
                            if (myaudiofile === "randomfilelist" && rvaudiolist != null) {
                                rvaudiolist.sort(() => Math.random() - 0.5);
                                myaudiofile = rvaudiolist.pop();
                            }
                            rvaudio = new Audio(myaudiofile);
                            rvaudio.loop = false;
                            rvaudio.play();
                        },
                        (startsec  + randomt) * 1000
                    )
                );
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
        rvaudio = null;
        rvaudioplayed = false;

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
    bell = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU5LjI3LjEwMAAAAAAAAAAAAAAA//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAB5AADHLgAGCAoMEBIUFxkdHyEjJSksLjAyNjg6PEFDRUdJTU9RU1ZaXF5gYmZoa21xc3V3eX1/goSGioyOkJKXmZudoaOlp6musLK0trq8vsHDx8nLzdHT1tja3uDi5Obr7e/x8/f5+/0AAAAATGF2YzU5LjM3AAAAAAAAAAAAAAAAJAM8AAAAAAAAxy5Z5dXdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZECP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAEWQFJtyUuueiCBZoACKBgYG80/V8ezx5rGv///f4pT3v77xTXve8TUN/HxAiagavDj4ePHj/cBWPKv38e+//83Y1BMxoeo7KxQMm6UeUzDj7vf4pr+j/cBWMlX6vQ8uDo/yDmW+LYThUQHlP/fDAh7mpDQUEE5zTVc14b9/Z5EYzQWFOaZ1vk4aCgVdk4aCEQTnOuEaarbDkQyZjUbPm977w8in+PQjDfE3JezEoHoOnjU88888888888/xQUGm+YLrHi54Dzf1A8hMX/iM79XNqd//jxL9DVwnjm//+HkRPoeuU6cq6T3//6rNA0EIOtDy/NrWT0XY4f//+oy4GghBOzTR6CnnvFcZv///+XBDGQ61fHZNfcZmesr2E+V3/////3TUN/HePIj9/BesNnz6tYv/+5JkmgDwAABpAAAACAAADSAAAAEWCZxdVDeAAAoAQAK2AATr///////47ylL/016U1e9cWtmK9XToVG//9CZbLbbfX3avhE931/tKVr//9lVf/d7RIZp//0Fxc8UTgbhkEv/8y5cFgNA8MJBqAKHQfC3//4Lw/PDwUMPezTRUo4pRVf///r/99EhigVCQU/7/+uGaocDUgAAAGGA5KmTOlKn1Xa8kAtyYMxmMhCE1m2fa0mTJeJk1RNUF0jZIvGxeIsbGAfGXS6XS6iXTFIni8kVkjIyNjU1YqsVTxiXS8RYnjYpEWGeFfE9A0gB0yLQI5GIAJgCUitQWjJ5yUTIEaGZqYol01MTUpOTRsbTJ0lF1jFFFkVmToOorIVVtsnRVvUqpaJ6YorNV///1j7apSSSRHCDw2EnWliHmXRlZfxPwgQIpNMMB+dUKpdWVM6NNZSs0wtyRx2c6AwrlWmZr/91b//+piocGd/7ACi56aSLlm//ySEO3MJkZ9d2ZlUgtasPTSNzZ4YqtCwQtekzmakjnd01fvcc7/c6u6KUwWVQ//uSZP+ABN9jWE4h4ABUKXqVwSAAFPF1O92JgAjxE6t7niACiQY2amNat2v3Duu3qa3rsjn4tEp+1qtYr5S5jKmIGCjCEI7slDk5AeXkAsUGCleaLaNR9SFZJEQfnGCiRPNCtQ/Z1C26cKvXY7l0IsUdBKEEd3uncelGnVxHTvZZidOOZx7et1w/n/7uOSQqrI1FMClQtJHnv+LdbxERCO7LG2A4wLEwAUKSiNksOVMm4+VWhjeaAseT01ExSL0d9fv5Gm1D6ZEcK74YZocj/1tJWO9QkD32/kiSitQEAlUJlci7qNy12pVKW5JkmTv4cOv9jT0tNKbmWsZTGe552cK/J+vDBggPIs7stu3sY9PXa2GV7Ueq4ZdnJ25jTRGW3pjc5CkvSyoVIz8yAwEECA5oRmICJTqx4ZXIZc5IEqdB3E/nTVX2Gcc5p2t6W7Hpzc78s9dIbL7Wy8/NLfsE9kzO4ikWDIfpz1a0D61P96KhqEKzrVuBTKZwJi0zVd/+9HImA2oGba1Zwe0gLmCmEnCEgWqp6CZHfKMIB16HkKhqS//7kmTUgwUbXEsja5+wPkJqzyXmRJRhcSiNsh6BCqYp9PGV2i9V8pP//0V9OZWUPVYl1brat/Nan20Zm///+FioiVUlNgBwQAx2ixx3u1Uq0ucUVOa8pize8kXsczj0plVm9jnMW8spdhKYY7KgMZSedva+ZjmVTDdDOUOM5E5ZSyGFNO+cxu18b3NTxbUxoLAEWFzYwgVX4SAJgfSYcGtiqtkqyyPh1I05QlSr1lWjYghk52L2zeePqVEyDIKcTrX0UYlTWVzk6K4xhWGpA3XNQbO9P8DRM7UzhVBNkXb/rauJoJwxA8yVW1hwPn6g3oIyIG606YdLqJFFKmt/3RkrRIELVmspTMima7Frcz7fMoMYzifol1UvZqbjDIb7aURH7KHA+NDrb/7f/q8kJSEDZ5fRWbmNLapYjASqI6EgJVhkGNVjkfi+MvlO6m6tmZrz2713KAaV2RIiPzUdJtZ23TQXfq7jFrLVaWT97OHWoRqO0VeaprcxfcKBwwMmEEibKA5cR9gcAzOClA0fU4edtiHvDZD2IehMOO3tdnj5ivT/+5Jkr4ME11zJW2lXkFAHyl0wxYSUuXMfDjz+QWclpvz0nhDNdzPpIb2rtmhbt56f5PjYC4SGq5UziA9nUs1WeriUVBeLXblH0F0rX/CJu+hwJWH/Szu7SB061IhKFrbtK01B+vtEpKCFDgyb58nSf80VzUaEymzRGyInsaA84+xtGpc56n0qb1aauw6IQcDtQGiWZPrU1zcx6m3nHLr+bprMYUiSEysidL//5X/9ShhAA2zzPrEZdO07oxprzEURjDgLPFvc4IAx4ZK0SKJ0EdqYXL0RlCEUP6uV41MsufpQ4yCL4J0VAIyGyzGEOi1qXWsZBH5DJ0nn2oZTHEmoAjc6+sSis8+CmcmEIALhMEBnNIgfQYHQNEYaGSFMGa4bA4BXa0/StrXYoQgQxeZo3eYZbvQJEIw/NmUzFTGt7n1qsRqQz/bMWq01LMxaxG22T57W7JaTf5S+zqtzK13lBf9ZMkidBLifyijrKK+W5xzC1SewuiQXfx9jCd01Xeuqca6cEC0WltuD7Cno5bhK7OVWZvVoElxMwUDCQjXlUIEk//uSZHkDBrlixKudjlBsaWkkZGryVIFxGQ49vkFtJaa89qrYHZXDdHR03ybVnmv3Ypbam3K1zH9d+/rC1a7hbu4Y/Wy7av6yy12xyWRV2CNBlr8zifyzqWdoEzb4g1FGzOSykznW5SZmuVznISix0bp//wzeURgGH9i7X+T1y3LYajEBpoAkSmlOeZVDpfxrb+Rifjk/Q3fr2ERMefyr8Jom6jAguUysyk87NeDL+v1M2Ks1TyGtbzeyfvX85m1bwpJh4oNTQMuAVmC6wICDT8YNGA4OAbEEQc5fIEAc2aTWN/W4TZj7iR70tDfVi6pA3nUXOdtRSc6PYl+Y2zVboKNnzBPUikUA1rV2+739+fKNlu1yRIXne5S1d2dgiobKIDZhtckHLmDruOaQ5AZTwt7daaZOQNM7ysY431J38fUsA/Rk3Uh2UtFCp0ltT+p3XqdIXAWLooCOQ1/7fmTUk8gZTkVWU1UqyCQIgEFFom67//iSXiWmQHCAqxVlNRXusSXUMSh1nLlMNCoKM3QgyOBFcw99SzK8ZfKKlLXWHv3v/v/7kmQWgQRGXMfbm1PwRclp7T2HPo8lcSGt1ViBAqWqPMeeQvy/44YACzHx5QvW862Xe45YfhBd7u8r+Xcvs9/VPUhqLFUGGhF/W5CgGZTrmhALXrLkYrFzSItOhUmRkbnGalS3T35Q+pOPm1bnPznyidY/Dq+d+b/5C38oO+yuWu0XaUNAxsEycD8aFKzY1YdkRO0J1IfFlWcuPKE652/Bxrs7y1rDJ/6fOonZf/nBYnyRb/9/10TI7Kjtd/lDA3///+KRlNFABxUAAQAJdldFJTVssdX5yH0JBvsQESiz4Ep4LjGOGVSmuyxRrfdU1PGWsZvcGB1vldTnvPX5oy5DT+pma5o63PMfIkEIAD40yCBl8DGiBAKM4pQi4rkAruiltBHVZzf0HOf38oZMcc6+vTzm7yUO/N/T/+yeULq7O7k0Q9eoH+CHwsQdlS0tXrUmji+ov1n1tWUl7Pxu/Ge1W79E2d7GV//9+v///a6si1Qcft9UEUHS9um3/4nD6iiWAHHAQAkCyZyozjjj3F/mtRFnxAEzBNBMCA1u0zUlkXn/+5JkEQAEAFxH65VUYEKpai0t55CP5TkbLZ2+gR0lpvSxHsrezFAxL4Nw9I3NRql0VqDggVXF2KNdddFSanRJh6kk91HNZfy8J6BgLJ4gIbMBiBHAHH4ZE2ISIVTUVrxKfU15q2i4ryR+e2MiWcRFdq9Hyj9S3aJQd+d+f/93X5EXtF2E+2dgelA3IJpfGkcMBXAiOa6bJg/TUUnFBbTwozIe4sMP5fqfXs6+/t/UlzX//frmPY1EF/Jm+7+hox///+KQaCoFkACIsM+bvWu18a1LDsibUMBjylAXBkWXvlEQm8LvaXGhxXt3971dhqebkCg+1go/Nb/n5c/dbuHXwsf/6y73WfO8fzdmw9aNVJAaCAynKMsAmdxgaDcHhjq9YK8q1VR8oDTs7sZzy1nGfXr09VrUjOBrX5juOrd39P/3qlFJHBJHDWDYwygmblh7bTFj9AaHATHwvf8V21wxq/ZbJMQWo/u05VCqF/SrfsJyHAwl/+35qn7j4uVIk3ZDW2PqNBT/r//2DwVAIzAaGGTMFYZ5Wd8m5IwsQBozHdjG//uSZAuAA8RORsuPo9BAaWoNMWWCjtFvGS4yrsEXpaW88aqAQSVO7EbfuE9M4pmQpNf/O0a9KkBkrYoSkz/b5+EDuS6OJb66jPjn5qKaOwqkWD5QNzNAm1FGKhgdI5Kt2qI5s69vnSSfMfXzp51HTDet9q6j/O+buIwEXR7GSpgVVs+R/ql11G2tVwmkBwnehbJTzpMh1JoW6GhXWKNreo1UwN3/dTF1fp1fjHtudqlb9uJN5NPF+j6IuopaM5D/4b///+gaJQFmACAXwawxWDq2NA+LhNadlW4ABU1TUTOANSSfnI7Jye1kbkK8E7fNp4XvDQA4BoSNC4iL7aivxfmuyK9RffGYueI0eSiNQIQGAQ7wEgcZwmy+VCu/5G9F/1FkucoOvVyyjzX/fqf39QlRJK9f//1f5gO//USqzuCuscTAbYaoYkjZZtVyqRrAdL4BYK5KzzRJfb/G2AMzO9sbhCImyv/blE/zbX6G5oD4mv/9v/416+n5xUVOn//+JAdqBECmAgAICWvzLcJypbwq15ezgwCCzYkBM9gdChp8sv/7kmQPgAPFW8ZTlFWwQklqDTynrI9NbxlOMq7JIKWk9Pw1GBiNxinxz1VpFlb/9cuv5SRMAoEbx0BmUGt2MK2GdP6XzZ8Zut0kzclhG4HGJgrLEkImRkAV1/Ep+/9RRz/XlS9CIf+irNzkLtkDvmweR26ftT/T/KPm6XezRLbcdds9g7KC3QGHO8QIE2VQc+BzOBO0IZ/rOc1p9j5pnsxlIUMxo7r7sxxhaqxVdCr/8Iv/+fp/oXk//kf///xAMioBZAgAigyaYcuV3aOktYymAlkioiMYaoxCGFbY9XjLJ9R+/OvgA5Mta0V6nIFgSecRAT6y91VEBRTYhh/uvWXuQR0XSMSkOkGoAAwQ2gMMgQck4xsTrfkNfn+z1lgiO5d9JtZ+uVvQ6vfnOo3YXxaX739TO6tF//nF1FbgdLzaBWwZLgU0b3P9nRTE7LpREG9ZrTY9sasW37gsnemjLxkXiX1kbt6qW2z2q82/ZIRgRTf/Q6vX0jd9Ju/9Rv///+RD9RjQAEnXJdenptSr41A0Ct8NCJ+IqTnpQFtAl8N0FD3/+5JkD4EDuFvFs3VUYEVpaU08bWQPlXEXTj6tQRmlZ7THqT5rrNQwU+6CikkTQKAs2WGTC41r7Zbqkcr+dSbIPrQTNCDhgADJaEAOYAg8ggqC8QBAu2F03L+2cN+U9ug7OKjRTT0MbK+XeiN3g4OXM+3X6Vr/ynb0RXbrTjtBtvWwWqBxwWrwIuNwoLerH4ApGeIOCHnGyNg8MpknY1kiSGcIPv29B/1JdH+oD8c7/6fU22uspPmPZf7LKW31//844BAMQEBKyXvxRXrWNiRMqeNVARiUy1yTFodDgN9WKx2yXlrNCfCI1+ocZ8aKtN0G5rlEDrt8+snGzY91c7bIJdFkiiOUBQAgYpZYGQgCLiLqRiTSSK/IC2o//WVuZt35wvU1FVSvUpCpbJaCaC88wuh4SVXd/bXvf/84yuiS24W222EpEDY/IripozqWPJ8fOCyw2yVrX23n4lGPj/xM7vYjMmQ1jh+qTU3RK9e8/nf2BUCT//M9unUzlPf91JO/p//yigFA0yA5EdJiHZ+/ldi0ZhmHmcgEFGooIZrAiXMD//uSZA6AA8VbxkuVPGBCSVktJxBSDvktFy5RUcESJaU0yalgXpqSy6qiySzMQe+aH0CtHKEZqY+F5p72qL6KnLK+vrR5F69IvkMDZwMVJUAoxi4CLjcoI59fEblC+5uohKG402mO6AcarHC+7PTdn3rVn1hYGH/v/7//yn7fZ0lttiOyxYGMg1IK26cYJ1JFSgp6WL50VpFJklIqUXBCRvdrDnLYXw0//11syTUL9H+dDOydVt/p+3+e6f/6kf///zgggbYAMgGA7TGzx3PWE/IJXUYeAAga5mRnAFIVtcjbX3YktIyFyABfwxUt1MTiI+w6J4p4b1r9Zeegi/+e5BK7nS8RUMbAbD0AqaFhPnTIhqP5AeWH6aKKGdTmbflCzuePnot80+s/qvdzw4fqf6TXXkLO7spiq0NuXD6by8KFgOoB/tOQ1SOHwcFMB0xxitCBlo0Tn+o3ERQZbOeeeohUjII/9euvRVd1nf3BZC22y/zOrf0bt//f///8o1UAgI8gKRSSgs1Oc1zbvNedFPYQB8yjoTGwXUyjuWpFSZbSTP/7kmQRgAPQS0XLlTxgQclqDTIClJAxLRMn8ojBDRQkNYFCmAQAS5ooJE+iTgapRUHlIst9nUgPKTqKD17VUHyJ20TAdYX4AwmtAAhAMuRQgeQMo3B9xM3TUoErHxSq5hiGOMHUDmXXdDFV3VnpnmRWCJGiJt/+Q/tXmLrtjtv7sJrQUy+Fhl9kpeaHkvGuAUVB79YmWo/ztIIAKLQorc4imS+mMK2lnP2f1y//wT//n6t/QXw3/6p///+CGAABKCBAIenzIravYF2/hbFBYNnFiKJXMiCC/38hiX3rteVQFCxu11InFmQXKTSDchchl1PpE/WmRjbLd3UTClKHYutjQqkkIAgcdiCOaJkRAwLI+kk7PkBbLB7bVLBf0Sgr7OUz11Gf202/s/aSpIsQQvkMsJK0DDpCPdpcpTGDu4MtIOTUWgEAWouvyY1lSU1eRVqeGDXREh17FuX1Mvvf+EaCG2KbagiTCRGDFcukZZ6Vb1bmXtoBhIaD38pX6a/0f/kFAIBXNAUkDNIZjlFlSZuDBL1KpjAoMb9gwgHlV30lcvj/+5JkEAADz0vFS5GsMECFCR0zLVIPbSsVTaKYQPcUJHWENZAS/YMnqLwVB51H3UXVkyIYyiGhUIJ0lu5iQxNTkWPNS3nLKknVZRiPwXiBRfgOAI+DNM8fe3kWfUe/VLetNv51qkytdtTe9+pdrx/Kp3UeXJMqp6jPpFtSbyiacgklq2AjAGg4HGCtlriUlRB1BIzW7sSr8dSKSnWoxArH62dny/kVDrVXW6LJq2Xtbo/0Qk4tX+uvxNKfWv/9AIgSQIgIkMAjacccjHKfGtFn9XUYEEnm/JxAGNAT2y9/5VvLnO4V0k7X7r27Ea3EmJ668BMC8715m4BqO4A8dF/FMzxuS3ebk4KXA2CcEY8WwnzMwKa/yZ6y1R9yybLWsuvqRUtyy+iWv9/Vv/H8a+6QuoQL/CGh+7UKIMaTDdlGwLJEfzS6i+FDUsffzs2h5ibIID0Meldsg4E4ZVfRWrOlnRvY4ydFu2qvmX9YGkl93VW/kpb9P/6FMcgCtlWoEsdW23SUWbuq8bqV5QtM02kORssjdJGKe9XRRSUYBqxHWt2W//uSZBUAAxBLSWtULGA7hQkNGy1CDq0vFS5QsYDrE6Z08J6CmQysbg7eik6SiSQqI0+mtS3ukbvv9SyOAoiD3keX+b26bqKcZ/qPXGk9dSJ19doRVf9KavIdDugJpwBi0WgIgKLPIwE85MjLHTggL3NcTQTWgv5Jgn91KdVAyR5G+6rWda2e/UtWY/0hGBFN9e/or/R/+SFECGFBQYSu1GiURWYpa0AstiS8QaHDOWIMnhRMV/uZRmVWV6BDw3aSdSZskYoDOoQ8guNLo3WVEFzA//QPvUSL9MwJsRwBn8wDFwZMnBATAQmj4dJjR23oCo5RPdKcfsLPs6bdNb+8aPSzpq+ircDL16qH6BzbkollrtDbYWnMvF7eIwvY6rOKo+1lHPYdcv8fGMsgZ0OmRICGZLFAI/57bPrecjz//EG/q3/V+v/8kgAAWjgpE9IxHa123rdateftDQ5diDrxUcCS+V1JvXdb5OJDW8+J3QxzsfQeN9qsp2RH5BFaad8+vK3RSRLws0DGwwLPSJMihv4FwbdS4I/Z2/I/EfmSyU+p9P/7kmQtCAMgS0ZLdBVAOyT5fTxtco1c8RTOVK/A7xPlNMwpYIN/+3s0df0rYutNuQSSSSFNIOD472+NBgyrR/raQuFStlgVcw5xsqjgUVt3atiCpYqEr79Hqf3Xv1/5LEZ/2yPvv/f/9YYwFBTFcjDnchyrT4X5dHVHiqIQZoxwMsYgukLhuaVPUkF7TV3pnFoIDIosQ8KAZ1rSbMxzkjJMix7+mlVJ3rQOkYH5gYGQoBwbIAXxMgfP+K8LLT7hqYlWzcZaXt3U/J/Zso/vrtUOV00qUdmGu+34dCDfDPK3sfusHRVmhRkWhmmtU39xw7n3FC6/z184Tz4ZAr0n826FNPpfT+oPm0eyR987//+uCQRAilMgEbUrgNakK7Lt5ajM8/Kmx5JA1+ajR2I5Dcqqug7kyCJZ9GnQKCi8QrqF+KM6qk1qlVnUQ8tWWqitaS82+7E8AMwKqLSakG/zdfvONDz4WXz4zPK7O6tYOGs05yUKNwMtOnsqlsqACk4wHLTqCwQ5sMEOyaoLImLnAySWB+7qSZmXKgIAghpoIIHkNRH/+5JkSQADYjvHa1MsYDyE+Q0nDVANFPsdrcKQQOmUI/WWNYj7vSZJT0m/ZB1af9MLaN7vts63Wf//rDJJDSsUgDbLS5QTAszct2fxqzDpigAZvgAY0QfZxDdPYt8ryAAcGtFkWPMeHYyQeUiiN2d0ECuljdTS1u7LXQmPrUdG4EoQhMdU1v6PW/9Zp0KvqU15qrtrFIqZMKHPXedZvd07rvktIRaYrEotAQAfGaZLZvfXh7Vehj0GjGr7hwnWRfffOgr6dSSC3RPr1lvqp/M2dlW0V9D+oEoNzfVV6K4AiaAApm2jX8KKrUiN93oZYEBAuaRr5mIHhXITPFfRIX3aj8We3zjGMbso90IyDU184zXw1xStXEttUhtRqkO90DcZgDRqgRbBplwwL5QV6pW6z/9R6nfRT7qNK+nobsRqU9GaM7kuVZHqHJpui6fP4Khhkim21Z1DxfD5khAEBDkC5zWhwq0z8rAflfszn1TCxboilIU6RHtbbz/6APDT9titTbf//1gAkAROOCQYu3zbSnW6eYnLEvdwuGcdQgqzUg/c//uSZGIAA1c1RLOPo2A8xPktPKqkDDjTF43QVQDsFCNozLVIsZxD9NN8z5nFAuBbuZ061uUHoBdZu+ouqTj4NtVVB0a5R+iZC0gA1QGjJeXYz/ier7stQTVk0thEbDBiv/r9H0fbX/WhAIJZtxgoAAfcG99ax2dWQugZOyNEP1Ol9nNPNwtq1IpV3l3FiPBddnWkkm+/a+ivNP6II+Il4zqqd01VAFBaPBoQ0aZDkZr5/frxGCFskISMHTgwSCgdTN3RbV3zYG7WZqlp1FHF4Ib69y3QTIcVE6mQXUaqaUvZZgMeBiH4EkZEDdNBNf5t76vn6rLmyroDEy80HXPQxoEQeCTkAyKjF9veY7e+y0YWE4KpKpQoAA4NACOzuRnS8xOoiDds1f6dvvuijc8FydrVMs3SeYjp29fU9ar9St/6weTej20U7+gAYEU8FRNOZabTT+eO6Z3m1XsjSdOQj26oW8kvr1stdRdC9zr1UGl5JYihRVmSqEkLGRPlSpN0VUGQaWdTopGIs4DHOgLOiIn1QK34noP+qud5/rZeo/s16f/7kmR+gANZNUXLjKMQOOT5DTMNUgyo+RUt0FGAzxPjaMwpSLHio51a9bP0/o3I5ol46oJAQAAlqAXmKUcPitx5GzlEmXAk/YTLUWgQs9DjHmNoKOmmrUZdb0tlv7gWAm5LeygQYZtsKSAmtJnP9asVOSW42VQwZBpjKNmFQSNxPsDJHe5z8dqCYi5veJqHJhU6qUQb+/7rqMXUof1q2XU9lSh9R0ZwA2cFlBfQQdBX5/qer3WaNEo7eJ4aIJrU4JqOeR6VTtTv6Mt0v6KpbZRbbZaAAEA5PBVJdlnZGFty1KXBsYXMCW+587+N5JvfNTImgk9xIEL1zk2nM3fr3/oDDP///////+j9YCoFpoKBeV0WTTVW3ZkktoYeYaDQQ4DSAVcrDIr1yrrHOxh8fLRz39Va0tusvBeb6a1onyeN7jkn+3dKqU/djYiIGRCg6CS5oQ4J/y9H1ouJ7MT+ootV6H9//q1fG6HoXNAgpBJRqQMABekdh6xj3tiV00ZtToLGUJhXMht4V1KgVzZK1FSGRDdLq6O5mzWb2U81/sI0LR7/+5JknwADTDVFy4+jUDzk6c08KqGMKNUVLdBVAOsT43WBtchU5wpDyhVAqQjASIUK9WmzK7NDRzmNI7YWADab4BPgx1A/Y2yd5HxCqwDIz8Y1i+cxNc9xnf+tdVlZM5nPx3ml6Tf+PWsw2pLODdCc0UicWafz0jvLC8LUNhVp5crsErGd0Uf9n/xlNFJPlwkUgm5HaGAA0txDZtvJZoDqrJAYMtafKM6iT00XomYd3ZupFSaMnC3fNm1J7HXs1bopr6X9YPZRsTzskAAK02EomHAxPqywtXQHIPCgPMcyMxMCVMpTcsds5U1ol8L+oWsgpTF9MyDhkOeq17qVH02fTZNbuiqTf3QImBsiCtyQN00Dq/z3Vr2dct2tHB8sRzO4XG1BjqEs1nKj39f5+JUlllIuAJRmsIzwkwK0S6R/Ck+GESMWE4jV+66q2C3JW1XZXI79CkplNZ/9fR/rCtIeB+Wl3f///////+oQUIU4FQMNKClo+PEe9hdTmomucYci12qCB5ZKJfJK6Gs0DGSdqrss5UKaJI2izqROUJsWqlK2//uSZLyAEzAoxdNvo3A7pPjtPy1SDMjXFSZyaoDolCO0zDVAa2aPUqoxGeAMiAWJF1V0Vv9LnPgyZOdTlPnpToc/UijHy7hnsexLHPK7rTN42QBJSDajMgQAF6kZvhuzy7NzFaVwwaeJAOvOU9q9qxrnPvrF5rXRfCwb1oqajHbRm0XS/qCsG5oh66wAgUSxVyx2h0trHv/ZbEkqVAsYLqgWBzM4hKyYQuM7QoOyerW6aaTnWl0LiGtFWuii6x/PL81MjN0bFv3QL45AGJdAWMETNEE0Ovo9Td35of3ChJEUoR0yecWcANRdR0qsGtFTu7cACsLKEOtYIoTV4/kZbF2vLLWqeXWaBuIJlqWgSvQVHtLh6dSVutLGcuVbPnFo0mtZbauY/rUA/Epsi3uulzv////////Z8mkyGVsyS5cfCtQVpqNOKy4wABPFtwWIgck0t1tWmfnMMIvf1jGLY3bVygA801rWs5s51/SMbFq1rNjOt5kR1opGJNCkQMnNAaWkSZSJkk6mU8++q9JVqjVgKEkBI4alV2BmXIdcaPfEq//7kmTagRMsMMVJ+6KgOUUI3WCtpg2c1RMuGo5BBZgi5aG1kAvAlDVxVCAlpGvel9xEkxwuk8fFAWHflCGU5UlJXlsox1CwWCTPkRV0F692ZTBZX++jKcLwsMs9n63VjJqIceqG5T+aAuEL7Odifqrft////t/+n6dgkJFjgkAqCGdO/bp8cNSqjj7cBCDTLkTMbgldj/0kYo7GdWTAKI1NIyY0mBqpYaBy7nndJZhTYlSkutTNWyS9U391vWdR0zBQRI3LAfBM/mFbwKIATNNOIaKBhYdMXilTDbw7231r79hlNrTLMIHBlpRjDAqwAkVkoJRGSCIzW7hdoGlM2lkTYwI6zSAdBOb35rMmF7a7qbp7EbvtW2nr/bmf86Asmf+vw7kCn+vqs+pm+xadSf2V02WpAABJKBQDA6/LB5/ecFz9iLtkLOGBhQZuhQ844EdiBCMJA2Ouy1jnh3zc3LyCkEDh82UaB/A98n03Rc+tZipNx8FdNaa8wWjdRM3UtZwZQG6AGaaAKWxZZXWXyndfc2VW/svUfMuWBzR40pSGkg7/+5Jk8wgDxzVDi2+jcEbE+KZlimYOZKESzjdRQRUUIqWjNZCFz8yglQ4X3avVY+1KRglc+1aJUmh5YAEAkoQAtDKSsPGntYav2rLK0BZyuh2kYs061IXUpRcEEPItUzJpbFRK+u++dqXWyKN+YVeowC+hZm7kz6vJ///0//t+7v/0RykCso7s8KimDo8JDH7HD6g4NRaoxIkVIZC5huAUECqMiEOOA04mikB0LwO6QCb/07hAHO1CBimIvdkcU+ZcqYMQCjxxxRzAlioSCppHASqBBI0g4058KlzDKAKf1923sISNsXwjkgOdbOmiOMAOANFzf//++FtOOBVdpdrwLsLkSrXgkMu1C77/8x4nXG56WKghTLESygEhQkWvtYB6f/////5zuHfzv8zATEWHBghXia5ZgsAEtVxf//////8vy+QX6Sc/C/wOBIwgoGsGsA+q7WPuJCHH//////////zv8z7//////7DGxNhiTXnlfuTxSnwsU+69v21ojGw1G4jEwBAAACfbNy0UDg8pH2CpPQM0YcX+O517zb4dQUDR//uQZPYABCQ1RE1ygABL5RiZrLQAHomZTfmdABKPpiU3MvAA/rmJYE4W1dIHSoFQtAYxqx7ZYqIQeCniD1jxL8MTefbCbcFWzwCcOB0EnXH+NczNbzeOeioWRb2ZuRaC/+/z7ka1WxtyEFjbTTbBfj0Iv////xP9//8kpe1YnEWtz6v///////////Amjww4Axx3//LiBBAvKBH////zYDq2f1AkEAAJTIsNoEEdAcUE8BYiuN0/XXBdrmKGyAChBopVBFSZiXTFJbUknLpi6KLVJJJIkaLEbajIvI0q0aReZJJJ60Uekk6KJjWii2taShYOpIiyKkn6SSkkn0kkmpJJJUUf9H/qUkpaK2YiPRWhepJJ+yS0UDIvJLOpF01Z3U/SmSSSmU6RfGwiiXSZKy27MNIEAAARRoEKKnl57gHG5OBBVhblWjm/vpf///////vIC/////////////7fqb//vuJAytDvAAAAAAAHc154mtzTDnYkd/CllTy+qBzqcGAZ3QMTASuY1KUNOXMtVFyAidpRzLahFLLYSDgHFC6g//uSZIAABHdn0e8+AAY1jLqN5BQBkBGXMe2ikMDCF6mwwJY2x88pa1HzqF3TZVaC0WalWL8u9utRXKiwIBgGoI2D7Jdv11aP9T2Vdv/9GyXU9Mrfuzr/v3RZ1yJrd17VK1LudUs1MXLQ7btBGkFAi0362bLdeY4XFidUqDg3cCRBMqe4f5Tv/VLTLN7RPPL/aFArelSu3//9FXNvwAAACAZrAlHS26epelc7GXoZXHBUc4DMxiEZLSqdKKK5Y4Y1aXWrN25ckVJa1yz+P27tLehAdJlmd6vh3NShW1ias5ZlbbXerARC9frUkS5uiDXAaiTCP/s3/6Lr9Gq/+p+mylqrdjSFTYs4Wj19AuQRKVWXp0ozO8iACKAKcABuFmqqiUQSSGeRALqY/4aG78esweZrh5/1o7l1lzd1HO21lg8I58Jx0Usvt/ICAAQD3qroisSY1jnqasQG8FCDQVpruFkzzQweBICu4Ezn1njKTSQHT6rv0kpMQ4QhGXqzvMTcsJukyjiK0f1aQzht1dFRsamIJkFTPo22+tTofb761rQf3v/7kmSEAAPFTcvrSJ6QM6XZ/yAotg2tbTGtmlDA+JdpMMEeNtu+ta/UzUkafdS7//7VHv9vTNbtDXJKGBB0CDtuyVhp7ngYI02G4sPEpbRA0hwgkaaGRdrN/+5tDZlejmdyo6lEOR/81XBp7kjshF/IBs25KRAABlBKRA2MQ5OUtithHXgWmYqKZhUBlQNGEJyfW3QhChkgChgKYK60Vd6l1udsQ3FpM0Mub2pN7r1H9nYejL8gUAB0CZdel0Avfu05UF6MxVMEgXYp7bs9pa3ZLnYC4pZlu9zHHmnvxmmb0hfY5oiB5wHGpRSKssfPOqQtFFxJVYs9gZz2j6nf1TXbICEMJB4BKQDJiY1Bz4uL4F2idhJgIJ6EMY63P7aZqQkNGRlfLZvVFIlH2rfxjf+8LA3st6eSBWH2M5U/MM9X6mMGN3VQAgpF9gCBZhoUxzEg5+lgItrk3MX7GNbvNVZPTyhJa5hew/GlsxieoCqiZpj19r4wvl0vuXEmReeHGVtZ2WpIxdECVhSpUqsgIojY4fwW4lVX3X+1Vuru5rdVG1H/+5JklwYEVy/Gw4zWgDgl6a08ZXgPpTkfLuWvQNEXabTCnb5tXbZknRbUp61GTgkALHo/1/fdvtALEzIQABDeM3o7XOO7tqBdFQF8cggQzLW7pdpV0b9eZWUr7LqSQ005R5CgjjFv82VDCirgCAAAcYaI/UHy+zq/SWqXlWMAIPhYFEJphKUByqa4LBOUZDVrz8y6zapJZlTTc9rFHfmr/Ma2OONasgyL0WbXI5P/ouIGzOpbSYPbp3XudBpk/ptyfsOI2HyIEb3d+za9fa10D1tTvdS2tvrZrIa78swA4xp+t/9DzEK6EDLMPzgAQKOOq8Hea599XJS56PYJXNhmeYvXD6KRCIU2Trz1tR0ulUQ/OOcKr/+gt0KAAQZJtsLUKCxlXpbVaStwGQBAhFg0DzAQJjDFWTgl/DhJBMAjG1aTzu7FqU2MrsH/TBQFa3jdytT9qfwmxwcaoewS7WaJW32A5ud13ta9uH7WrH2Ukyp8MoINBzGtSxPFOFVWYAJ1l0qz7/pffU+kj3f1eqpWh6tTrXMKL/8Wk/3zXXkaxpWE//uSZJuAE81Ox9O5g9A1BdnvPEd8EDk5GM7pr4Dil6a0x52MlsWdX9yns1wHHqIsK4khq1mYrPLGJVXiQ7+a82UDKal8kdPSp2k4x0o+w6Xr/cdiAdcRYAAEaY6jkx3epzle9HILeIwMALBICoiALMFgEc0AALBd+Zw6hKYa7VLKscq2VaZkX5oD7Gq2P6keUupZSKiAjHborT1Sb9FB0tkD0kCimtNVSqlnAacOJHdeR6nELHxfCwnl37/1OX1aPqew//9YzVWvT9E216EsacgAALSoYR1foztqP8LjRyGgqAmEpedRDjWc81ou0X7RMDtrjhfZVVPv/6BQl/5SUJOgKAHDjJ5/mqmd6Zgh00EBhKQBgoBwVC0GMgZUx2ZFOd0EJFU+nVl1Ff5hjqOwfzIaAz+5nmq9u9LO1BkCa0Is/DdqDu+w5/9pNdpXv4M2t1xi8AA+FBfWLf5RX2N2psI8eKKAO/9X6qaOrdu+z07erd9z1cgA9MFrAAVqrMtg3Bv63pTI0fcjAM1MPjo3C4SjbpGq3nHH04a5Tk3S31sY/v/7kmSmBgOnLsZD2pPQNkXpnTIHYQ5QuxYu6e9A1pdltPMd0PQDiH/iecSqASAACFhoHk83q1XrZ++LPE7zBcXzAIATAYCjFchz689jxCgsOYy8UzW3Wzr8+Zk/4IBrGqnPq4Y2cqYgAhCiWZYwHJv2RZXoNKpfzI9tzECtFFSqbkBqE9ORwxTSVGPpRq/1fVnrt+IF/LLaAAuRhF/ViRsL84AAPxluXMLESgtRl4RJvV1NeLyLjItklffSx5bN0YLsTeY+fgOHmDVjiUeavLe0l+xjUuV5hgZhUHIGCsdBIweR85qYYyow4g8HClcu9Dsu4pViyS7LAoFNM+jWWqdMVwBmIqLrF+vJ36mmxo9BelqOgUOLGhXXkWxacku1267ddvd9T//o///511TH9nIf9nVS49MAPXjG3v3VbbtGzeafBdpsGaDkYT4Yolc3rYe3dnV3XUUdC2T//s38PV1bmYE6FCqmqgQgAAAkIaeWBe1rv77ddhYNHQLDgQgQYCg2YfIAdSMec8yCoamkP0lvDNkcolucCCVNdRac2YxDdAP/+5JkuwYTLC7GQ7qL0DkF6l0w6k2NLTkYzupuQM2XZfTxqdUY08apL5JK+0umzThX+yQY0EDNXXkFxdDzmFh61/DEj7ee+yU/9NP+5ySUh2uNtAAN06hgVavDkooc5Rc3gElEGfji3xFU98tww6NZlIXuJgctULhnHP/36eLQ9v1weUJjKmA7NDC3/j8/bt5YY48oiYQiIGEUTDUhjuUpxe04zEHWtQ7GqW1SaWS3RC6aMiyMoE6xgtRNgjIaTOakvlpdeppsY50t/WcCFC4nvrHdi1tNWnZ5RuxVmR/+TqYwsMYr/m9Sn+LMq6FGmwA6aO6AAC5RAOuWx9/VpTNTGF4rKA487Lsesmx04/iLyJGjk5aDvF/CjmmOdVGJ2t/hUO/pYBtDxOaS//////+iCAgAkAkVjkul9inzlccgNaAqA5gcVZgODJgIHBha5prbURxGg3FIiy3Xmit+znd/cGwrVoHBJPnVtboJ+zO36yTpaxcHPZ493NDL9U8sxH7MTC+08EcBgP1LVi9hJFmSOpWvVb//qfb7+k1tfqqqVXMU//uSZNwEAxQtRku6g5A35dndPWd3jQy9Gy7mTkEMF6S0zKlQJvsTIRedwtfAqnDTRfkjbRAQHEELAAZxE1jatc5du4zOceFHnmiAq2e+jLHMt48dSloK/YIXkjEGGdFyMWnwqjfCiN2u+2766xBDTR+Q2AQUXkBqSOopKMANGhgyNuHLW81avXcqsZqR2PGBgYn0rsDEA/4KRIll7XClL7Smtigk6ys/YKY8gTHUcG5zE5QCFLuROPDR1NMifrPfrCDNffF+Ef/frZLrvZV1R2p2pZ6PdW0Xrpykno2Gr4h/p9AAoDCAhYeSvlytS52a9axVsIlLgka6R/AV6htWqV5/C+ZjHUiVGaaJjZo7kP/O1/xLLdWzsFZxCOR7f//////pQAvk1STONYrfP4xGOMLEAEGIpYGEwNCMQzBOMjr/EwoHZkqDhg0AYcASuXGisuxvY6fGD8KcwEAWfryvm6sKtz2V1KZDNM6n0os3nff/WWv7Ws40MY7Lg7Wo7G4BHBZoJrU64nRlh6Bjeq3Gyo30pSlY6MtU2ZUbl1JpTktDhP/7kmT4ABQQTkSrumvQRgXoymUKhg0dOSGuNPNBAJejaaepwMSGVy1tg4BEVILl7VD28uTCixgAcQVQjzNaaxTUlitPfTOmML4bg0kWGLluGqKQ2mepaVkVssHSm556oXd0lAlZYEA/Jf9dOngRJ9e2CKyP1////0aO74t/p4rCwJACAFQ1MZ+ruE7ZwpqR01bCEBMbgTBA0wEAIjBtEPNDkbgwfAIjAcASVveCV1LuF0I/m1ABcEFFRJyNUxwzWVgZJDGm4wXTIZ7qaZFtpkntrMgKQJM2rjN4udBupXqWrX712oIZvtrd4tc3nE2aY/uy7KYKDtOxxQSgBxAWAkBO2Q85MWeOKGtlLWi0inMUR7PKIX5MY6WarMjm8DsjQ8lrQXvgo+R/6at20AQLm/5L9X+n//xb+30VAgAzOXQgHC1IqemoLMoUrMEYEsDAngUBYwVhWzRkHKOmOPErMeEQVYk7supVNcfboGYNHrPuo6VLKUJaJAJxZYiY2cpqd2nMzJ3RLdfTMAI4J8W1XFmNFwIqbU3+9nq2t1rP1Ovq/Z3/+5Jk/oQEj05Di7EXEEmF6KVpp4QPHPcSzfpMgQCWo2j9HVBWX//SR9nrZVa1KRto88tJy5CgsVZi59YxQgoDGKTDCIcbelnt2ML8qwtSQKkm8lQwROQgh5ktqy0wpufAn2VTmtUXaAcQy7/76dfA4z/xr+W/0///bV0/R/9osgtXMKa7muSmem4ZdBmY4BAiKoqgwYHhyYmNkdkUeYyhuJFeRAQp97JfetoNYf9ICkbOapMxILnEiKgyGTNlhhzNpNdlnGUYFJa3Nt9IxC18OBS1Kxn8ZNDrto+p69qXqTUdJdf92b+2VOoOXxRThQnRICRYvXJuD4TiNa0MAwQAVxMT0XdF3AeIa1UgQyBTq3XLCxw9DtS9z6T1dtO2Ax5tlbSVFnOBmQ/7Z/vsJYcfo/xt//0/////Tu7Nt7FCyhBQCYAlFUFhmVy6M7tYT9XnykSFsiCUmAgxVEw/tDsWLQwbBgu6ypDVc9tBfZ57+9QM9cQpvAcdx5cpg7U98mCl9cmW61NWdzFC3UdCDl9Wlx9ZIIu/6k7oM1ezMrXas/////uSZPMOBAtbRAPak5BCRajJaCeCD9E5EC7AU4EFFqKE/R1Sqd7fodXMA4ytW1KsVtUV973WSY4SFFQFgUiNWcyrudhuzxacABVXzoXAH/CtRd6zpeq2VsN5yTSz3xbwuGcnt+dmfzwVXp+O//o01eS6P/t//SOAiC5rcGhyzW33yhqedNkBCAJgQQ5gCB4WCoGsOZMRoYHBIYrACLAkr04lS5TXra6/88SkeVj+m6P/Bq+GufWtvDW1hCs5p9NWdUYMfU39tfWy8jXiX1oAlYaMVPZke6aslJiGq6Gyr9u0/87RmdP3yevVNE7TurXLpviA8p9Isyx1YCwAQA01E85fp95d19JdfxgwRLG2eAVXmRnMQW7PWXWb6sigE79tajfWKqOXP+vf21l0t9r6QxlmC///////9fC+2LpKlkqtBABxNFGnQ7P3Zm323DDc1Hjm+M8AwCwDzBkCYNB4R0wcQExGAmo89Mema2PMu6j97PBXVjRg9ItusySJUcogbxLB6XJ267GVTm7bVWrOBBiDL1o1jLZOt12XdJHv7a1PTf/7kmTwAQOpTkVLr4xAP0Wotj9HVBBhbRLOvPGBHpaiSaO2GOdfp9NW617Va20G71mL3LUhx7qTbRKWR7YxJRQ8AQBlOAAMZRodVihwYquiUvSIXKsi6uAP9WfKa3LM1brmAK2p7ZLUDRnEeiefZ69fAwkv/K////////6bOjUGoQgLIHRi9+zK8c31mHjUUMIRiMDAAFAZMJ06OxW1MHgRMUQQBQGp1OLD0ttMzR9asCam8+qdLU0FOiIkZS1BBIO5alUtjj5q9B6m6AGUKD0WkAnB83/RK1/f0yvTazoqdnNehzL1ulxUZNlXFEoOsdoeZde/Y31TQhBQOIt5ukpJvkNw3cmomKRyuSjrx86xFf0tyRumKIwbYGrO66VM1ND2ZP/zm01hYg+v45///////u0fZTFXR1UKCj7weya/hLqGfvwW0ghAzHY0wYVMEA0MZWFPwZcMeg0MQAGL1uJF7HcE3VH2yjgNU00PzqWdWSg5IsDJCMhgJrIgpVUwdSRNNPn9GioxArRJVa6opasdN262Vb+t9bdedbXbvVa+7d7/+5Jk74XT7k7Eqz6LQD5luLk/R1QPKTkSrrTzQP8WoomRngi1bJvmd0/P+ikwy3kO7nE0oP2O6Ki0yd7HAAAYh4ABNQS8rD95fV7z1mjLSLjfwQiTwnleRjPA1GR7V0CDN70fLcKC7Hf/sq6MiGhGLUmLWdj9/////////oRSX1lkCEVAKBqOoLxuMU/b1LjnWgM6LxaMtcYmFGfgGMLFEYZA2WmXa70O01XLmtx2x+Kh9nZ9U6UHZmSGUSLKL4vZbXZZgllaU6lXbOgF0ZdbrTsHDUP36HR1Wu2pl61OpE9rQ7houWcjtM0We58ygU77mt6nANgbGxgAIBZtr89ObpLc5zXIgFSzQJcIBZ8CzfNNpqooRuxmVbBvZEorqptPBg7Hzp37tT/GPyn6v+r//u///+7WhUQCYyAkBymqB01bpZXR0sy6CyyAAhEQxCCAFC8waYYzskMwvCkOK4mAlf0Cz1jqCmk80uB6G21EsZAqc6PYX3WFGMmsOQtM1OrJIvqj4ldDdlskE8DM2k+KVhZs+hzzvOx6Wox1Y1ajXX+1//uSZPOEhBBOw4N9iyJEhai5P0dGDrD3Esz1rQD+E6KZoaoIELes9tWz8NMO2rFBCFxJEApCp9jUBPqeFAysLBA4mAC4zJXGwv26khnobwrSkGosdfcUaO7Vl7U7PUX6DaCjcVk1rZSfbP8aizEp12fvf8Ye9T10F0/////rV/9mZil/mNxCAArsv6nxSyeims4jTS+HIBFgdwgDkwDgBDB5BHNPMMAwhADACBEXlZk+salOS3aWS1h75ogUlOUiWWs3sO0ii4cNbKIGgiq6SbJG+tq3XWZBDBhopNWKJcjF2/vMW9aXNoqbDf1/sx5XfbvTB9GqYFML9RNRHc51hvztf74aEVRpKKMzgAFpLqdFWphQmWrtzebLOsfijJie81CGqvXZTFrtiVsfIm2O6Y8HY227qibdPCj9F3/////3f//yt9ASAALxo5J40r702cnrxSStwIQBMCCRBIGkoVGCjInL0dGAoQGMQKgoHkkSXISzRbzWo2uGrh0+7++8R83YdSRTx9x2oPXbLarjcDfwww90zjH+PosREb9OBHYQZv/7kmT0hAQ3TkQzrRTgRgWopmWiiBBZOw5PSFOI9RPi2P0dUCeiT32R/SmreSmHrvZW17Ha4EHJQydvrQFVtACtRY8k1UwsVLGwFACKEQAADKbiwvWXzvJVTb7KBhKLTBYTMiaON7fxfePG2bCG1ama7cVi3Fl5x7Mp6/+w8Q+/////////9Tb1pGolAIBQAC04lDMNXqelh2INlSkMDYE4wFwDDATAtMHQUg0ciFzCLAvMC0A9QRy4AjdbO93Pcdou1EMr2CBbqJdUwpD0LfMy0JkpIfNaSqB+opMp0rsq50GsjtrrpuKUyKJ29nVnK+3RV6HyDUu1mspCMeau+R620dvnZW5UZLol3axHUFoFSp8KwmfJNWG5qMeAcGIKtqe+CqnPzZiiQSrIfCwA9xNZ8bw76t2wOXPva34KlkjLM56svzWRLLUCZZXnf2f7v///3f/30WqqEgQCyDX3+lGXdW5mWx5/VsGDIvA4CAQApiGcB7ulIHAm7LAYKsZyY1S2rMo6UXOg8usv3OltzkxPklUIQbrE4zQQSTSSpHV2fZD/+5Jk7QkUDD1Dk69UYEBE+Lo/J0YSBYEMr0hXCPWT4oj9HVBOsHSLen8YfJd+/1Muy6HXRUyl7Nt/9X9l7dnUdkq/Y5Cyiwqk6VaNcCTxVJycFYSUjkA01zsIAC8XkJlp2tmXlDO2q723YMWzVWKK0xrtZ1WWoAtXc05zUnb8Kk8hs3+nZ+KXv5ZQCIVQIATJY/DsVhuclk/i2QhAMwdH8wKBMwEDYw9bE4npAxSDQeKwmA9oKbaI2rx/O1rOMBaN97Tw7R6Q8VWDVrxBp8dhrAzXeJ/tgtreNZx8eECgMbWM1jwFMaHq99dltbo1rvfM//7q/b3VqGPKfdnfzonX0ybpH60np+9eMOIPi2oBH5gsRkKDMLFHDG5Hs4OQi4wKlni80yKWuTHWtbNAIJkDTc86/46M43Li5YLLp5R/cV//////+f/9/2vRACZkoIh0rycqzMs7Sax7XMGgpKAKFgDMRgJPXANCCbMDAPS+cElHK6udmp3beB+KT68EMVvr2cf/QHjT9JWbLXa9LitZtvugDiJR9a1w5a3I5tCrCys0//uSZOQME9JOxBO6a5A1xOk9MwdVEIk7DC69UYjyjiLY/J2IK1KxUO/eiFDNlmlqCP9HK6FTlcSGGvoADYwAJYyS7Ytzevmpz+zQXHNpPKYhNRqbu1uNUej7zNASqYHRVvm7ajgzt//Of8QBn1f/////+v/+ve1SgEQTIsJfwC+szS5zstgJopVAYCFMCQWGQ7CryG4Nfg0MTHsDAgJUcmCv1GZ5tZWWNBlN5ieNzYoO5MdIlw5ybDuDI8g0mdBAvHpqy1a3Q0QVsMp+zKeIIisjLetO893sPaHOZklboTzT2t0KeZETWEdbPh+6ujN9XhW5EZzpWFkiRf4RIHWAnAEHw3AxpghiAkagQuDAxasSaZnlYVNas+5I0Vc3bavevsiuhyegLXR2MKqv0wULtH5C8OUcs71//9HT/6v0/6vqZep9SgAkQAAOBYXSJAFNLhT5yS7Sy6Mww+oOBqAQGJgGAMGDWHKaJ4xhg+APGAYAspW6EfmMcM872puc/S6sNXJ/6aU2c7aTLGw0WsYKbjuY3QSZzIwQLzVp69RmEc6ySf/7kmTqiNNyLkSzrGxQPGTopmkHhhHtjwoutHOI9Y4iSPydUOpQ12ciz33qb9il+6tbBc3V8+vXrOm5GlQNrRjUOrUvclL9LoRlVjFnq7nJSxiLHIqInACRAALCPq41ezbwwi0XmZynBAVe8USHPuIX5QbrAspx2xG0c6r034HNmL9av/8qv2f/////93ivVXdWllNShJQAkAeUN7Fovbv50dqUxJR0KDKkuFwKMKjnOuk+OcA+kQgJdL/RmmquyTpmtELbRL6TmDqWnWXCbWKpqqUFqdBV6ZiqpVT6EOaItB2uuLK5rLNZdu+8iraQ6Winy6Zd7yXtw0l7yzo881o+hawwAKHTigQAAV5oPFq659W4h5PXEOp6Q/SsMusuzmXbZ3EM92m2t9gsMPKyCWh36/YuEhAAgFkFGrwy28Dv1B9+lgx40pDDQODBsDjAkNTE5mDuqfTGUNQcUY8AjU0o5Ml4Va27R+FNrvaV20/FcQNoL8TlbxhH33bdMO8xXW/ub7rbF5AOiqrqXFd0JjnSe3j63i90v5HNSYi1Ly+C9cn/+5Jk7YwEfmnDM9AWMj6E+JZoJ4IN1LUQTuWuQL+OI2jcHVDK0+Zw3vmTp3zsOQjWWrnPfzOK2s0ivxXQobLDbTj1jwWDicm5saQAHwhiGsk18UdUs1J1LpbjtiIYcxGyeB+Zsb+jTh5ron2uhOHJ5Ttd10mv/IH+U////t/+76d/nCxBiKBgVQYUAWAzR9ULjUvv3aaCbOqVmRgKg4F+B4BEwYQZjRZBbDg0DAjAeBAAK5nZhqzWWgqkQHWEnXNmSMz6DHFqTHgyxii3UxottVK9SalXrdNQSYWif0RPnYxa7eyKzE1/v+P12R9PZW2lVvZ5kTRCM6o6KcyTscim3ZH7I1FoqOyuFoPw5A8EL0QAWzjDQ88LkbleNHQxiqWB9DZSOAa97YextLNNiyK4+cI3xiKdbDMTaHktX1cVYXfu////9P/s+yfXJkx1MEAWedIi9nvClhmDJlsCHphGNZgkB4iDAEtaZNT8YKBUYxAGJAsr1m0tl1mer3sciDUC0J7WU83PrODxZQ7BSQTHvTSUjo0VTjqrZakQKcWr0dlB//uSZPYMBJxowpOvHHJAxOiSP0pGEHmpDC80U4j+jaKZoaoYyVycpe1aFPWtXt+r65TPvb79f+l1qn8HzjjfPWZfWzbWFfplJEv9vI2SpCOgwvSj7iWHEQBDhKl6Wa9SrLYZmtUlZHxb8QHUzDqfxzb+JC/oxlATR9hTsv4K56vr8l1rOf/////6NidVWhsXraIbXICZEoFtVIJMy7OhrblOeq9UwSDEWAIwDAExCGw8MNUxNAkVAdqkG01W1tCjOGqDDcascOmSJBSTOqyniOKWSFNqTOi7qrffUsKE3QWg6NYjTzFU493VXVdvlp1rpVkba1aIW5KdvRF9WX3+1bTal/t00yrRHKDCUmQCANyguVAGQSqNmHVj92OoMiH4p2WA9iB8hRc6xyc5x8rFEW9D29QxG6Tf/9Pyv///////+7r/xd3STABAkga11wKmcstVYdjz6r6AAvFkgsB5hCfxzatZgwA5h6BQYAK6jJUTLC1803E1o0b6ljeE4U+NZlgXwVVPuH//4DxjZ3+4Dxkif/V7Gga1KPzdgAaIEAst3v/7kmTpCBQ0a8KDrR1iPgNYkmRHhg79oxDOtFOA6hOipP0pSN3fmZubu7r+khEdxct9BQUD8XP45l03Peb7/7nutBiJHHzXERU9T8V11jvdOfhTHddeYQVPtthyOWC2yWJkgIc5KWJBias11kaoYLNA+RXtpNlmcVNRiHyThc/I3VT7RVBOlcEBGo596dogH2//EAQWD7OlUjT0gWrOW6SYwlkzQSUwXAQIAkEAgYVmucBq4YbAkGBozeHC86+pjnW7DJmx0606m+y2aEYjeURxXMNWa1FFlKW6Sag0KqXW0YapMumJiv2dJJJL0Kl/WiiYl0xBUKgqdWCoiBpU0qmdDSwnpGu6gZpSpqwVIpHlhVC10i0pAo2W0AJTATH4VelI+Jc2lTA9ReYDk2k5vP/8Q1RO+tsIBt2WALvs0qSFYCpb/ucHTygaYVXVbAtEXRYBEIci3Zy5Bz6w0wkkHNL0MAYxMIU+2JwmKMwqBctkw12pTTbSR1Fi1h/orZjBNdNOcHmtA2FBNFb+96DTBFlUXWoRoPCSda6g5tZIIutSLrX/+5Jk7I0EkGHDi69EYjzDab08qoePhPcQLq2xQN0NY6i8FVAVh8+5z/awvpGehKZ/c87S537nvNNJsdnO39f+bEk81Wjvl+cpP8b0SllaOOYAgTfZCCq0ExDDHesq75f2oMAT2lDQHg1JtabcrdL5rAPJhLxc3sj0BQvD72wGz7Ou7d/9aHU//////f03oHCWoWkQvGrT02qs9JK0C3KGJAYIF0h0EgxaGIIyYyjfl+yImr06q6hvjZbTqz5Np02U114pjTyIVU57myecbuuJ6/6Bct4fOx4bcH3JQ5Ky5EwUaYRFVjRANQcF1B9jkDVLZnB67mrR3bNiLV+6EQCYGjcZAABEfwhtv049KDlJQgCYpKyABgeLYpZ57WahiHkw1PJ3ZKHO02isGRjyxp7Ozdu7W7HlvqUkAKHgDEJymruTbs2oAsP87lIYEYOgqACYB4H5hQglmj2KgBwCQGGmAbQkBigAskWWOe5iki5geYzGmTjJJutKmkgqSJuZhwy0iYE6s1dalVLQWuW5m6KeH6jvprSSoDhPzqDq3Wgp0c1S//uSZOoABBdsQwutHOA941i5ZGeGDei3FO5hbgDmFCMozClId3ZL0kNSKJaQXZHXvZG+9lp1qoIVMtNFKzIJst39Zo/dJGktlILSRZNNBSKl1IIqTcruqYOyJos3JBFpAONxxIABuUPQ7b+7UiViW2t7Ubu08PC/gEArCEJB6epRXujqcRIjqrWPS6M6CsNNHNmGKk9u3VTYv9+uV0Cn8+sabHR4HRxGIAIKDQRS10eeMpZM8FPwplCuDYYFrQa4X3B3LshfJOkwLgxnQeWqUGRAJWA8skNwMuh4BThQQIWeyxQ334YJBr9jgLOS7KCKXUriawMsFcyFCEhZiEgxQhU1BgLC81vPOpL4qzuRr3aQwxYV2F/KrNXv4XPzw46iljxuuwePRRYVeK/V3QQzZ4f/////5Zjnn3DDfc2GwE3FkzpzzsxL///////t5YYcz//7qWO06cScGSTtq41yX//////////2JZvPv97/e4csboa9nLW9RCKW628d2f////Z/R65EiAun5QWEwUHBKopXbxlnJn/hhFCbTywsRNrS9f/7kmT0AAUfa8IFeoACQMWo7awoARxxmUm5nIASe7MqNzEwAgQxGW0Q7gdnumoQ4c4dyLZoTh03D4RQIj0TdQNWiCZFhwEAIIF9ANNgHLCwAC7f7JumoUoICi5BbhnhUv6BcRNyfSNBSpYDoQ6gxAxkK7/0Lp2bNiAkYJwJIumqKX/09v5kkTZeIiZMkRc8v///+6qE3SMUncuDGDybJF4sol0tOpgAAE8burKftnLvP9DzhMNjMMqCrCoJh0AVgDqhUAMVFD2x81IfXI5zV2tQ97rPmyprzlS54oPluFM+zvQM1pynKf2goq1yVZU1vJE4DVbJpdFpc/0apdU0qnrVLdpddu8zpJbTcsflW7TfR4VLU1yCV+RnG9W3lzvzNPelJfAaMnanssatm13ussu//fyy7ll//+WWWWWX/+X/+vuqpS3DLLL8cdf////////+v/VaFt7jpP7gCikohLi5l9i/Nn1HxfVafodKYXvj3EOQseimOeqbnnbuYYl6v3RzXD8v+2YeY7Zyqekn/TpeJA43/oLn/6P//6v9NzUNUDD/+5Bkf4IFp1zM32NgAFlLip3nqACSgXMqjjKcQVIm6Hzxtlgtl6fT/65zoKwA4WVMt/QbFcQAJHRNZYdAD34fNPLI3VsLAP+QgcqAIy2CZ0QhE6JSzHoPRJibvS1tYbd75yklE1llLfjE5MV+yum5Hr9bGLRV3HGWCKotMSix+6Psoyj2q1+wnQrTuPsnVp9KcInlrF4sbzbw+vCMyupBNBKkUTcnhXghdAWdGZstJaTaVt7t///6jYO8Wn////UdDHRbVf/0LNReUAACYKQvWspSNVnp0ywE6QhRjnOn4j/ZeVUy4pl97jwUZNHNBTFfmk8yKxfZ0XXZBul3Umm2ivaj6FGMOOj/71COV/vWv1f//6+4qEdaoq7/WjpdsAAAAQUnX9ilruWcxF5e/zIVOWgtIQRg0HPaMAQy7KAwGNVhiMy1/aDTnVJKTgDKwuAqOlsEmJ57BaJAkFAa0DIjiNC8XjVNF1Oi6VI1QTRZVdBWhdGtE8Yh4BbJrq6BesBEwXjdur62vQWjpf//3F8/////I13/9ZisrAAAAJJZZjX/+5JEQoIj2VvL44alIH4LmWxxNJYNeW8vjhpUgb8t5bXDRlhnXJVZww7czYk9jSEQxGBpskBhleOFQCNzVgp/FahCwadFA802pq5m2NU0BrlFlk6sQh6IKgRDSfNS6XS0VUXdZizpOa0qLGxsp103UtT3kMCAYUDqV9Ct0ikGuDfk2qX17PRrs97///cji0l////j5Nf/9QddzAADHHl+/R919SvlEcWiyp3mrFYuXUIAiY5lJaVl1p2s5zlWT5jVWkQItLJxE6Wmm20TumDJAPhIYTKLFOmzre+o2TXrr2W+r1GoWzGzagl0jZExEJiEPr7e7t70Km///cXT////8x//1GSWEAABwSHGDq9/vMcaLuXWN6f5tBosusVAWY7jYsFXHgl9ewgYGCULKIPXY5gyOpGmB0t7DrSCYAhRrEVRTLLrZqkcyTp82SQdT0bV66ANg8TFLXsu7qE3Gy/6rIr+za/f/XqSPi8Pf///8xd//K1XZ4hwAQSAYebnozKNdtbyqy+9alDcH3eluyQ8ZXMciwPAghD7a0Z0VFcm7R8T//uSRBcAAstNzntIbEBoSbltbNOWDK03K64iUsGVJuV1szZYf3N18NUjUBFvujX6VfspBVX/86BglNk3rdvRNTV/fqv371Pqt1f9xZP//Wm3NAACQADIHXsXMt/rLHGrGcl6Ouoqh8YODvqXuOgug4mcWCK3FDjwLLT0JqslytyIxg/esp4E9Aroe2SSMT79J6fWYotu7Xt31HQHNHGpdnt51NlNqfVdf/U/o9Jv6nGsWlu/+v//Si7ZAAAgABCX/lePP5qeqXN8oFlPgWAEg2YzBkQSBB4bIjI30OVp0XN7amk740CYIdaxp1Qw4dSiXha8ZsYx8JV1Uv62Z1Ut/rrMgFoDejz657e5Sv9dm3/76qTa/+43D//9f/+WCjbIAAIAAsGHafKvlj/52uVmFTCLiZZkoNGFIHviZQiKiltDeKouJfIyMpTLuMprHfZkZpwPYAZGbJJD4fT62rbUy21uffu/sXgAoAvMnrt9B2X/3ek6qufVsZKVX/qSMiyxn/rVDTjQACgBhIL12k1/O8pMe1XTglD9OUx8AIeEYJOCP//7kkQPgAMUTcpjiJywYAm5PHDTlgvxNyeOLbEBfablNcG2WEFE9gkppL45SS7x8SrQ2JATtGiUv5W4ICC5SRNlsPo0QSTqXr9aPmv+tSygBWQ4E2U9Z75Y/rb//fVX//cfj/////lQi1GAAgAeTtmpU7zLeeuRKlR7XahzWFAR8lQjA5wJ3gYlsUeeKU9mFZCZDwdmukmm1xwPvjmo7QoUFSFpI4kM8Wv3X0El/Ln39MoAVoOYmhtb5Y////9P/9TlA9////6SkY8AAAAQK3yuXc/D9RHuOeAUA6bjSB0EGEhCsskDBo3aGCgIKZGJOYqovvbUdzVHxldRTTvw881UGIGEyMVR3liv37Tq/N//cugUMCqba1LPff/b//6v/+4uP////5YNqRAAJkMGMV83yvc1verNTu1DZpwCEAGAAm6ZKDjOs8AQAceIVaQCHOQgQ5yBn1EZ7BxEeuLQGMQCYoWYkygpWicepN3ZZmtSpn/7ogTMMrtqU3yo99/S/r/0f/7kQ8oleATACAQAEWMvd/C4JsWlgHWZFHwhpLIEQjP/+5JEDYBC9k3JUTyasF4JuSpxE5QKwTcppnGsgYGm5GnDQlg2/MwgC1bpTEsVKL56pJq0zEmUxExqIpG1R7WuixWBdxbZ0RTTf37d1u/Ln/WolQg+RqC91nvr/2///q//uPz////+VDnQAoCBEietfqrj3P+Vr2SekKcKShCuXwMBkx7sTAwDZFDMupYoi3WWLGTBVQGlpay1as2sOoKLN0KxL0183MKmrQL7OnMpl/6iyBCJB0E3Z1dVjIqP6v//+r//OHg3HWAAwAQGqQdWKGOo5nNuaOwCVFUPzCAOd0QgI2xAAwlN7Lr2VkWtSRTrrRGz1ei1IVQ+L5RI6//1Jev/2PhqDW3z3/////b9/7jM/+8jSQTO96fupJrVAYAIhyfe+5f7y73uGXq3NdQ4joHMRBxlIXBxwaxGNwAtV/p3r30u/yDFhMkgIHTvNhFvma1D7E9L3HNIVa9na9TrOGS0U1F3/0TIBAIcz61fnT3/////f/Ue////9FVVlAEiVsjWN7L99rc7+lH3gHQUgIMrBdPMeAp40MlCkSihNHYP//uSRBKAEr1NyMOKnLBQxvkGcROWCok3J62NskFCGGQpwzZQq6aI7muokAWp0fqqORUHhKiVQlhWr9/spJmzboW6lkoEPCHLV5a////////cfn////9AIOBAB3ZHYw7r/x/HeKT8QHQUXkMoBlREIAJ4EpjSdUZkMKpD2TmFySZtRihuvxi/w/KIXJKuoP4SS/v9SkmQyt0P1lAB8BkE26vzraf/6fIEstwACIBgBBmNnPtjPet5avWl2LrJQFDsZ+CuoCQM/73CFNkkD0maTm+YevSj8J2/v59liOEepeMYoK73+yls2e/+wU4an6p7///////9yJ////9IzKAOgGpNSHO5n/Mrvfzaiy8qgkhAhlsFs0MCgk6lJQMf1mOPOWyCGv4/A3k2TCwI3HqN+cP41CNq0Arigr/9S7ZQ6/0jEAF4Up6KO2///8gqLcsYANIEAEDSq8WzysY1aSbzsdX1OMgFQmOEOiIHGaaEWYfeYr1E020KzJt6Y2vv1bJB2j/JstK7a+p5dSbT/9R0IKdV6z3//////t/cfT1CwABwQv/7kkQqgAKDTUprHIuQTgYZCQuSVgnBNSmuBbJBRZhj6dQ2UABQwGLDhlNTuJ/VEjAuETBYmZyFA8az5xhADMDiF2om6D7JnHTW6bFW3P841biTOrHLIRSuv9S0UtRn1fqMwISO8E4s7b//6PIFOR0ALMKAAhYGjwvWvysTWsuelu7DvNRIjiwYUB5juggYAw1S1tgTVzICU7DOSS/9TVCxEAXrDCbr7Wq61oJdX/3C+CRb1t////////OErQC6AQAA/9poVW53K3Xzu52Ui20YMlgHG6gsIArMV4fMDgNaU+tBdTja91mHZQmCU3G784eqH0YRHWDSZ/t9FaDtmXX+xkAFAKZ0W7dP//5CCCUgAFACAACh2MDWu7t/d3GOW00W5jAoqgbMqmJgUIHFqcBjspbGpbaZS9NSi7UrMRsN7dTaAc1uWiXWv/6zin0f/WWAa4UF/Pf///////zhgJACAABCGWu2q277f2jrExQGiEOGLxqiaYNDx1TfGSwMji/0VnkVNZTMarsfc4NNSD1+565wRqyTJjmjbM19X9ZxSeX/+5JESoEChU1I6zyTkFJGGOcnklYJFNEhLXGuQTcYpKiNtVDer9ZQAjg4D9Xb//6fICLYCiSPMH2+91zWWNzlpIxgRIQEYs7J5pBMDTwYhKFCoi5lHeN01W6WrJgyW9uk1hqGHS1BgNt+/1ouz6X/uiDvCM/VPf///qJugD9lgtMxQITSFLUTNZSh3ioAIczLwqIJmn4k5QqikRj7Jr55Tj2NC8XD8fxKkl625mesZDL6goCkv/67s+bf/RCpja+z/r/9////+moIGAAAW+nr1zf6/HnNe/0AipEEAz9FmdAUOnsNOZVBKAx/4pTlxBPd52mppKDj/6z2mHHOhQEIhoIK/9Vd817fqKYJVKavnv/3//////OArABKkwQABZAf1b03dF4LSjI6BUTTLAGf4Kg06FHwMd1qQ/LLZog+tS0U2KS3KIyC3Q0eSp6mTYnJNBZgCEFsMEv7aUzW+e6v5mCBImhs/f//9QLGBF2ZREMLeqlepX5v2NxhWwZaOb9GcqhkZpzkYKAowN9JuoZptqWgaVWpik/+tqh9DmNrDbFq//uSRGyFUnNNRzNcm5BSxij6I5BWCXTRHSz1rkFEmGNcvrVYpXt/WmrP9/2NgUgI5511z3///6iHAUM3gatZ3F8XZQbdRVQVBowaD1HcqBcZwycYMAkwOAJXKE1oPUpmzinKg80f5XzEPCKNEIuGowS9vrrTSzfr/RMgGYKRmLfo7f+j0f///x10AgEAH0ZkgXHQU989T69WPITmFmZoGCIBgYJpl/rJhgEpe5usSmUGdruxXUxZKqAlYhY6aJVPyy9zATihUdCBJNp23Z/qOJtmHQ/TKAFbEAC27/s//2f//9IJKLAUtAAAASS3V7j+s/tby9kVia0UA7jwmTotNBUS3r8RwdbHWUECI5al/25Z6L/////1CwNugJxAoWxJ/abO1uzqXataKoZuogNiNWeisgFMBw2OOKgMjQUCANT6fmePKR6KJReP5Y4xQIAaqutN1rKyOxqTg9utkwW0F8nmPV+tRxmzHp/uXQA3ggT4xRD9+m7/f1fR/5D+sIFJACVEtAACVlS0/3r2d28cw3sdj7SLMNHhAq48faggnuuya//7kmSMhQLPMMaaXZpAN6YpDWkNhAxgxRjtda5A4BikNPy1iF5iKDf621F/yp//9Xpf/UHKID6FbA4wQUDEHLeeAM7H7scwzqMHWEFRwGBxxx2TAmJBCcng6UIgFPGIQpaN01aqjliyimPgOaggiyDo5gSSzIzINVOA0IaS1+/9bNm3Q/UUwKaQdCA0fuTXu+de/q/+m3Z3dooYBISoAdiABAAtUdWUzj5famgVEJOKSVEabcsPUZVh++j3rMLnUnFgG6h/nW5t5xv//7f/WNZr0cANAys6H45Y7SYZ51cJWKASucdDMVCoz/DkIBAwrD87owcynCEMBhNdxH7DCBuvvtHkztWHg3n/j6yBQ/GJRFQRrMAK4I0JhKqvr6zts8rT7tYvAEAG9HlrR+3VRr1/qW6q3kns0os53oFmIFwBIL4CAEaKSM83zW7GsPqLYtx+DED8GlmwrqxhAXFs2z48vjXiUBG/+vUk88t///P/+eANE9tCkMABI3WdTkY3rHO/3mkeIPBAwwr80O4vCYDC4aW+EYSBcIwBXI+8oL5uhpL/+5JktQQDGDFGu32TgDbmKQ0/LWINnMUULqZSwNuYo6WjKhCcuJzF7jFf/LDtMCZUqiGXw8xQOLUiaIdTMsul5W/Q/WUAKwIIm5qP+v/3dVf//b0yP2IAJAHYAAJgefhWfcqt59pFZz3PUVI3NANLVUArLNkmct81sJJgU8zD0/+dPtmvkVH////+oQQ26FACJEDrQim5juxy/Y7MCMAawYCBCRgf8JmAuAEYBAN5iaoOmCsBqBQAEwXSiKjyTOhQ0VEmoRmJ2TNTHoZYbUN9JajoRmTNC92vXXKCT6Hfr5iDcsOyfGKR/yn6dbf6qf+/Sw81Kl38wC4ACAAJYhbrXa/fs1vnMqrPffZ+Skj9JamfyJfkljV/2TXRTKjZQKEFoOr/30jfyafX//+v9XoByiA+imAAAwMRh5ScUltmWX5Xcr1pkLhqgIMRTB2Q62bMEATMQxYPXNsM4wmBQcpXLVhU5c3rVbFNblI2SHSH0POmvWtRYLTqL5QZSBfAWGCwyHmKuv0GmTG+izOafWgUwHbGbQPrNd2bSLpDvcjYVHRW//uSZNUNQvoxRZNdm5A3xijJbC2SDRTFFG36bkDvmKLdjbXAKP2vZWpCzFMWYwXFGtqItFmQogQjC4QAQ0gW8FKPfv4W3XvY5GlInsMOld4/mkogpULOjTs2VY5Ng43+j9/IH/////qGZL3f//3ez1f/Rrp3qwYKFIno1O/EaPOX0VujopeWdUuFFAwdTPzjC5gKHg/JJQIeAH+CgBRxoETM0E66zlRYTmAqKC0F7uzlqnHbTRMgHODSimdNu/3WZmr6SO9d7y8DaAcEeWLEndTq869XYisDZystvPOjKVECNUYzc0+AlG0gMqAx4AABdxgBeCZq4WrVqnjG7dnjdqjdHTDC15rh52BEIC4iXTvDxxJGYMiQMAVSfZ1qJj1omnYQyH//9H9XZYKyLc5u//////6f+qpwQAH7sIcB+ZrfKWC86b6AYkw8EhiYLAqaTBgCgCMDxfO+unMqQxMDAEQXa45cYpLfOJ2KdZQKji+HPpI3dViyWqzhfdBZQBDgXAYJOzqUp9dZRM6/Uaa9SZQAjIcCbIUJ7zld8UsfWUokLf/7kmT2DQQKMUQTfZugPoYY6j8qcA70xxAt9m4BI5hi5aQ2GLnppra7kPfnscoWQK58eAABEoAACWvxC6axT4XYjXv3c3Dlr7uCGYjSi5o0qjm4Fe5tm67bqZZOD27L+oqX0fLx5X////6hBDbkv//////cwoU2fPyyoAcNlMvn7tPKJTdwo5xC4SAEFDAWYyi5IQHwKEoYnavBgMApDIBaezR4hG871/B1oI2SRc+MV1vXssjTylySdabCLg8IYcR7W6Vje8z1v9GXQbTDsuyqlnrdyS0VAbXEce8wuIUJm3wmpRrLyKXi4Gcc1JsD5EBhVLVMHhCBABEEXIKhcuyvztLMz9XbcaelYUBAGC0PhTEYEAirN2mntaMwVPq1qC412v4lt////p7AtCh8l////b/2fybOjvAlFAQK5CBNoZD9c4XZuZs9TodZEmUm+Z7BiWgUEJrf2mJgWsaI02KVJlps5OY8ZDocFURpVdu5W6q26wYyj67qqZ0WKlt//rCYm9t2pKt1MvgNaGK+iOm737279ycqraAOwgAAP1UgViP/+5Jk9I2DzTTEEx2bMEemKKljbXIPdNMODfoOgQ8YolmxqghGrhi1CV+zAZnwrkSqgXicX+NAX+r5cdGoclDjzyVAMgILN/Rv6jF/2M8+m//9QzLd3////1v//qZ2InZmIDBACHPa5DkmhGdW7Ws2K6ABHsLByWBBM2B6LgmDIcHsFgGcYLAoNUDm1hTELq4NUhrV3aVCGXdSzy4ffski7WxmBDQ2smy6plILWtNSCmMjRFVu9lKqRLwWMCTI6kWPCcm94rbbm3123MDlx5gpucmqbQiCikFnDFHm2HxQAidgkOkAhEEABZYeKxf/zp51ZwOpoM02QFiy5R+EBMagWT49TzppWy6Br+iXLHNbzC6r/7UU3//iJL8l/qR1rX2//r+13ZZ0LsQRCiogQAO+VtpM0kZ1KpBKa9JTvoIWITBkOAIHhmkRYODMwgA4+LWgzeAYMDNEhv34IOXzjXuZWMUESgIadN2Z6WiW63La6zYLXAuMUzrv6KDLeZoJLp9q7rrMAK0QROg7KPR7Wv+D36662vtfXb4O//e/9xWH/y7n//uSZPMAAvMwx1GcarBGZhimP0pkEFzRDi6mUsEeGKJY/SnIP69srbYm3aXP0U4TAxNFAgAY3uey/8tzNaN2p23ZY3xskEBGY21g9tIaGRfnbHu7GmKo9PUGBA/9W/xGf0T///+gVDu7//7//u9379frgK1AFDBDgyx7IrKaTKnw1+y87IRGFIjBo05BkwMAIwhFk6M+UyNDMBAgwNrjvjYaXT/3xmMHxcO93Lpe6LYZ1KKS3TLATsTSDuu6lqU9SyibLqV0kLrtMQtfFRPMOO36GTVSnNYQQL0Xq5lVo2Ph+ieELqyqUy6hQGCYmEZ9wBEHcElAChtDt3r4yOcYsdqSqXb14DnUaWZi+1+MVal9G7OqsYzqRBud/r/yJv/9f//j4t3f/9W/Xl/6f/6qCwCYsBLHI8/0DvrLZyzlMQSDAE2HmAQAMYCYO5gWBkGAMASYBgURhIsGAkFwkAPRAaLBENy+xnnSWWrFF3TGGnfsikWCsfdj1BM0ASQLAOgyTStWp7pUD9Truma67ThTAhoyas66Eqb+Z68WrmbZw1/uUP/7kmT6DwQlNEOTHZMiQgYYkmNKcg94ww4OrnLA+JhjJP0pyL6emDp6EfKx0lrbH5S5ZjFwiJJSmr8d5UOHNmu6gs4CWCBB4ArSRQCHjYIRBNKqdp9Tdxo3zrc09paqgYJEM6ECSTO97TVYvCuBE7Inyui/Pb7U6Wv//1Cu7R/1//e/9P/q0I3No1MicEExo1TyG7Vs7yyxmBEBcwFBAwSAozqDUFBcYFCubh62Y8BOAgKU1cqUpIpLn1MXqZ0+oaR7OpaK6siH0tb6IBThlOHG/X5kg+kqp2W3WkCmC2asoa2qSKxqsteLr72XC/SFuLLYhOYYQTOBZ5FpRtIHABgZOAIAABmRTRXdYFd7zWCh7QunQImXOidv6oZdO5afbrREPOEcFDI6NVDReTmfyv///b/49L1ADAwAwMAi5XOnZrHktkO+U4JABQUQCKYCikZ4j2YJAGYehYe0O0ZzgMCPIKCE+j0TiCKkErreTBLpD+KIgYrRo0ZHIM7m2cLINJi4zNr7rd36aO55TUeqgmYAhERBbNozkT9W3S7PUl7dKFr/+5Jk+I0Es2nCg9IdUkNGCKZLajgObMUQTHWsgN6YYyj8qcie3do6JXS2vZVLPdVM1aXu1jmdSJRlkrY7WDoCBEdSg3BkyCqAGYb4Kkze25bSyuW07Cad8W7Ip0rzCawoDCYTM9N+teUA7/Nnl/80v////+sPH6P0+76vO/tp/+b/VUMWE8gUGkyZbViMe5lOVae1DY6BsMCIODAMTzIshlSGFQRHbL1GWAHCQRsEdd+AjLIfd2HUOT4BGdp0uKGDv1ZuJRDSymYqrfQagzGNTqdJTK0Kl0RHY2X1ati8ipa0q7nocUqA/s1jCLSKDGOvD6CIlaLkV0H2BBuAAAKEbLYy32velNW/jafSjeh0y315rBw5SNBvLx8/HKl6rUqwPEco314ub8g/////+Kdo//////TR6vQzVGokAAMA4B1DozZl8PRLOvDkVpuy8vyl2YAIEIYCSJFkGAmAEYAIQJkhJZmDmCOYAAAyD7KHbhykp8ME7PTQLaI6imgpBTKSZApFozsipazICFA2oxOqtrdn1opsrVo2da3YzBAMnzy2//uSZPUNBGRswwuzFHRBhgimQ0oqDoTDDi6iEsECGCKZpIoYOCOmmlVfbranvsU1qEWq/VGQrIVWfohGa6mqh7M8UWUuc1aNLIrLs676gJRoAEFNhAAwUqWCPelsZebtUzhWbcZHglpo5iMbtxCnyxujp8xGnA17staFCTp+Jv//9v0vVQVO/////////7aWAAoRRFxnblVn5yIQ7Utx4lDQ4hiBXRs9oWAkwHFIxo1gwjCgvKwKAaA6553Zbs7GDzhJ0Vr9lnq2VpmAJ4ZAuP+6fq+p1JPv3FmEu7PyG1zKGeytqEoRty+LRw5Ny4pY1DDDUAGBCKrXBTsBAAUG7T1MLsqxllLu3pgdmIt2VRoV9GU1LWAotIVH0ZtmHKFh6/9P+GG///v/+JH////////ufbY7qjA4CyIF2aSuBqk1KohFopYqprtYEYaCEQTSsegoCxhIKp1XzJl8FYOCZAayaK36HW81JomimQWYGZWpKb1GZpUkup2EHg8IYZIOkqtBjqVZxlaWta3eykzAL1E4n34OVb90/P/InD/8eGW/X//7kmTyjQSdbEKT0xVSPuYIuT9HSA00wxBNdi5A8piimaKKGKcNC5apdw7cI4V35ThkSEfCTVCgfP5FbhkCi389JQTnBwiARlJFAEUvxtwcxdbkYJozkcq1BErFjqR2T/zRJBltWezMk0tQz+kS/52//d2//+FL2f/d/2//i3uTu/9aBkHmMw61yLxXstgjGm5HxQC1tlgLQIDpnsIThjQPHcg4FC/hUomYwB7LhQdS6RwzQUYGhkWSpmVSnWoosu6ji1GINYiwqZtSqmXZS22snS0drCzyEXlxh/fn9pl5+ZW//3rH9PuY13hfJ5XsQ1yybvzlPMIXrPvLW30cusdVzaUEzQQ7gABCJ4ViU1azcl8NOLUrYtUzg2AS6GErOgNJgYInUdTL3N7wRJliEEMq9egxK/hf//zX/////+V0eL6rb1pQoVoFBAXHVcph3kopH+kdPdpETE9iAGiqIBioQ5gCAJgAGxzbRxkgDgOA9Ph34cjdfWWWtB0WNaBaW6kkUnSllaDNZJRmBSRG5NoqRr6+ydVSrU2evrEYk/pymP//+5Jk9Q0Ec2zCg7AdUDxGCKY/JWIQUasMLsxx2QmP4lmkFhjyHz/95dLDLv6fn/elM88/MkOpzOfSs2kYsjlKs7YMtroJjwcUHWI2jlBIE7oAAUh2cDhNSJ10+eSsK2sNSSDBl7wGpnL0D455n6UKxyq4wNc25q5LppgKP/////xv///d///9d669fLwBwTvGmxLrDu6ilNIrdmmGQIqoNsrNFQUMAAIBoqmhHWmDoXiIAGywxKzJ3JbzUfcg43Gj42S4ncaiqtwVgEET1v9SmXr91ooKbrUtIKgMptSln9tP9VXv6PK/+a/0fcDlakT0f8H+NXtbdf6lEtp7P800nv0tSLKLOJGwBc1Qv3YKPnvpEiPzZt3IoFyhn4xjgEeNTe10bMlZ4e1/bb/KP//6H/+3/v3af/r+9nqyNbkVwBiSaKYLcqkYp6V9IVOSSuIwFWFQEhcOTIgakBJKJxpFtBimFBcliUMzS0moIT5dUkYs5wk01IMjUnRNql1qWcCXEGWp1oLWnW/MLrZSk2qWpOqcE9FR/UU1Nnd3R0TLsnfd//uSZOwOFCVkQwOyHVI+BgimP0VwD0DTDC6ZssjfD6KY/R2I8v2mtXc91dGUyHd02V3MpnpZrKhBmX3MIOhqHeZkkVo+IPMgAAtBylfJJi7KWx3E+Yk7Cd4rlK2Q01hPoW2RKvWcyDfqZT0qpi/oIN//6f/+PI///t//80vX3V8wltVx0/BwUQDg6LjKubxnNult08PU8zQhQCUhguDRgIEhloL40ExgQE5xu85ksBYcCTTXWolski7T6mPoljj6QzNIouqpa1m298uAB8D4TFboo3PVUC8yZxI6yTKZSk1UkQt5Belmb1q///w3TNS+F8OfCg2rF5lf4cKFx8nl/Puip5qZN5PD0aXe7HCiEMRYRBiBoOvN2OWKv6i1N2rLG5UkBUgsFvxk4I9GGRWe8XqiSIqwSqfr1SuJAhlX/+a9//+v/9/Rs+VsqWxZjO1KwAAAMoA3+EYv0+rMvlHJocAR3xwHQaChmSDpQBAQFZwUaIOQMiAhccInxAh0PiA0IHiHGKTvSgIftLdEHWEKVIJoV39VbVM6dSfSupMTU3WfAv/7kmTwiJQrakMLshTiPwYIkj9HcBGJqQzOtHPI9w/iWaCWSL336cOt+LxtCiMchrirj6h9TFDRY0sEz7iyCR1YNhYVWXY8gIJBaggIABayu6m/pO3LEXw1ZfeloaBX96Xn6bQ5Zf5tWeXhn0bJldp+vSplwjGKq3////lf/////////RAFAeWALWczOcjUmomwtvGNRFH5iggB4wBE8RkU4pgsIRu7hRjMEgGANlD/wwT5+bqNXsaH1FdRgWmMEWXRSYyT1ugioshKJddmppMitfmdNlGqq2TVSRVUK0JJH6QMuZzJ2vl5TuyZ8j/HPz/cemDPZO+nZnPcGUzzOXTVDpG9jwunLMVwcmTCRLiAifgDO1ZysdT7U5S9e6llthutaINzSqvNwM3oZYHzK1+rPjCcWdv5VX+Fr//6H//9H0Xei9CID6KMdsipXKiguNsqzAwEAoRgM3eX252K5yzu7dCVQL6l2YHAMZtBSEAsOCWYAYuYBBKm88MSmwgiZvjBllQgVMrDP0DXNa6mTAlIP5PMWXTZJSbLVQSzpsvUusz/+5Jk6A4DrTDDi6NssDzGCMpgZ5QRnZ8KLsxziQAPogWNFDivcQI0Qa866jN/DX83/6V1v3f/ol77ytvZobq5PCLlr22DhF8tLM0j7BOsKoJEuFK+IAB2IUXq8Nlh5iTZlsdkazoLG09IN9fky0/S72qc1PVFKdl6YUd///3/f4a7//////+v/sWCgDEgFQHwuHaGJ12y81vaajNwoC5gOHRliMZgMAZg2IBtNXhjuDgKAllT82rOG8tOpzWoxTXKSPT3UVNurZIBMAzFa7PUtm1IGCtZ5TLWtkqqUT8oLeqdKK1oI69l61nGK97mcLvT8lI0L+/zO2lkd3NJadQuQ4jwqeT41SRmKtPH0OmJQSJIzZQgJWDoJbOYznunGLdynhqWx2ClT0r7HVcqKW5Y9vb5CFwHZ9htL7hAf///+7/9Kft+39WiLagcWM7I41VCFxSoIwcqMaBUzy93PdTtmwSgKDCoDBUNmRx4zAOBp0s0jydTybNR3k7+ZDtntScHjnQru9/TkYn1qA/Kbo9rXdJnsnak9bXZMTU2W+pE8ujd//uSZOcMk/UzwwujbLI3hhi2PyJwEQGpCg60dYj1D+JZkJZYXEFjeq7e6+aCYwCSRGbrUi97SkcEDL100nHBSpgAAYRDjEevYLk3G6jL5oZ+l5dhzYWA9JcAyWP/oeY91RTbefo/SrsIHf/9f////1f/FYt6slsTAdQoAGCoHCi82XOZg/CVTO89AkApiiENjwRHvQk0AROf465nkHhgEa/DkvePN4s801zxojxjjvVTmbGfnU/fOtU/3ekAM4ZjZJqlJmzfxJdSjkKuW9/2jAICN2vUib7qp5+p3u+LjiYruu9//hLHv1Dt/EMq9/PFr1V021aNolcb7pXF8tdx2vsPjx88IACWgvaqxd8vt2MbU1As92mjNPNykeEZPWaaGveWWblrtl4hUc9r9atUSeSt3gMCAmP//093//6P0Vf+U6NykkEhc2xKVRGBAcEoOBtmz/xHUNNwsWpyPiID3eS8AIjGIpDjgDgkUDQvSDCIKkj3QdOIG5u1N0kqaRky5q1SDqRd0zRSkEtSIBTgynFLVRZrP0U2RrapTPupcTY9Qf/7kmToBBNjNESzhmywOsPopj8ncBGZqwpOPRMJEY/iGaGWSGjUUUWU9lUHu33h/knDvNL0rYl8/KPN+J1T3/KGP3XqU2V6CCMIMnwxqdEVDDkIDGQ3pKEPqRQCHIkfz59C01ohr9IB3YykjNuwEK/SSIO6Hbdimih6HT9FjO9uFjlZ93+rZ///d9v//6pOv0SjIoA+MgY/didTKloLWU9TF5GrofEILmVohBYAjAALzLOYTDIFUhnRhqlIepxzf0HUNub3UehvVZ5taz3nQlma1tTWk7qU6mSdklJOpJNlVJKeQ88l6j17mvd//0x2P1+tr2cWXfr7P/vr9V23NGJMRmkdYeLP2zO8GpWD/IATfwAoEBYaRMwIcDuScL60FdLq5BJl3tqIxvqdZPNVHZLWVM5E33NA1p1v/+7/////R/X6+U+5dKoUrArJHGyU6WcxiY7a12no6lqWIJmWqdrJM+AI+tI56KFj55ZFeyVlmDDjOEdSSmcmRIMQPIeiyCSYKaEOZosb6K0V6qlWmukgrTTTUsYqZV0Avk0GuYayhDX/+5Bk6owUU2nCA60c8jpECKY/JXAPoNMMTpoSyOIPopjMnYiCzFvxL7N7U/SlF6ZZC9ZIQWCv/LipCV03re73J6tdy69ed2haZ+QPA51Fa7tJXU7EzYfkslO/lHTKq//bq9n08q1pf/V0nb/6mAAgADwHFpG7SeBpuAZJD0GT1kQgmqQlBoRCIYkEiEAeBAKOX0MASeCwLtAgeKS/uHOWNYcu9x1zl7lWmsY1M7OFXXJfhhzOrWQ8XFdu757eK81nTbr3Wn27W2eKBFs3/EIy11uU7vm/6QPSbme4syPJy3wY8YzLHddHMme/S88kMBcpDeDZCzrWGKS1UOklQNmFFiYEgYPGKyAAmQtxY1uSHmDIyban6cjUEkTFtzB0vLcDXffqzyNpPXfaZq0VyECh6HMOv/T7tX///e371/qHAD8hi5xQiWXUakAHg4KAJdmHo1Vp5dam57CutVS8qAGqczXBIDAIFQnNLonMPQTTAduGJfYsd3tSGidZJNaKSKSkkUkKLqs6qaghDjLdq0Xuq6l9TMtfoVKlJCZwgnT9dEL/+5Jk64ADTjDGU2NssDmD+MlgIpYTHaUGLph8iQqP4gj8lYifT5e7feZlfMs3Isr7FGM/oIi4XLhoTbE9OxcjhmiohoSGoPuTQprjg0s0gAqoAAmJiK9rWG9zVNKbdXKAr3biBOpBZhdw+EHBddkScWVPVVq0ltDk0EG///Z////+r9e7fsUrpwoQckBlA3HG0iUr4Gi+71epYlsapu7QK7OEIHMYBqSkgKAk2LdQDMXdA4M2hxVgfHDANueuddzi0zdOcAdwLhMMkVrpdJlPqqXRv2u0vlmgRWhObFB0PynmKnzqki1V6JyUvkpkXN0i0OklVzY6pQQJFKMNJIgc0PJpEio69h+kWLVjBa5OSQQcl1W4qpSUPPhNDkJAvkPIav7P/Zd//9dfo/7Oi4UqAUwJuNtEhjTwxLCWXJTKbsjsY0yZ6RC8gsDGfEa3hEDnV/YOTSxI19WmdfcR9j+s2MfWayapTEG9dxZt/GL5HONqSBrKVGtROyHfMUcl1W8TShK9t5IjWI2CrwIYZ5pB9KlXgcpEWTJxEBySE2dbpliF//uSZOsABBtpQouwHVI84/iWZEeIDXzFFU4NssDcheMo82CY37UpTJJcAOYTwS5pb0PzcQjUsm+9f3OtDBfm/DJ0yrNtcy0+aM9oORjObpndkZcO5X+hfjdX/s3XatS7mrKaW7eoVPmULFs4RzJg+PExEGgC/QsCkNzMcpY3HZBL7kAjAGsDFAdMAwQM/QXKwOGg2OBgSKEbCsGEPBXLk6ZaCBup1qSSWa1uW1Om542aYF9SVEIknaDJfVev1XZ2zZZfpuXWN/ECEvlV+led/m+semxiL9/fy/qm3anz5eMMvX/tb1nj7njVduxftj7x69Ozf0djvvzaTqfz9I5U6+nBpw4/VwFYKkUZZQEfhFjfxI8esrLPVdRy1Vmm35bDIveKuzsnSVWFGa5bO31bv4WZMetX+jp3a3/Z+3r6PZ//11SNGAcmMGAOGGUTc3I4GkNDHMkiGbDASEY5MJGqyYMDx2XgGUgYiO/EvnJ/uHO63e5he3lzHuePe2MMs9Y6zvY6x7ltRV57vNdln91cQadNKLYtyBIyOZ2jlMufGON3yv/7kmT4AAO6M0TTb0RQSUPocWQilhJxrQYOxNFI9o+jKPwVGLXS2Fp5nDW87Lof6OdPzJDIyK6tnNp8YX1a+tO05hzPNQjZ961YM6AAkoAAMhBgOSrjM9mpXQ9UmtM1JkkVuCDRwcQ4h2cyo6L1vmO79V1/wbyVX///d9n//b+ltj9ekBi/dFkkDg2AClQAeEycJEA5THafCVTOFXCICMFOAw8wABDRQhQiIBKY65IqDWfQHWrwqP4avtMzHDKM0FuN9nV4XWmpZAFMzO60trVLW7LR7oV1KuozGMk9IpVuaSYxAVJSe3otIuKn0PmCrBq3kHTgAFyRE/BMKhgoZG0kRYKqDCpzfXxs4UGD1/2wlDPPCO9wyCCzJyc6XLMqeVPbp9dbb4/q////8t/+mumqlLcB6m0FooFzpKEo5QaIlaGHNxgB+LUuq7zmNoC2OigDMAiA1CPwcBTCIqN4fAyKDkUWvS3I8pkK0Xd2MHnkD6bIKVpmS60LorSBQDct0Fz2Riurnct3OVW5kaUIqxLxFyvRUV1RKpZipJsdmPLS8yr/+5Jk7giULmxCA4UfED9D6IY/InAOeMENLhmywPsP4hmRiiB7GOcUfpIeSpEstJXugscq7HJEDO5yut3PHuMViEsxcxwumlAANg4hQrT37VTtzZ4mmSPVjy66F/jQgb4ZxlSfIzGIDMdyjPZfs666wT3/Zo+v+jX//3dH+uzap7eHG6jziqXr9AIO2IEvwbQVK8kvXy8rnlUJCozMjmJYAHCk7moRJiolPbIqIvGdKmplqRs00rWpDTcy7tOKQA/Eop3QTdXPbNDW2s3I9YoZBDcoVUiMy/8y05tCflm+9LzT8vyhnLq0U+KXx/Zol0jyC0zEIbMzEvVDn0H/v2VAJSycexalECmGMFeyTSy4iwKuDAfGmpfIVcnClbUB51OZ1eqXN7K/57l17Ajl5h3ob9i/v/6/f/3+j9hO6hvQKakgAMBCgctLxltWOyh0qKw7njgGgcZBIcADYQBTzBIVOkS8yiAVQP3GLbO2HHcwrddw3h9t0e1DfOU99RQ3BBRJzuLj7ZVccV2lP8/9FVX1zyLI4THxzM88vsIshrEdF3Qq//uSZPEPhDRsQgONLMA/o+iCPyJiD7mzCA40cwDzj6JY/AnAdezQnK7tNDzdy9cF7ptKxJXPLlvUlc+szIGPYS7gBw77AC1QCE4FzLdDaOoTgiCLmXI4VbKtF+Pmq7z4B2xR6JTTVpCyoHpa8gIHXe3u//10f/19+5r9n6OLrFOIKDYQF2uonPTB1JSZ25LT2Y4l8zSGAqJDKZRS1C4sND+4wQEF5uxQ2HuYk2Wu2rVblGPhCnJ826H7LbFyBcI0yqUZZdy66n+US0/PVQ6GUtIY1IjMj/MGjX10OUzpxFJfM2L0hZxjzewZMsBWEpYjNTNstgRSQFBxYIRXK0sIwOOPCg0qIAHZFhkJymbP4Z/yxWU7YXIk6e4CGZJgGRWvTvd7IQUnpB3cs6/Rp9P/3/TXu/9H+v9nvc53YhV4A4UCQhJha2sNRqS3JW90Zs4koHoUOhCHzQ5IL6GBA+aZ5JigFj1Gipq4iW17619bgPd2i6xPm3h6pfMLMmcU3KFHB73F0/pTNSCIvuHcctcs1CtvNIlyctShHNCT/K8VjmfD3f/7kmTvjQQQakILixziPeF4lj04GA/lPwgOLHMI6QqiWPyJiOlX/t90anSGyWolB2nL6n5fWMKdUEnHBnvZI6lbXmbMgVBKsggEAFwISyxoMZ+qGa94C6taURqpETFhdUWa2+VEdkTWzF1daPKmlwsqSpWj+3//5pLE3/o//3UZ196WIugFCSGEAeiiJBnBs8se+8+78TvylqEDkgFRtNWAprZaI5Q0AxPK0wucypRtV3V8XUKXdvTe186q1tu2OqQVHKejKz0I068VCItCudJyOHM/BF3+KdeqXIbblmc+Z/Dmbdzx5CWwycyNQb28Wkctr7HgueyBpU55lCMhijLubgLY4VcAk8qn5VVmscoBik7S25VhVur8zth2GzoEzzjRkQY9PU5lhrXvcjBn9X/9+63////u71K7NdqL11xyAhdSgCRE0ShcbG3Uv1LNS1HB0CcBWQsCQ6csvRAPZkg5cKdUM8DMGmrw423tdNc+ZLtkSN7vGvwPJjf3mPXKsLWHvF5sPVLyZqD42fDnl8zaTQ4ZXachYvkx+y/sRbz8e9b/+5Jk8Y1UPWxCC48cUkBj+II/JXAPra0ILixzAO0P4lmAjhh//LvZQ0pRSajfP23ATgqV3Dub7pEqxmU2AltpQJBQO1KHGSjRxLYx+9WkjIa9AZ0PIaeLiqjqyzRSCZk2ZuoKP+z/aLP1/Wn9Tv/1U6+pP/sXmhYqiAwgF3gac0dpkMzkqt00tiLE3laOIwKa7FRaQVEJq7omGwaShXvG+kSlPFee8k9ZZKbzlyv4MK1vX6/8X0IAtap7PqCkLrzq+dJF1uCKh1N82BH1EOsh9YnwpkpkyWL9ycutxX9BiJt7a7kRsQiCPeBSrPQbReErHWYNjhEDI6yM3Ug5EVHChlCjSgFBphpcSsyQnRERAbULsJmq+0mpiCQtbK6QWPyIqwsnrcIBi+R3tRNLb+v/+zp/V+bFqUBJgtodiiQ+h7FAe0w6J48AKsgAYcBAYAFuLylVemtUE1K4vNpKyuASwDTNQieMlCRkqvGDwEX1RQcV8R7uJ6Z7I+3itPnWdT2peDD3JeeuK0DaVEDW6URCsZoblwq8qw0vWP4Zf/53vPpb//uSZPAIg9c7QzNvHFI7IWiWYHgWEWmxBg48cUkPBeHFhORglr2T7z6ZF/5HM7pn+Zw0PnTt2XhX/echQ9VRsslMsUoWBUJUbnOAFqRAAJg9Pdw4L9XMVJ38q6vuhcTkkBlIGZFSip2dmOrV2yp7d3wQjZf/+vZs6P/2f/1X079b1u85slwYISNTBB12nspuSCbkM/ftK2O0nsIBYzxFULCwKffrhD6r6DqbF6+uXltrKXerTua232tr1b5myy5kbAdAwtb13rlerh+r+hErERdDlDzU0Pb1Zv58bIpORaqf+8LyginTmHhTBnCRLbCYzlfHIs6aYuEZQyiMBSNwxRUG+YMVUEqDxNIAAcVXSB9GJ2hpoK8nheVrjLdUoK22a1ei6EqIAMVBsfOJKSGoY7///6f/3/pVq7GKjbDD7+1aELtNrjAgkbmEBdljWGVvfLJdE68jqINP6VAGrEHW4eAgcDzkSZDkuoRC5NbMHE9kVJ9dtyq1qdU9zYdDUT6jon2UH8OKMffUpz0fMmJW/KNERiDSUr0/6xqbq1MypnTyIf/7kmTsiYQJZMKzjxxSO6Polj8CYhBRqQhNsHMI8gYiGYNgYB8Riy85uDkNbpyYcJuTsNQpQbx2KuxKNshGYXaHQYoE+hVIDCByLEwJi9ixYMAAXom4+nF2xyxtp+NiGFW4t/CXmgrz43x5uimb7RVpiAwG4INb/bsv////+47o6dabv41t6jg8AGEVYcCDkr8ZooCeqLzE1KpWg3FVZB1s/PiBgABADSNMAwoAhQY4E003qdembVJKOoqOMpdA4fTSU118S0xQWpIyyNETSr3+UU5OpkSvDpX6cLpn/5l5/fL/3cohZ8vnFm+RkZIphkMPULMjpJeryM7M0MJAYsoyFYpLe5kFPGMGkBKQNtRh4a4kR9lmkbk5CeO6Ls7PkgX1SceX//sNNIMymC0SGNbT//7v/az/zn/2fsztNZEMDhK1q0tWZiAABCa+VQwkEQToKS6V0PI7j2rhgwGRT4gADPBdoRVBzG+UtqEw4tIdOv/XrBT4607v+9mkVZ+HL7b9SQMyCpaXxf75Ul5p+x02uvNb2kH9Pp89pjv/3ftp9zL/+5Jk7Y1US2nBg4scwjmBiII9OCYQHasILNRviPUK4hj8DcDrTSWIP6FwxS3x2d0x7fb6ve73+i/v80lTE0RuNUqgF4fxiwmmA+pFnj4kYqYoTW1MheMVMm3kWhBBbTlSMJyyzZ1Hu/Zo0+j/37f/TkOr8RJpmJtq3qKmehpaowwDbqyyHpZBFWEPnfoxgCamMAINCDmxNA0wUMPi6gc9K9galvmGF4u9ig9FqTVG8KtPxV3VabRmgzNOj1nRzOFQceyUhTrD0XXvHeHKebSK4bOkm12cxHOJLQ0vu+OtrXrmZM/7ZOWSk7zTo4xrCBCGhUe+RBExlCZAtBTWCFcTJENSIAKclggb8JRyAcmdRp7NrUSer4AoRx0sDWk+OhJGfbaxh8ceZd/2d1P2//p6/R/c1Xz69j2RZjHDKgKIAoDQEKmSMljTwyF+d52bisTmEIKGReOlxnwkGDkJ4Ekoq91KOcf9o5YXO2VwHVq++sbrm6s3rNfTI5y7mDQg07dS+Lx17f/3Snf3jzLjJ+NORd5u4V9jV5O5k1ORT7tO0W+n//uSZOwIg7MxQ8tsHFI7AmiSPwJwELWvBg2gcwjtBaJY8zxgmesTln/7GYg9oPb/Z6+zZMafjRcpn6lG5v8dTquTU8jdLYnSD5MQ5MjC2MfHN2wAUAkZVOl3EXG1So4rU9Y7TEfcKpLDSB1HppHaZNnBjselzU3JUx9fJ9f/+7d9CPaj/Fq1GWbKk0vGzI1dguF0lQkCoRT6WdBr+VqarD76TlNdSXqsLLgGegquIQg0z9EQEI3Ip6ldjoZJ6X0lDGU2NykF1PYbLuk/Csd4q1F+OKSmV+eWRN+Z9I9yzVIx/5+ep/iffifF6rVkJEWIZbzTPY5fck/Ikckp/7csfIMVdzdgwpOy4kzZyghJCwcC4dPESYFBTdrCY1FOIOVjYU9alYgnThlBpBylS1SdSdOtj/////9H7mbtXmlBJqskuxf2qIiQHRr6+ALkYvaGBxpD309NGpZH5DWuN5I3JC4MMsiNYohCBh6VAIBBUsq0nqfue7fn6jTn/fDM31rkX2F+xpBNqNbhTZDj5GB8yN9O1G8Gr3Us5cs3/m/xuZZbTP/7kmTxjZSabMEDjDTAQcJocT8DYg+JrwhOLHMA5QWiFYTgYB9hc0L0Yxa8yy9iMoROUIiQ0OQgzGdIiQGJ/ZOO+GZ2FqJ7wrtYDQSBi+QACrI4s25Q37V2MyKbsVqbl2Ya/jNCJU8mz/bQiINEFFCdJYUCsaUc45ey7//////9nso7NEWVoi06kzJSJ4MJQscq9BcqtwE5sjskIkkGAIRkZpKcnoYADnq+IOdVJSmXWDzzaoRDzzPHDrhbiau+6GNI/udJPCqFMXDTb/z9UnTpTzMpu0RtzMI8onTVzVWTH8cE0t7Dvd+YXHtNxy9zdqsSU1MpiVUy44VlVpYeeC6ztKhhg2xSJGMNIbsgmeIDgUWBwlkGydAAOxJZ9wkUeCBRShbYv0hKcl1IIDmlRyHgR2XIA2HSThPFHlLhn/7//9X//f//kFbc8s/zM60pMEMkQC874PpE+z121fnadY7mplrgExlk66zzEMaZ2zSOxbUhxZYl6ujIHRQ96X7hJeapq+QnCHRelTJaVl7EPpOWUfXP+ljuW+rJkhsn3OyFUPP/+5Jk6w2UAWxCC4kcUj1iiJZgI4QRka8EDO0MiOOFolmDPFgip1P+BLVBeZIpWCFdsjw4hjdlldFZTrdVpKJNKIBs/IynAEMEhEGQp+rQABjUxMBpoS8BcLMzFCFjYeR4XuAiqsMuc+eWHSEYuIDJALXl3Crv//7///8zr++qtFt/7HIeaDAKn1znlUJG0tTZ1qSV9oo7TavUKbuUkHSHnsApPGl0wYAOXYp+dikM5Iuivq11VMPIFxtBhlkfNvfQT8JRdJPzFpfX1d6us622111F9p7V03zM/cGmv5cr8xAShS31zS2u2/Xt+Qv7+7/S19fAs45drIGRfO2Q9LSvUIodk0RjxMcbecXkcBfGgC8JYlMygUyulgvUz//o/f09e1/+j/8r4DX03jlzwQSoasydPtoGIA7Rcrsu8/VeWOvAFSyhMe9ngyGTQ5ELqDAXMS38wMB2tP7qUhpk2hzU8MirpSuMzbdXTITz8atYFC8nd+xGxMppRNYyG4Vrc7s+67Y63XiKObtXrzWRk/WzW845jVUdDXo60fj9kn29LzUf//uSZOiI0+VpQYNoHMI8AWiCYS8KDlDzDMxtDkjbhaHFhOBo6d29donI5Z9JI+0dg9dvGEGLQPcOo3LxeF2rDTmcwnQ2IH6t2AAolQpfOTd9EOFlsEv5a4MsLoqmW9YSZXAjITP1d+30/er/Xd/9n+r17fRcLW1IriYf0JSI0xBDBxOV4WsQHD8PtFjcNTURSGaittEE4oIYemUdVmBCs1Gte+6TlJo34eBj7ITW3tbOR8ynKm+YocfBp6OWZdwSkUkZDdFLvLsePqWbPTxZA2e1THOXd4rET12I4tqBNJiFnVEwUpmwkIxLnMc6gYqRieAuicXDCCBAnD1yA0VqgeoQdXCBVgiLXCADSdwb8YFok66PS5peYJ4XsDcaQ3TaPmzjNtgsPLqb7Rgzdnf/9PrUq//7d9X2ZdBPd5xdDSYcFcjaSJAQ5dQ8Hde7K4nDWP2+S4RgZiDE2ioPl8wcsYTCAaQtSzU6SEUwieHKRY33OORJnrNf62gSWnrd2a8qnaaKj9qD1mbO/vuKOiM/mK1vk52d/FkZ7kfKQOf/Km+frf/7kmT2jcSWbECDPDDwNWF4gT2YDBFJswQtmHMA3oWiSPM8YJLryDmNDuuaHYeZ11GIXk2wKRg13dgCeXY/mElruAkK5EEC4YF9BxOhYotpN03ShxbYnVnLKv+U/v3qo1XsG//v/+30mHBCWhAwyWe5rEnqg73TsuTxMVf7SQqATV4mLsDoNNTU0w6A2GRPHMsZMR9LZd21q9aojSjf6k9bdUerTbQ0bqpsVXJeYhkz/BI39CzdYg06BpufWtGtTa/Vtos1freaT5WMXeu5N14BltUUT2SruWg+qr4+dKkwO8YqsdRtkwrFGyTXCEGWxI68OKRTW+BrCBruWEjidFnWcSGnI0AGpuUNgX3Vo51nKfq3lrU943pKA8xwjtEZASB12R837m+ta8eUJAVy/bZX66+j7b7o1iO3qP67G26XXUJADjmA5GnJBcDRCavSXVBVpU2pXMkAc6Rp9xwCMK8EA0RtV60hZOKZmqUgYCQ+SCxqyzvH0QIMQ70mSPV2oNGhVzhZObJemhL94xGpuieUXikfb23byaXOPlc8og/dgbv/+5Jk8IADnyfEU0c0EjNBaLk8zxoTqbUADiTTAPEFolmGPGibFTOUynB8lp05Fgg8UL0DBo7hgaPSQKjiez0oc0+AcYw0EApoNoyMwjbqJKN3ZCDHagoiXY2hC0gJQ0QEh4oq+1QcVaqc+j1f+71f/d5itqVv7RMmizCgVmAKkMhy4VcHrU9i+a7aJi1avVjkolNI2drjAhAQNY1XGn+cfThyK06Iz+wITcYgV6JEDhkDijDGV6akpYKlIQhRbVUYjCEu5Bqno7EflRtjfeRv0TU6aGXtL/EQjGq/PYoQRzMLelnKw49bMWxMb5MMrmSFRSSPhyiK4kPRAEIebOyTogUMjDgaoOPdN1TAs1cTV93qNFGs7DdmgIb+Lm42Jk9a0ufKsHh5RNfX0n9RfV/2ej9n6aqGx1lf/9m7ITppi3hM3hbsyhxbq+Yq+diAVFYfUNXsH+laGbnSGpElvxJ8JFuL0sCgwxjBnHSMCF6J13F1fJAaicU6QqItfVG2avXclfjuWcJhDJCW+pw9jTeUsuxYJ81FyzrECt3M12h8lJOP//uSZO8Pg+1sQYtbG5BCgYhxZTgMEI2zBA1sbkDRheKZgzxgkbNGAc2DQXkaJS2MGhslo5PBYc3VRwYBRcRAcUQEBmJUK5obhNzB/WIFy7Zmsn9kHjiYu07rEBgUck6q6ig8l371W1WaNP//wxb0f3f+j7aMmP8miCgOY668bfqVw07kqnuMsZusglZPjqnEAIbn6AYcZ3GLeD9seyC2dMbi+RZsT1Glw5elqT3c4n5rvisfazcvPbsezO8yfu9tje+ZL4a8rqsRz5F+vnn1mZ8jcXH9rxyfztPKv+P5Vu/53/8m65fLpmymvrwtCNqFuUUtFNuLmZUkilyTXW3zpWpQBrjXlWUqIWSsIG6dByFHgWoAD1EqSIitgVWLFh6DkC2mnJlu3S3dv+irp/9N99Sm/0X9y9ltXGPOFVZAAx8TXiEELuPNL49LK0qikNxxQ6kowsCGnEqjJUBTEeku69VLa3PbzudUFzeSfGc2ZUdubEe1Dqrn01UxDOSEhKYVqo2otkpBWNIh7LTfhsqLJKZXN893TK5bNaO0NEg5wstjff/7kmTxj0QRa8EDWxuQNIFolmGPCBFFswIM7M5A8QXiCYM8aNVKwr/XzINOgrTdWNHLcTWlGIg6jGepUnYnzOuGI0DA8PhBImWm2QBXXIAHVljQk4opyo2nJIeO5QxzqqeBE61rGtbo6q/9rGf0M/fLC8jp9s0r/9RSv10v6UDTKDhNGF1Fa78pgl6I/qXXVh3dVVQyNlA1el/jeIQONnFmu7mlIF4Sd7wERNg0dD4HxeCuIH88g860aMWuUWXxyLFkpkXTU6ZG5L9RlWHMjV/0MiZBTnBC/ARo/hfd2F1383PpkdR4xH+NgioQzcid8OvK0TCswGJBUKeUqCMDgIpPAEyL/aFPHutD+/R3a+/XBfeMEYchilbkn09r0LdFIiCK/6P2f6+hn/9zG2p+1t/Q8DotPKQhxxxlIAaqgD0Ms89zvO+1qVS5nz+x+dzXjbUUIRY4krK4PqmHlANmDSrf2pNWzV2KEZGoSollGN3JTY30tBUAFwOOGnFErSCrCAnBFV1zEvcoCuISXpTIQ4k9EXpVUhiCI8j3MyI3zKS3O9P/+5Jk8g0ES2tBE2kcwjahWJZhLwoQUbEELZhyiOUFocWGPGi1mMknXiSuma5kpLm8aqVqOLIHSZD94iQgYMgoI5QapIAyhlJAXpMduHRJOa2Qs8p/boDGaDQmPXqDBHRSKl7vO9X93v/L/o/ZnlH7DmLa3IbYGB+XEqIqZCosxQdNjwBzaBgBAZnG6eT0UclW+9yZ5RvGpgaACveneZlBo5vpQ1J8zF2Bzd0mk+6Zfwlsry6OcqEUQAeY4ihdlZukIiRv0jsZCXLKHzcjjex9OSrOrnLqXZkZyZxCI77aenTLy1fB8Ji6qOsU/yP3upHqkIMXkpEUrujRhROxwBvitVQAYFkW2NN04RHeMQNRX4i7yIqHmoSWqNL68SYreQc/96bdejTkat9FK36D/7/0/+1BrjnbzKpwFyhwkihDTauW/1C8LfUkCyplUZbCIwY1MdYKDQYxjgLxQzPUv53sbVYZ69wECAgAqYcIPAyAYpTECgkcSGDB8ljrulE8JQR9c68DuGJSRKNxYZ5ndlaJqh12bSV6cJ8rU7a0vK/kvnTz//uSZPMBhD5sQbNJHDA/QWhhYY8KD4mvCM2YcwDfhWJY9jww9s998NzehDuZrTkKZGVah4s/Tu07BObGIRpWnGEDCUrOkmrUMNU8AT57D1qYZYurXmSLu7Yt+wikbTHMoFjcOOzaKEq0LvAdH1/bTXpsX99H//f//rr04vOrpUH6SEB9ZukiHMeV7v5rzsvgi+ZKEQYiffo8SHTOq/2fM8iJKF6inmQUyOwpEzrlIjILM2gpynSoyNwhHMgNBrnURyJWm+CEUlx4u/nH2lhTal6xUESk/E9RYLwA+5DxSeFxb3kMyVJu8R4xEv3h+ywE2UlQF6ZBX3R04klISBnA0UlT2qjjcQdEZG17S5t4eb1bf/a0WnSN/1Z3+pNPo/nN7mP/7GKc/YfPClVmVQN5IS94kNsLgyR4u6+j+2I1MvzPtVa4GarfrDnAG5EZixUw/zPKf84yC671xqVk7x5TrxNyxrPt0dpMbhDPFqp5A08s86Xv+EqIIhCu9OQKlJp2ZPwv7e7YH4003e24U+1kF+s3e9HsdF1sJ4o3bafNwXlPLv/7kmT0CARsbECLYzVwNOF4ljzPGA5QiQrMpNAI7QWiGPM8YNtfuVtMZS8rZrd+xevMHwqsKLZKpWTvJyZUcC0kthqlmIGAU/dsVXMn/eTU86W/v0CCNkMFzJiCAfWlFBkOm1iZKXqd/9FxB/v9/q/77Je6m6cxti1MOMLuMFlQTIvMJMASCDAwAmApldr5SyrF5C5U5WW1GODoEZGPv6hyM1mENAfQ4YcqOQ1U3R61G66asmKoh8orSogyXDjkLzfWsbEQ+caHmxmda+SU7DqsRFw/vS9yr0eVGmizbseQ1cxob8vYiBTifQpmEseuLPIMZBKNqwnHWMGQO5EMdoQOrigdwYJqmUHwL8eTy9iAcHw7lz6PmQOIEdnKgm3dFrO6njLv66XJpq0f09n/9//08mvfeB0AdVSgY6PiwKnCoapGA6Kmik3f5k68mgohATNRpriRpiM+j6AxKQHYJLejm5FZRd7aJ8X7mtzGEzZlDimJMTWEa8oYxBSaUEXlBOuqqWjD7lrmNUNwhG3DS6AyGoVbGw2+YIehRTpMdKdEIF3/+5Jk+oxExWzAk2w0UD4haGFhjwwQMasELaBxSMIFYlmDNGiq9FDB7CQzcG+KHY99OL/TiA8jh5khB21DAhV6SFMMtSP00jJvQkUEWRD2txAdJFqghSG4s0y+C4SiQQtbj4CvMquez1aaxTlE767HF7X/Tcr/d39rE1V4V/tQ4VSnUtRG2wkAAB1RIOvC24vHJnbybNYmI+0XJ02Ghpx+3COlKGiwcaVfrLq3q2+GmFlxEtydXpaOsBxo9IxLKey5XNTPuxnE1z98k+Wa0iMe3O5Ktszy/K3RkdyRuAsbIyMkQ1PJrkygiqYQWekLuJZKbwcfFTIIY7gZkUGBQIQUyQlCOMJCglQBEWrvoAGhYNbaSeQiEvyRCpyzeDg9JgP2WsaM6IRW93dotRX9Kfp/7vo9P////So4aMuwpynU0tr0bksAww1iisuw4z1Eg4Gr420g/MQaYBZHsVPFDzUOFikIaC5CiDKKWbsmEglhtU6J8UZjqnGlkWumaclrp2l/sK8PpdfKqfs53/hnb5S3+uozX25qrjs9I/dMpPY7l6ix//uSZPUIBJpsQTNpHHI7AVhyYS8MEDGxBE0kcMi+heKk8yxgn4Fv57myxjbRc9ELiWb2lc27xXl0XKTIxdpzmJKKJYjIospUkjXkWakTLLrYwPp7QolcWIRdzYXKZZcu21jkMSWHNJGirv+lup33P//f/b3NkKHUoi2xPNLFuOemdjzAhlRAzAKEQaYKAKayiMTsNxq1SRSssqnqrTNBCHIUPMkg1NwQHIExv1HviV6xtvYxmwQiUl0Uf0UovdcCvSqWcmJimpiMJhcjzFruCMYkrEe9RTil/Y0I78Wim4S8NysTMqKJlTrmkVbDQYGohREgwZiM2M/3KJfcZmJ6hg0tAomKOdgQBwNySAspZqzKcoQkooKJgjl3q6WkyGKLGmMx6XHjWVPGEr6v33ejXTp74YZ/+3Nq+vexi7ypE3rfBsQybDjaEEQZfWUGXlQCQLUK8teanh6co6m2ZxXrPQFIp2qGGuMuCSpk4gfCNPLuzXGxLQhKiVgG0yaBaOPKBKpKj77rc8Z31/PbJ8M/3cdvl20XYeZ0/St5Tl/tocAMl//7kGT0CORubEADSDRSO+FoYWGPDBD5rQTNmHFI7IVhhYM8YLvMvTTzoKHrQCRPEbZ8QOf0CO7IpcrpZ4avwku23OKVJZBUqqgKIHFF6HQWXqrnjJeOw87cGg+IHOTb/rqo/1fRR+grmrfTcr9n7ma/dZaKuWZJGABLaIBrAAUGiwVRJudWDpY2kSyqRRhsWjw4EMUfbdsp03o8VDQ4f9JQ9xTpaEY9QVMrW3Ykax1Gg8nEVoSNcbbOKlkAlHsDcjevXUUJEwqbw0FbpJkvkZjqaLSxT4WqYetKWuMe1cGSa/ejvHuy30S4nYg8Y0Mob0Ygc+UO7QXdROYAauYICUwDDikgBUFdDMIIDNzZPeJiMiNg4MFCmopWkVs9STuOLlNYoGzR83er3av///3+/9+d6qPsR24gJMIL2sEtrgooOE48DkrWPt+xqwveJxqLUudrJPSXv7FweaWoyc6TcaLkBz0GU822o2zubNNn0WcpT7DG9BASV4LzadEu4INGXtyXLEkCr3ctNzJ8vVMMZG6TOFJdTKzDzpdh0jaO8mkMiP/7kmTsAMPSOEJLGjByNMFYgmDPDBIprwLNJHFI4gXhgYS8YBnOgkxJb1Ipgro7cgwLFFDUyLDDjRgy0M/A6hdgIQweYcHAwNQgYUXQEhav/4Arv2N9zIcHqjge34dXAFPutOVEera+3V/TW7/++rf+n//T/VVgQMINQgFZIzJ4ve8sbf1fT5wl/Uxo5BRCSe0ltAIZfYIOQXurG62+2PjtrmUYrJSeXpdAwOZzsue5e6nmOs+8WWLb9GzdxeTlMrad50uVNKcm0llBiemvn70uT93CalsheH4vtMXu1LmU1GMZXwvnNhKlahMFJInIyR5hlHWaiVbINpWHUhWUxdI/uCmQdJYGmgR1NjyZEkin2xFSWbcTbJG4sBEHuWpMtWNvCqGwFhWvSSB8SpOxOb1B1wjaVbf/6rfp/U872K/1f//uqzdgDAoWtIzSljr3N1r0zWpBdoVG6KXIIDTE3uW2ZfujjHua4ifWPuFXhNgFk2Y6Y9CmQPKrCE9aYeLGWqnjZM5FVKwx5Se/5pcjEg6btYSUEx68PpM9UmXMQCMb0gT/+5Jk7owEOmrAi0YccinhaLk8yAwTXa7+LOzOyM+FYujzLBjCIe5U1ku6GHkcgYRXYfo8ZFBmrwhmBju7kZKwGZeIBqVBajAqHMw4UpQBLFKAhLDQXDDbTKYgN5OM564zqgXWBkJTsWGBEyEq3Y31a+//v/f/p9da/9P9lXn/2vveIaVQVWNQBjDkzkF14k1+lnZumiE9EWtCd72s6PhwiGiuVJLqnmt2r7Wsa6580cyJ1JucHw9OwIsupK6RAjsdqoAWgtDDnCWgxDqi9QicUz1QUNJVYH5M5o2OAJVhVAghuYNFI39JCI4RpSrL0nyDIlRRWT1tDcppMSDQdmMgdFgsmYzBo4UNbCUtKDhFIA0jJcjgbmy6K1bo/GgYbIqMizLSh4lPPIOB2q+9eyinRT6768x+r/085x3f/WPuq1vPhpXwAS5MgRc+UNMfymljwzsrqytYCpBBCBBBTjNDgtB4IOi0Si8RhwzpAw8mLhyzsd3+dxPdLm5yKnPkyT37TR6K8tdehecJTnxlm5Ur237CfIge0PoUzqROMmmS6EVK//uSZO2IhDZsQItGHLI0IWiGYSsMEP2pBMyYcwjmBaIZhKQAvs+Ch0SzByN2ii1Ja8tgkgeGHCoW4Qw3gmEgg6BnBAnBsDIGA7uOEQFddXqD4FQ1avHGdRbmzpZ2gKkKoqWbvFRi1FUg5ftsX/+tNP9H0ez/sV//3eNtQyDI1/8yPcIXCSzUJXH5TV+jlE9OReHa7IAGDJ3rBGsN15bk5VD3isU+M480iu1NqbvCMUkUOMGw+CYZzIJRiDwsEGWGrIMeLQTAsfzxHl1E7TpyIl3K/oVNiMqWzm3Inc+wjDJk1s8+pzdS5dyKfT0P6gM+UO8fxDVOgxid9dKCiP44HbqiGsWmVYi8DT6Pf85EUdNE4YcaC93mr/9H/9/r0fo///9PbqWxMAKNaMowEI4uS8UQf5lT+SZkkfVVe59QqBGqhbNUJxmEwJATWeVpBqepHoMpiNogln6bJck1cuQGWRc9jCJIQoLQLPQQLwpiLdBz9NuZfNTMUnB7LKrdQhLPq8457TptMOyLjFY1lpeOZS9bPX9FW3u7BA+515L0rWwS8//7kmTuAAQybMCLRhxQL2FopjDIDA91kwsspHDIugmimPCcUHqP05Jzzb9yjbnQR7CdaaYiUdCrQ99T8IKqVoqQa2hWCtzMzaAEvNSBmwQJNSVpMbUEtvW+oAmhjYiq0xLLFgBO6Pd/pQ2unf9Xs32aP///VT904UVlYD9qC4adLM3AfvOrAcMSmWU0AT7REpwKlQO6faJMDFrFytrfSynOqSyYyXhzpPNrqk6UtjC4IJLg0g2NlNQtg5g0M0W1RSRNSN+iByGSqWOCmQyxSZRR2AwOEEwMTsKKbhghmDbVq+RdZKvIZx/IULN8VFWMDpKLuFNGgLiHh3EIH2MxaDQKxg6LRg0wbmAFqtIWLEksK8r7N15lSEbradSblJkWQIG0HRMJZWnt2eL9qdi7sxnp91OQ2ofR4q3VlWtyGolU3LjI826DR5wgDNJU1F1tHhbs3cXI45UmgBlVmA2cAM687PzjSRYOHBMo+vwDSQuUmMPY4YijLnnaKGKA5OJ3Uqn5v7tLRFpmdrvXhTRF62xdyZ/BNPPttmylfiq8ac+fHG//+5Jk/QyFBGw/C2ZM8jABaJY8KQARca8CTJhzCQ+JoUWGDDh1Y9xbsemz7JjIy/t178Rd6vv49ZkDp+JTb3MIH7FMdk5pAHTzXpmlSZ5iJz4Y75J8AJBgjtT0ggLgGN1ibhMJJG0xhFAFJIfJsTgMQJBq4ouyv/Tq9r3o//s1NRq//b/9qf9AOVA43Mqwsud6K1YlAUPRnjPZbOjIA0I+dZ8YHUwx1RBZxj0JUa38oyllxZKlhMrAZdcitBK9QIWKZKczM1QqTQdVOKhmuuCpVywRMHtxIZj2MnOKJTd+FWbto4Z85cK8wXDotWDEjROCcmBM4E61yiiUR2FnQZBzBrBQiBQoeAbtuoWBFHFClAIESqDxoeh28E+aEQst8qULf0GgIqvUjeG0uHv1096+6j9/Vr2M/e6lzb9v5j6Y352xSz6L31mVQ2m0SQ4VU2ul02KtPwazsxeDFHzNGiDkmf6vVai83c2CiqLWxWh13JjM9JFnM6VbLYu41q1c485+YXO1nZi7nd7b9TXNb6c7ts7D3ku0m/DezxlenyNd3Kuf//uSZOwPBGxpv4tJNAIwIXiWPMcIEQWzAA0YcQDYhWHZgzxoO42Wh2NLrt/rPBfrfcNFNnjxjcx39O3ipwD7/MnsjOvVNlX/4x3OkVikI5iT7lsZRQ9PkQaVOFNAWL2r5U5R3e2qqSq/VH7FosSh3I/kPttdqp2+6Wr9F1yRZcgCKuqlLUKpOLFI1KaSxnPP+/mMEarzpTyn6D8K1BKbF7Gv5kOamtwyVRzTTQhl/lAOE6zu/80y0rXMND+q2t/PAnMhgNnl6vackaYKA/IzdDIg/XaMYcw7akwm2qVeg8uzqPBmOv8iFozmNk9I5FLgsKvtBxOYdiUkrwYjHRaNhlLZymkokSRIABVaYbld5a8l0Pg691S22vAqOj7Nfkv7cUQuqu9f21Wfqo9T7f9z6EbkKjFEFgq5pU4o1KXBnnLjFimpp2IzONHGJoqAGOvjARpuM0LLz8gRONPmiEVRi7PZ2Wl+IEFViqcyCzSjMg9rUp9U/TWAJGTGbvVYEo9Lq8IiNBjBh5CBFCPhh/p8JH7TSuZg5W8eX50yNAY1p6FjF//7kmTtAIQcbMER+TKgNKFYcjzHGhAxpQbMGHHIyIWiXPMkMMsUIQqQ8qcNJvEFglZUibAQUJlsUDA4SzMlSrHijDhMLKI4lQtt4JqQAlxpDmPX6b9lno0Wk7FXK+xxArp9PijmjNGj3t2LP1T5VYxZxAy4VPIAQUqqBqIwIJwmAfGbcMOi483UzfGllCZZrxTkOiIJcdKmV0EnXLlv7nkLDrNFm2ZKLPSNQHm+Z8dLWeEHzaXcGm20CTdzQmsZxATTrvhwF6dpEIf0BWiBQyNTEUwSaBGq20zKBVCJqBCHfMAIBc4krk6pAcMVFzCwjDHDmhqDMy1CVxSsczTKsowiFBInchHk7CYhaLKrEEb01bJUtM7wgVAazbkoCYaYKX+x9ylv2tQ5W7xcJNR7fv3+ztpHL3Of3Iqg2K5pbCgAKysoJRBzqPzUpfLJlv7kUpo3POpPULohpFPNGlkv5uMtSepn/ppS2El0TcUcm4GrY0YEumEoqYM8cIPgL0bjkjqQ3DoUvNTZRBnSERwg7hBQyCgQ80UUPvLNBmLY6hKcXmH/+5Jk9gDUFWjByyYcUj2haFE8zBoRXbMCzRhxgPcFYUWEvDAgbBtUnWoA7sZwq7hHBRk/JakUKw5D4WSsh5Aw0cigpg6lUVh3QcMigCW96UGDhbGrtBkSR748chuAj4oI2pqPUUHGPKZVmn9f/6f9PyH0f7u/rVTSlS6iXJnWEMhpUKrP0w2GZdGn9nXdh9sGUwm4IlZ/onWiSPrtJOGw+1M8UMfEqGIrZrTP5vT+wak2Xnrw27Xvc/3ovLl7spTjYmu4a9rv3T+fZycas12bNr34tnL3W8V4ycdDYhmQaZZvhOp1mgz23kzGuizy4o1jYK6eRuj1oGH2gZiXq3idyCCR+aWcqIElQDNMfA0mqqOy6k5eHV+R9Bsxlbq0t61H2eqKp6vuTIPdYrTemvqr5X/23u97KET8e6TYNpFy1QEBaAAOBxLzq9ch14lO0EF4R23Zj7lguptHrOTtSZhMYMpRsnnTfZOqLRpsdnP7SZW7aSJLCq3La4DEzvuxy8bXiZuM2S7uvPp3kVW16mZ7JulrxjqwtZ2c47M027movWLO//uSZPCIhFtsQLMpHEIxQViWQMYAESGw/gyk0AjjBWGZhiAYkmmuUt7vmz/RyDLztpU6qHzs6T/LMM1z7Ld1pHvZFItak0WWn86s2OhQ8AABqb/kjrglpFHaWkyWZuslrgpPRUxR/F6f5eM8xSjN+vizyGn/3/U3U/93zOudsUw4AhRNf9SRPWY7FSpT5yGvlbxkbdbuDGTwLOOEvqxvnuqJ9xdIM6fampLB307SsS0gyF4qACDRWDjgjMJ86RnDKOSbnmIzkO01yIEZh9X+je6IaMpvahYdTdiZKS1pAy7n0yJQnjQEG3heZopomcNGjPvmVlGdSSB3je94SCBNJrwenrK45ubvv7j1+TToHnC4uxq9TdPPq//R22+rfs//qbi/x1/ueqyPRC7BYWC6gGsSiVIB1AYDMKAXevyRwTHI9DzbU8CLkvX0dDIFYu7JoYaeJqCJe+xPW1GaZNwO4lMZWgnSNBCFsSdyWRc4sl1Vm1NZTXcdO0Fy87JdoiiaopVo8+EeiE+YFCaOMZjzayT12oaWqMVLldbSScOblDBzrf/7kmTwAIRka7+LOTByMmFYmTzGAA95nQksGHEI3QWhRYYsKOVYqHxNUgqETHK7tIiEPqZA4/M7dxqUw5VGDqVbHySYcKKXebh8SUACoGAfKvAwmCEzZCT6tgmXAO6gfTbUleWJdCH244zjmdzGHMxyFLHW3+6kfP7Hf6gM6BbbanaR5I8QLFglLkJUUNVoS+Brkjl8ehMWt02HJt+iM6EQsXBUKR53lwXWMvHioKnd7vJZ7wk6qMM5uo1lYj2QjGynxBqbY3eXRHsdKXEGWmuRzL5FCWEie9+avZinD8I3inrxD2TTpljo5gg4xPkuADJFYKloQjJABbQ5CHjhgAxAJXMw4AIMWWkATjYOC7UuVPktdNMUP1Cp49XTQ5g/SrlbPzbv3fR7HDWWpQyMFb0OQz/P/6Nkv1+hdRHQUWl+ny6Dz4y5nkP24diLRZmYVlMyKZyDV2ZILk82DYNfmUvHkbZV4d3uI2lJKjM9xWJ6rWv/HZ4NwvYmOzFZeP86Pvu2Kz+U89tlbe5/DtsPrXjP7qOf+ndNNsQPrHvI1LLTVeL/+5Jk9g3EpWy/A0lEQD9BeEE8yRoPnbUALJhxAM6FYckEoBhwWezFWzVM4gfDxZ1JVbvMoRYYsdiyxI8Htz8gfqNRJlABBFkAZQmrIIPMsphRpeaKU9tTKEUZLKjFr47sZAijKEL6PA6PTQyq3VTaEZe9MWey5Tv4huR6FJXspLVSRJmZBQcWup5H+XpiVN3sc6N0m907Gnk9DgJtyUlVpYFZtax2wlFsEoQ2UqB0AGCPAgAp/QTMeXkpCjvOkWlz4zESEHLhWl83rwzdmvabkdaOTqRUHiBxjDxVM3Gf6sm2ZVE0Vu4uHTl1fWakXmZr5EW2RhKLHYIwGoQQA2b+QT1xVkSdsIRXOqKeDcJsWo9PUGHWM/v/oTu3b6Ozd85//0U/3/9Zz0oQBhauqk0kRxdxscMSmL2sq9LuaeKNRF/g1+Wu0YxzzKwgnRusYviJeD0VGaT3Ww7Xf5XJyBFHGnUOSlAq6jwT95Pao15f+N21Psm/c76lOZDI59h4gp9mpQlDS/W8uio3dz214eiVbT9k53onDxZcpu5kKybds0gV//uSZPKABD1rv4MZM4BAYlhWPSIODsmXCSfkbEi1hWJk9BRoNQypswnbIXUPIZ9ySBpUyy26SVDlQIHbkw+/SAf3FZofonpECE4I3hqbeoJDPMIYjbNb/ZR0NV+u3dSu1KGc/pT0nKmXsTGtGKUFyJtYpEoInQOD4IMAZVrupeNOpmmWXulcEVIfhe5h6k3xwyaeQHnJYagWgzM4w31VUJtdNpRE55w6mm0fDaUNkpuLNZ3R1Mq/k45ZnS2eyc9OWZbPP+td5rwhmM7oag5C3dri0+3kbhRB2VKy8tiN+a3Mjw385h5RHUDvtzS+ahVSW5uPKJhfUxjgfyS8LHGqcq9rArFSUYY6WFjaAAUZAFSqiYMDkVnmoGgIrnbZUSFBVCcDKSzdONozFX3e27bqt8mhdta7Lv2+xSf0kvv2ZXHpMOJvxYBhschFJYjUtkE9XgOrVdgMxn3jMKV+yA6wcEbEYvxBrmOzxBIo4wIKT6PnbYhJKZiwjpHAUpfFrxty9yqspsfkkKoa8VG50mMtD19Z474LMGrkDQs7IWC4WbzMmf/7kmT7gMRkZ0FLGTByQiFYMGGJABJNrvwspNEI1AVhSPeYAGjKd3QYqKfYIa7DgnTQPAS6hZEMQooMgojCUD4HMeIEUlm7cLzG7TjFv5F2lX6olV55Fytfp7Lqb/+r/qEFPFr5OWqaT/QtnMIc7a6ZTYpolc8+gpxhoYggpgL7TDDqenqXpPGoxFoBVSNODlLchRpD2FSOtkctCeYVUEi3mu19F3WUigaWnrttoMpRZ0VEK2BYAqzlA3XYI8HNRJG7wuRyy1aZQMYJV4KJyrmSOiKx4I51QZMatGtiujQMOpujNhaHdhKlAYRBJQ3LVdnWsMDAoHZgN7mR2BxzEEwUG8rsWCIqhIgsikg0ek8IHiJZytKRbUy57u1T9VEpXo/kXp+5tvYjVf6XDXburIdUpKpaXDTVx9UAAiZquUpSVWV7IxwWenviVqnrKpgkXxUBDhMaxp8cJUWh0TPWqtMFkCRIVMoRJaCtO/6oeLoo3d2uDaPvKRlpHpOiApFCnIx+Y9c6hHyw68hmcXIgRHIp8Q/ciDFm5LHQpwxycmN67EX/+5Jk74mT3mpAAzkYcjghmFE9gw4Q5bD+rRhxQOiFYVmDHGi6IaOVK9DGS1cioM6ogmgFErAw++3hyQIlXlic/kswBgtU8gA1KW73+lm/RZNq+kMfXr076VnP+5jEOR0XoJ9swt6FPBFzQGgmfYoLNaeXia7BjvUdqnhVuuzOWuG7gbLC4WcgafewMWMDnKIGaThKR+mPEy86RYXCDi9QKq0SZxfmlb3xKOdOwusYpmwouDCJU5tJ2hi2q5j5qTWg9EHYs3JqUGI3W5CFZOCXxnfVsXallRSCNmc8YlHKPTZ9S3GGxM/eQSOUBbeGGFC5SPMs84wzKPYaQkbqGydhmBpqpADUWFHSEINc9PaeHjQxICaGIuSLMesui0Uz0/Qb+H036P7JXzs7vaKWMb1d1nV/2It7s/JqMA4JhBRpDDKeFuk3N8KuWEugGW2VsGNAzcAGFWQ4WLQYa6sKKfdjCl3DK5pg1oDhKgGXboKELN8kzCg6ObuH1ORzauX03rSzH+Xv/dWx79FdOHws54QXczG4Yf9+8rnM06xcs6dM9/tT//uSZPOIg7Vowcn4GyI7QVhBYSYUEoGy+gzkwcDeBWHY8whoZV/zeaeasqYudrg24v1kXOei4xEpHUvraBpHkzz2hKLmbSd0iUgZzeHhsKk4SOh6qWHrKSn2XsSQqHRo0iMOnTN2i1EfSj/F61O/7/eU++zUKv9KBN1ACUhu8c0WZNFwKwTlhpoy9YIHNIdtWAvbnORS7LPrS6CrNxooGWlEdC8r+pDVH9VtAgMZqO1YOTZuTcBPa6GF4QilAWNDDHTl6xwpU5SihGIdPYjpiCp0t5nLxSqlNXinLVyaig/jSGnnZj3mw8eqpEe8GR4jtgrTLWgbqnWEx6ZbcgVlUSOKFIAIGEZKAw5ZRJWlbBwl96uYqVQfc0MnUJQXd315j7uvrbu/fYte8d7b9LKNKH7nh/ay0yHhR72pkw8KvzoUElUfsPtJhpbs/sO5DC0Ig4sFzD7UUdpSPk/QHBTH0SUBTcwpKGcjIgUHjgoQIylNx1Vhh1VXZFmwfwUZhTPDcQwQljEcMK4u7zLUXmeZ0yQZJ2EU7Cb9wY3N6T2tOUzHCv/7kmTzjfR1bL8LSDQwQYFoMGEsBA85sv4MmHAA9QVgwYYgMKfuDfxFFkhKaIs2DjqBRDBFY1HQPatIOIAmYKSjiBahBADZmIWqUQJZZuIRYELNI1Lb1YUfIK4xn3tr6fo1W/7v7E03c7+eq6vp/QvUlS6WrIoH9Km1VkdXKuQibldNObiEzKdL6CpaescSMcA4ohAGEHiICDKFakwYUl2UhQVxChmeSbILzTP2EjAanhJMHGMuZ4EJCcs9/M0u6u8VBl3SL07+ZKzcyU7n4g6WZVlu59g+7JRxRZinnJmGXKRp23jn4nmM93GvzmBboNOVDbom7tOIbJRncLyUHIZGrrG+jVBoJHJVp+tfkBIYMFJMWioBTUWZiVZxu7Vqu/7KP6NKvq4sbprDrGNYthtioJsLOJw+MrFFhoKhoEgqQQyrUlzXUDGzclu0sXjG6PKlscnIDDrUniJNOjfrL8RsyVlDWaaUbmZ9Ns3hK69ZiKtwd23PXtinbC83Pxoe1V2XLM9RVNyqtSq5oyRkMF7qDc2IsnVvBoDMwYnMUedW2iL/+5Jk7ozEGGq/AwYcEizBOHI8JgARIbD8LAzRyQiF4IGEmFAi0pnxSRSGDW70gaFtmKwaStURuCJAsdzi4nXmYNAxFUyV6YnhwNgc8OT9YcTvvZSLzrCZ9Xr/ozX02/s463KvvX6Hbw+o9pNjblKESIoGWlggHOAMLQVYZmUTU/FIo58od6IVKNlISBK4wDImz6uVSXgyVXcT8UXpePd1Pmdi4nfkbMyik03EIWg/JdKqY/1/r492a/f6hHPpX2v8+thembcOtosqzO6qf5S8pn+zFZH7XuuxZqP9P172Pq4fIy4tDahV2p6LQPjDtzTznsw9IHKPtCWQsDWFiVwDHiOZZJACMyAgTZqLDnCAGonS4moRjmdxdowahZ53L1XXe+vd2fsfu2Mt2DqbBiyiomFlAdKAAHi6EtBAtCxW6AICpQDBz3JZVbj1qUs7h6LxGXSimYQIB258DTcyfpM+btZXKWWovkmM8iKJ33SCFaAwC0TDmZmATgXe6aRy3HB0L3NEZ8d4pMb5ZjrUxOxdbYjus85KC+kCrHeZ34j/rMbb//uSZPAE47NlQTMGHDI8YWgxYSgIEO2y/CxkwcEShWCA9iQANv2ofZw2UKhee+QyjpKxlFIpZkYrcjLpJ2ByRhOkSac4AhJpQSNPEYQet1kA8aYe+9pQ0eGg0AtWpwr1yVfX7didfXVH3xZPam9Pte/XeS67f3ZJj61+seQs4JAZezJXcqljLntrZyCUNj7DMvE3SHhoO+bpQcsdLr9ilfB7LV0zDZIJHsaXGGksWe5Ps7Vek3zMrG575u12zbtmVzvF2xsxHvfN41ZsUYr0m3tTffdepfCqkzUcQafex51tpF9XaB19VPMTjURKfZ2q5m7uuXNtcMUdGnFGWkdAxUkZOc5jNQEoOMe86DjZwmZGwuriV0JlWAbOmQMMSSYElsaILL7zd9ztX9k17c8hHYp3R2W2Nr9CUVkaHA66HB8LmDYsmoFDZmoELCEj5ODTtTZXSUZ6UzeAfJeEY1gNyPdFYxW5T3OYMLRVQjURAQkPLZFkWCxZWOVzpVzC3Izxp6+VniMKiiaXJcVQexcBXCQsQIgUiFFHjRE4ATyw0AiKxv/7kmTvjYQNbD8DAzVyN8FYVj0mBhFBsPwsJNEBB4WggQSYMJMAlV3UnBqHtzqajx3l5rk6hyoCl+nFvmhVgCXjSoSliOhk0JplJmrpisN8FAvAbJ56dbMK3cjdcjWAp24DPMKWxLWzzZUSuRIiHoDwmhCAoljqhCUXkExWHztyaAoLg/AyHRLNT67u9b65berfJhhJhQq9h5GEXQiYYjQjNMMRoUVfyhJhJC//kwmv8/+aEaJiNP8mEmEv5qjLCh0oa/w1RlJYa5///SYGZIKyCoejkbk2i5GIKcSkTSrhUVOHEZkVHjTtNtGCpJvVT9FEv/xhLljJLNKSd7H9RY/j/45Czf1KVJJf8qiiy5THOOf/kkX//gwad//+U8xzthYMllu7iW2Uxxv2JapMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+5JE642C0A7Agw8YcEhheGYwzBgMIbLoJgR30XiHncjEmRmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSZECP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=");

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