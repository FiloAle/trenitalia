let regioniData = {
    'italia': {
        name: 'Italia',
        lat: 42.06619209048351, lng: 15.45891389062501,
        sudOvestX: 35, sudOvestY: 0,
        nordEstX: 49, nordEstY: 25,
        zoom: 6, id: 0, rid:'ITA'},
    'abruzzo': {
		name: 'Abruzzo',
        lat: 42.29137088773165, lng: 14.200760499999933,
        sudOvestX: 41, sudOvestY: 13,
        nordEstX: 43, nordEstY: 16,
        zoom: 9, id: 19, rid:'R13'},
    'basilicata': {
        name: 'Basilicata',
        lat: 40.52026720669612, lng: 16.500941000000034,
        sudOvestX: 39, sudOvestY: 15,
        nordEstX: 42, nordEstY: 18,
        zoom: 9, id: 15, rid:'R17'},
    'calabria': {
        name: 'Calabria',
        lat: 39.038763890987134, lng: 16.71830249999998,
        sudOvestX: 37, sudOvestY: 14,
        nordEstX: 41, nordEstY: 19,
        zoom: 8, id: 17, rid:'R18'},
    'campania': {
        name: 'Campania',
        lat: 40.75330374321114, lng: 15.484288999999944,
        sudOvestX: 39, sudOvestY: 13,
        nordEstX: 43, nordEstY: 18,
        zoom: 8, id: 18, rid:'R15'},
    'emiliaromagna': {
        name: 'Emilia Romagna',
        lat: 44.444089101143035, lng: 11.56854000000003,
        sudOvestX: 43, sudOvestY: 8,
        nordEstX: 46, nordEstY: 14,
        zoom: 8, id: 8, rid:'R8'},
    'friuliveneziagiulia': {
        name: 'Friuli Venezia Giulia',
        lat: 46.17696043186662, lng: 13.419900500000085,
        sudOvestX: 45, sudOvestY: 12,
        nordEstX: 47, nordEstY: 15,
        zoom: 9, id: 10, rid:'R6'},
    'lazio': {
        name: 'Lazio',
        lat: 42.02660371475481, lng: 13.438520999999992,
        sudOvestX: 40, sudOvestY: 11,
        nordEstX: 44, nordEstY: 16,
        zoom: 8, id: 5, rid:'R12'},
    'liguria': {
        name: 'Liguria',
        lat: 44.38914500777133, lng: 9.70505005664072,
        sudOvestX: 42, sudOvestY: 6,
        nordEstX: 46, nordEstY: 12,
        zoom: 8, id: 2, rid:'R7'},
    'lombardia': {
        name: 'Lombardia',
        lat: 45.50611228217904, lng: 10.53302049999997,
        sudOvestX: 43, sudOvestY: 8,
        nordEstX: 47, nordEstY: 13,
        zoom: 8, id: 1, rid:'R3'},
    'marche': {
        name: 'Marche',
        lat: 43.33124123550758, lng: 13.40645249999991,
        sudOvestX: 41.98406546928224, sudOvestY: 10.77235826171866,
        nordEstX: 44.64918446555423, nordEstY: 15.04054673828116,
        zoom: 9, id: 11, rid:'R11'},
    'molise' : {
        name: 'Molise',
        lat: 41.7178775769156, lng: 14.847833999999966,
        sudOvestX: 41, sudOvestY: 13,
        nordEstX: 43, nordEstY: 16,
        zoom: 9, id: 7, rid:'R14'},
    'piemonte': {
        name: 'Piemonte',
        lat: 45.278072490639486, lng: 8.556153066406153,
        sudOvestX: 43, sudOvestY: 6,
        nordEstX: 47, nordEstY: 11,
        zoom: 8, id: 3, logoViaggiaRegione:true, rid:'R1'},
    'puglia': {
        name: 'Puglia',
        lat: 41.0801484896612, lng: 17.127251000000024,
        sudOvestX: 38.5, sudOvestY: 14.5,
        nordEstX: 43.5, nordEstY: 19.5,
        zoom: 8, id: 16, rid:'R16'},
    'sardegna': {
        name: 'Sardegna',
        lat: 40.122380591002755, lng: 9.580467500000032,
        sudOvestX: 38, sudOvestY: 7,
        nordEstX: 42, nordEstY: 12,
        zoom: 8, id: 20, rid:'R20'},
    'sicilia': {
        name: 'Sicilia',
        lat: 37.5774732751497, lng: 14.689988499999936,
        sudOvestX: 36, sudOvestY: 11,
        nordEstX: 39, nordEstY: 17,
        zoom: 8, id: 14, rid:'R19'},
    'toscana': {
        name: 'Toscana',
        lat: 43.47683463545917, lng: 11.629036500000075,
        sudOvestX: 42, sudOvestY: 8,
        nordEstX: 45, nordEstY: 14,
        zoom: 8, id: 13, rid:'R9'},
    'prov_di_trento': { name: 'Prov. di Trento',
        lat: 46.128865488595946, lng: 11.76929566210947,
        sudOvestX: 45, sudOvestY: 9,
        nordEstX: 48, nordEstY: 14,
        zoom: 8, id: 21, rid:'P22'},
    'prov_di_bolzano': { name: 'Prov. di Bolzano',
        lat: 46.578865488595946, lng: 12.00929566210947,
        sudOvestX: 45, sudOvestY: 9,
        nordEstX: 48, nordEstY: 14,
        zoom: 8, id: 22, rid:'P21'},
    'umbria': {
        name: 'Umbria',
        lat: 42.994101278102235, lng: 12.878042000000096,
        sudOvestX: 41.63956528369832, sudOvestY: 10.143947761718846,
        nordEstX: 44.319426909896734, nordEstY: 14.312136238281346,
        zoom: 9, id: 6, rid:'R10'},
    'valledaosta': {
        name: "Valle d'Aosta",
        lat: 45.72798499738841, lng: 7.720367999999985,
        sudOvestX: 45, sudOvestY: 6,
        nordEstX: 47, nordEstY: 9,
        zoom: 9, id: 4, rid:'R2'},
    'veneto': {
        name: 'Veneto',
        lat: 45.74542421068089, lng: 12.462949999999955,
        sudOvestX: 44, sudOvestY: 10,
        nordEstX: 47, nordEstY: 15,
        zoom: 8, id: 12, rid:'R5'}
};

function updateItalyCoords() {
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPad/i)) {
        let landscape = (window.innerWidth > window.innerHeight);
        if (landscape) {
            regioniData.italia.lat = 42.18619209048351;
            regioniData.italia.lng = 15.25891389062501;
            regioniData.italia.sudOvestX = 35;
            regioniData.italia.sudOvestY = 0;
            regioniData.italia.nordEstX = 49;
            regioniData.italia.nordEstY = 25;
            $('#box-notizie:not(.attivo) h2').trigger('click');
            $("html").removeClass('portrait');
        } else {
            regioniData.italia.lat = 41;
            regioniData.italia.lng = 13.3;
            regioniData.italia.sudOvestX = 35;
            regioniData.italia.sudOvestY = 0;
            regioniData.italia.nordEstX = 49;
            regioniData.italia.nordEstY = 25;
            window.setTimeout(function(){
                $('#box-notizie.attivo h2').trigger('click');
            }, 1000);
            $("html").addClass('portrait');
        }
    }
}


let iconSize = new L.Point(22, 22);
let iconAnchor = new L.Point(11, 11);

let markerUrls = {
    1: '/vt_static/img/legenda/stazioni/pp_st_1.png',
    2: '/vt_static/img/legenda/stazioni/pp_st_2.png',
    3: '/vt_static/img/legenda/stazioni/pp_st_3.png',
    4: '/vt_static/img/legenda/stazioni/pp_st_4.png'
};

let meteoSize = new L.Point(30, 30);
let meteoAnchor = new L.Point(15, 15);

let meteoIcons = {
    0: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/0.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    1: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/1.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    2: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/2.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    3: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/3.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    4: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/4.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    5: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/5.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    6: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/6.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    7: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/7.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    8: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/8.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    9: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/9.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    10: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/10.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    11: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/11.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    12: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/12.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    13: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/13.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    14: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/14.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    15: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/15.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
	16: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/16.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
	17: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/17.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
	18: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/18.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    
	101: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/101.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    102: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/102.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    103: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/103.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    104: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/104.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    105: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/105.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    106: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/106.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
	107: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/107.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    108: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/108.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    109: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/109.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    110: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/110.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    111: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/111.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    112: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/112.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
	113: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/113.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    114: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/114.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    115: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/115.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    116: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/116.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    117: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/117.png', iconSize: meteoSize, iconAnchor: meteoAnchor}),
    118: new L.icon({ iconUrl: '/vt_static/img/legenda/meteo/118.png', iconSize: meteoSize, iconAnchor: meteoAnchor})
};

let filtroTreni = {
    "tuttoNazionale": [["ES*", "IC", "EXP", "EC", "EN"], null],
    "frecciaRossa"  : [["ES*"], ["100"]],
    "frecciaArgento": [["ES*"], ["101"]],
    "frecciaBianca" : [["ES*"], ["102"]],
    "tuttoRegionale": [["ES*", "IC", "EXP", "EC", "EN", "REG", "MET"], null],
    "regionale"     : [["REG", "MET"], null]
};

function markerClickListener(e) {
    app.apriDettaglioStazione(this.codiceStazione);
}

//chiamata da link dentro infomobilita'
function getStazione(codStazione,descStazione){
	app.apriDettaglioStazione(codStazione);
	$('#info-mobilita').fadeOut();
}
////////////////////////////////////////

function listenerTratta(e) {
    app.apriDettaglioTratta({
        idRegione: this.idRegione,
        idTrattaAB: this.idTrattaAB,
        idTrattaBA: this.idTrattaBA
    });
}

//chiamata da link dentro infomobilita'
function getTrattaTreno(codRegione,codTrattaAB,codTrattaBA){
	 app.apriDettaglioTrattaInfoMob({
	        idRegione: codRegione,
	        idTrattaAB: codTrattaAB,
	        idTrattaBA: codTrattaBA
	    });
	 $('#info-mobilita').fadeOut();
}

//////////////////////////////////////////////////

VT.Map = function(app) {
    let that = this;

    updateItalyCoords();

    this.map = L.map('map', {
        attributionControl: false,
        keyboard: false,
        minZoom: 6,
        zoomControl: false
    });

    this.backgroundLayer = L.tileLayer('/vt_static/tiles/background/{z}/{x}/{y}.png', {
        attribution: '',
        bounds: new L.LatLngBounds([[33, 3], [49, 24]])
    }).addTo(this.map);

    this.regioniLayer = L.tileLayer('/vt_static/tiles/regioni/{z}/{x}/{y}.png', {
        attribution: '',
        bounds: new L.LatLngBounds([[33, 3], [49, 24]])
    });
    this.regioniLayer.addTo(this.map);

    this.bolzanoLayer = L.tileLayer('/vt_static/tiles/bolzano/{z}/{x}/{y}.png', {
        attribution: '',
        bounds: new L.LatLngBounds([[46.141, 10], [47.174, 12.6263]])
    });

    this.trentoLayer = L.tileLayer('/vt_static/tiles/trento/{z}/{x}/{y}.png', {
        attribution: '',
        bounds: new L.LatLngBounds([[45.6901, 10.061], [46.7843, 12.3022]])
    });

    this.caricamenti = 0;

    this.mostraLoader();
    this.map.on('load', function(e) {
        that.nascondiLoader();
    });

    this.datiMeteo = null;
    this.filtroTreniCorrente = [filtroTreni["tuttoNazionale"]];

    this.previousZoomLevel = 6;
    this.previousCenter = null;

    this.tratte = [];
    this.stazioni = [];

    this.mapMode = "stations";
    this.loadRegione('italia');

    this.map.on('zoomend', function(e){
        if (that.previousZoomLevel != that.map.getZoom()) {
            that.previousZoomLevel = that.map.getZoom();
            that.loadTratte();
            that.updateStations();
        }
    });

    this.map.on('dragstart', function(e) {
        if ($.browser.msie) {
            $('.leaflet-container').css({'cursor': 'url(/vt_static/img/mappa/closedhand.cur), move'});
        }
        that.previousCenter = this.getCenter();
    });

    this.map.on('dragend', function(e) {
        if ($.browser.msie) {
            $('.leaflet-container').css({'cursor': 'default'});
        }
        that.previousCenter = this.getCenter();
    });

    this.map.on('popupclose', function(e) {
        if (that.previousCenter !== null) {
            that.map.panTo(that.previousCenter);
        }
    });

    $(window).on('orientationchange', function(event) {
        window.setTimeout(function() {
            updateItalyCoords();
        }, 3000);

        window.setTimeout(function() {
            that.map.invalidateSize(false);
            for (let nomeRegione in regioniData) {
                if (regioniData[nomeRegione].id == that.regioneAttuale.id) {
                    that.loadRegione(nomeRegione);
                }
            }
        }, 6000);

        window.setTimeout(function() {
            that.map.invalidateSize(false);
        }, 8000);
    });
	
	window.setInterval(function() {
		that.loadTratte();                
	}, 900000);
};

VT.Map.prototype.mostraLoader = function() {
    this.caricamenti++;
    $('#loader-mappa').stop().fadeIn(200);
};

VT.Map.prototype.nascondiLoader = function() {
    this.caricamenti--;
    if (this.caricamenti <= 0) {
        this.caricamenti = 0;
        $('#loader-mappa').stop().fadeOut(200);
    }
};

VT.Map.prototype.resetZoom = function (force) {
    this.map.setView([this.regioneAttuale.lat, this.regioneAttuale.lng], this.regioneAttuale.zoom, force);
};

VT.Map.prototype.zoomIn = function () {
    this.map.zoomIn();
};

VT.Map.prototype.zoomOut = function () {
    this.map.zoomOut();
};

VT.Map.prototype.loadRegione = function(nomeRegione) {
    let map = this.map;

    let regione = regioniData[nomeRegione];
    this.regioneAttuale = regione;

	//###################################### SiteCatalyst #############################################
	if(regione.id != regioniData.italia.id) sc_send('Traffico Regionale - '+nomeRegione, null, null, null, null);
	if(regione.id != regioniData.italia.id && $('#bottone-meteo').hasClass('on')) {
		sc_send('Meteo '+nomeRegione,null,null);
	}
	//#################################################################################################
	
	map.options.minZoom = regione.zoom;	
	
    let center = new L.LatLng(regione.lat, regione.lng);
    this.previousCenter = center;

    map.setMaxBounds(null);
    map.setView(center, regione.zoom);
    window.setTimeout(function() {
        let sudOvest = new L.LatLng(regione.sudOvestX, regione.sudOvestY);
        let nordEst = new L.LatLng(regione.nordEstX, regione.nordEstY);
        let maxBounds = new L.LatLngBounds(sudOvest, nordEst);
        map.setMaxBounds(maxBounds);
    }, 2000);

    if (regione.id == regioniData.italia.id) {
        map.options.maxZoom = 9;
    } else {
        map.options.maxZoom = regione.zoom + 2;
    }

    if (regione.id == regioniData.piemonte.id) {
        $('#logo_viaggiapiemonte').show();
    } else {
        $('#logo_viaggiapiemonte').hide();
    }
    
    if (regione.id == regioniData.emiliaromagna.id) {
        $('#logo_emiliaromagna').show();
    } else {
        $('#logo_emiliaromagna').hide();
    }

    if (regione.id == regioniData.prov_di_trento.id || regione.id == regioniData.prov_di_bolzano.id) {
        if (regione.id == regioniData.prov_di_trento.id) {
            this.trentoLayer.addTo(map);
            map.removeLayer(this.bolzanoLayer);
        } else {
            this.bolzanoLayer.addTo(map);
            map.removeLayer(this.trentoLayer);
        }
    } else {
        map.removeLayer(this.trentoLayer);
        map.removeLayer(this.bolzanoLayer);
    }

	this.loadStazioni();
    this.loadTratte();    
};

VT.Map.prototype.loadTratte = function() {
    this.mostraLoader();
    for (let k = 0; k < this.tratte.length; k++) {
        this.map.removeLayer(this.tratte[k]);
        this.map.removeLayer(this.tratteVisibili[k]);
    }

    this.tratteVisibili = [];
    this.tratte = [];

    let categoriaTreni = "";
    let catAV = "";
    for (let j = 0; j < this.filtroTreniCorrente.length; j++) {
        filtro = this.filtroTreniCorrente[j];
        categoriaTreni = categoriaTreni + (j > 0 ? "," : "") + filtro[0];
        catAV = catAV + (j > 0 ? "," : "") + filtro[1];
    }

    let webTrattaList = ViaggiaTrenoService.getElencoTratte({
        idRegione: this.regioneAttuale.id,
        zoomlevel: Math.floor(this.map.getZoom()),
        categoriaTreni: categoriaTreni,
        catAV: catAV,
        timestamp: (new Date()).getTime()
    });

    if (typeof webTrattaList !== "undefined") {
        for (let i=0; i < webTrattaList.length; i++) {
            let webTratta = webTrattaList[i];

            let path = [new L.LatLng(webTratta.latitudineA, webTratta.longitudineA),
                        new L.LatLng(webTratta.latitudineB, webTratta.longitudineB)];

            let trattaColore = new L.Polyline(path, {
                color: webTratta.occupata ? "#0000FF" : "#555555",
                clickable: false,
                opacity: 1.0,
                weight: 3
            });

            let polyTratta = new L.Polyline(path, {
                color: "#FFFFFF",
                opacity: 0.01,
                weight: 9
            });

            polyTratta.idRegione = this.regioneAttuale.id;
            polyTratta.idTrattaAB = webTratta.trattaAB;
            polyTratta.idTrattaBA = webTratta.trattaBA;

            polyTratta.on('click', listenerTratta);

            trattaColore.addTo(this.map);
            polyTratta.addTo(this.map);

            this.tratteVisibili.push(trattaColore);
            this.tratte.push(polyTratta);
        }
    } else {
        // FIXME: messaggio di errore
        //alert(labels.dati_non_caricabili);
    }
    $(".legenda a").css('left', '20px');
    this.nascondiLoader();
};

VT.Map.prototype.loadStazioni = function() {
    
    this.mostraLoader();
    this.clearMarkers();

    this.stazioni = [];

    let webStazioneList = ViaggiaTrenoService.getElencoStazioni({
        codRegione: this.regioneAttuale.id
    });

    if (this.mapMode == "meteo") {
        this.reloadMeteo(this.regioneAttuale.id);
    }

    for (let i=0; i < webStazioneList.length; i++) {
        this.createMarker(webStazioneList[i]);
    }

    this.updateStations();
    this.nascondiLoader();
};

VT.Map.prototype.reloadMeteo = function() {
    this.mostraLoader();
    this.datiMeteo = ViaggiaTrenoService.getDatiMeteo({
        codiceRegione: this.regioneAttuale.id
    });
    this.nascondiLoader();
};

VT.Map.prototype.clearMarkers = function() {
    for (let i=0; this.stazioni && i < this.stazioni.length; i++) {
        this.map.removeLayer(this.stazioni[i]);
    }
};

VT.Map.prototype.updateStations = function() {
    this.clearMarkers();
    for (let i=0; i < this.stazioni.length; i++) {
        let marker = this.stazioni[i];
        if (marker.zoomStartRange <= this.map.getZoom() && marker.zoomStopRange >= this.map.getZoom()) {
            marker.addTo(this.map);
            marker.showLabel();
        }
    }
};

VT.Map.prototype.createMarker = function(webStazione) {
    dettagliZoom = webStazione.dettZoomStaz;

    let labelAnchor = new L.point(-12 - webStazione.offsetX, 15 - webStazione.offsetY);

    for (let j = 0; j < dettagliZoom.length; j++) {
        if (dettagliZoom[j].pinpointVisibile) {
            var icon;
            let zIndex = 1;
            if (this.mapMode == 'meteo' && this.datiMeteo && this.datiMeteo[webStazione.codiceStazione]) {
                icon = meteoIcons[this.datiMeteo[webStazione.codiceStazione].oggiTempo];
            } else {
                icon = new L.icon({
                    iconAnchor: iconAnchor,
                    iconSize: iconSize,
                    iconUrl: markerUrls[webStazione.tipoStazione],
                    labelAnchor: labelAnchor});
            }

            if (icon) {
                let marker = L.marker([webStazione.lat, webStazione.lon], {
                    icon: icon
                });

                if (dettagliZoom[j].labelVisibile) {
                    marker.bindLabel(webStazione.nomeCitta, { noHide: true, className: 'labels' });
                }

                marker.codiceStazione = webStazione.codiceStazione;
                marker.codRegione = webStazione.codReg;
                marker.zoomStartRange = dettagliZoom[j].zoomStartRange;
                marker.zoomStopRange = dettagliZoom[j].zoomStopRange;

                if (this.mapMode == 'meteo' && this.datiMeteo && this.datiMeteo[webStazione.codiceStazione]) {
                    this.fumettoMeteo(webStazione, marker);
                }
                if (this.mapMode == 'stations') {
                    marker.on('click', markerClickListener);
                }

                this.stazioni.push(marker);
            }
        }
    }
};

VT.Map.prototype.fumettoMeteo = function(stazione, marker) {
    let keepInView = false;
	 if (ie === 11) { //altri browser = 0 , IE torna la versione
		keepInView = true;
	 }
	 
    template = app.getTemplate("fumetto-meteo");
    contentString = template({
        meteo: this.datiMeteo[stazione.codiceStazione],
        stazione: stazione
    }),
    marker.bindPopup(contentString, {
        maxHeight: 366,
        offset: new L.point(0, -6),
        autoPanPadding: new L.Point(260, 100),
		keepInView: keepInView
	
    });
};
