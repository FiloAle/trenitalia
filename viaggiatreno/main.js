// Viaggatreno: Namespace declaration
var VT = VT || {};

let supportsOrientation = (typeof window.orientation == 'number' &&
        typeof window.onorientationchange == 'object');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(window.location.search);
    if (results === null) {
        return "";
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

function decorateList(list) {
    list[0].first = true;
    list[list.length - 1].last = true;
}

function formatDate(secondsDate) {
    if (typeof secondsDate == 'undefined' || secondsDate === null) {
        return "";
    }
    return moment(secondsDate).tz("Europe/Rome").format("DD/MM/YYYY");
}

function formatTime(secondsTime) {
    if (typeof secondsTime == 'undefined' || secondsTime === null) {
        return "--:--";
    }
    return moment(secondsTime).tz("Europe/Rome").format("HH:mm");
}

function formatDateTime(secondsTime) {
    if (typeof secondsTime == 'undefined' || secondsTime === null) {
        return "--:--";
    }
    return moment(secondsTime).tz("Europe/Rome").format("DD.MM.YYYY HH:mm");
}

function formatTimeDiff(secondsTimeDiff) {
    if (typeof secondsTimeDiff == 'undefined' || secondsTimeDiff === null) {
        return "--:--";
    }
    let duration = moment.duration(secondsTimeDiff);
    return duration.hours() + ":" + duration.minutes();
}

//I18N Handlers

function setLanguage(language) {
    $.cookie("LANG", language);
    labels = ViaggiaTrenoService.getLabels({idLingua: $.cookie("LANG")});
    window.location.reload();
}

function getProperty(key) {
    if (labels[key] != null) {
        return labels[key].valueOf();
    }
}
;

/**
 * MBP - Mobile boilerplate helper functions
 */

(function (document) {

    window.MBP = window.MBP || {};

    /**
     * Fix for iPhone viewport scale bug
     * http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
     */

    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    MBP.ua = navigator.userAgent;

    MBP.scaleFix = function () {
        if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
            MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', MBP.gestureStart, false);
        }
    };

    MBP.gestureStart = function () {
        MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    };

    /**
     * Normalized hide address bar for iOS & Android
     * (c) Scott Jehl, scottjehl.com
     * MIT License
     */

    // If we split this up into two functions we can reuse
    // this function if we aren't doing full page reloads.

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    MBP.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    MBP.getScrollTop = function () {
        let win = window;
        let doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    MBP.hideUrlBar = function () {
        let win = window;

        // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo(0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1);
        }
    };

    MBP.hideUrlBarOnLoad = function () {
        let win = window;
        let doc = win.document;
        let bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if (!location.hash && win.addEventListener) {

            // scroll to 1
            window.scrollTo(0, 1);
            MBP.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function () {
                if (doc.body) {
                    clearInterval(bodycheck);
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15);

            win.addEventListener('load', function () {
                setTimeout(function () {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if (MBP.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };

    /**
     * Fast Buttons - read wiki below before using
     * https://github.com/h5bp/mobile-boilerplate/wiki/JavaScript-Helper
     */

    MBP.fastButton = function (element, handler, pressedClass) {
        this.handler = handler;
        // styling of .pressed is defined in the project's CSS files
        this.pressedClass = typeof pressedClass === 'undefined' ? 'pressed' : pressedClass;

        if (element.length && element.length > 1) {
            for (let singleElIdx in element) {
                this.addClickEvent(element[singleElIdx]);
            }
        } else {
            this.addClickEvent(element);
        }
    };

    MBP.fastButton.prototype.handleEvent = function (event) {
        event = event || window.event;

        switch (event.type) {
            case 'touchstart':
                this.onTouchStart(event);
                break;
            case 'touchmove':
                this.onTouchMove(event);
                break;
            case 'touchend':
                this.onClick(event);
                break;
            case 'click':
                this.onClick(event);
                break;
        }
    };

    MBP.fastButton.prototype.onTouchStart = function (event) {
        let element = event.target || event.srcElement;
        event.stopPropagation();
        element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;

        element.className += ' ' + this.pressedClass;
    };

    MBP.fastButton.prototype.onTouchMove = function (event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
                Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset(event);
        }
    };

    MBP.fastButton.prototype.onClick = function (event) {
        event = event || window.event;
        let element = event.target || event.srcElement;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.reset(event);
        this.handler.apply(event.currentTarget, [event]);
        if (event.type == 'touchend') {
            MBP.preventGhostClick(this.startX, this.startY);
        }
        let pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.reset = function (event) {
        let element = event.target || event.srcElement;
        rmEvt(element, 'touchend', this, false);
        rmEvt(document.body, 'touchmove', this, false);

        let pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.addClickEvent = function (element) {
        addEvt(element, 'touchstart', this, false);
        addEvt(element, 'click', this, false);
    };

    MBP.preventGhostClick = function (x, y) {
        MBP.coords.push(x, y);
        window.setTimeout(function () {
            MBP.coords.splice(0, 2);
        }, 2500);
    };

    MBP.ghostClickHandler = function (event) {
        if (!MBP.hadTouchEvent && MBP.dodgyAndroid) {
            // This is a bit of fun for Android 2.3...
            // If you change window.location via fastButton, a click event will fire
            // on the new page, as if the events are continuing from the previous page.
            // We pick that event up here, but MBP.coords is empty, because it's a new page,
            // so we don't prevent it. Here's we're assuming that click events on touch devices
            // that occur without a preceding touchStart are to be ignored.
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        for (let i = 0, len = MBP.coords.length; i < len; i += 2) {
            let x = MBP.coords[i];
            let y = MBP.coords[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    // This bug only affects touch Android 2.3 devices, but a simple ontouchstart test creates a false positive on
    // some Blackberry devices. https://github.com/Modernizr/Modernizr/issues/372
    // The browser sniffing is to avoid the Blackberry case. Bah
    MBP.dodgyAndroid = ('ontouchstart' in window) && (navigator.userAgent.indexOf('Android 2.3') != -1);

    if (document.addEventListener) {
        document.addEventListener('click', MBP.ghostClickHandler, true);
    }

    addEvt(document.documentElement, 'touchstart', function () {
        MBP.hadTouchEvent = true;
    }, false);

    MBP.coords = [];

    // fn arg can be an object or a function, thanks to handleEvent
    // read more about the explanation at: http://www.thecssninja.com/javascript/handleevent
    function addEvt(el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.addEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function (e) {
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function () {
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }
    }

    function rmEvt(el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch (e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function (e) {
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn, e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.detachEvent("on" + evt, function () {
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }
    }

    /**
     * Autogrow
     * http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
     */

    MBP.autogrow = function (element, lh) {
        function handler(e) {
            let newHeight = this.scrollHeight;
            let currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }

        let setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;

        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);

        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('input', handler, false) : element.attachEvent('onpropertychange', handler);
    };

    /**
     * Enable CSS active pseudo styles in Mobile Safari
     * http://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
     */

    MBP.enableActive = function () {
        document.addEventListener('touchstart', function () {
        }, false);
    };

    /**
     * Prevent default scrolling on document window
     */

    MBP.preventScrolling = function () {
        document.addEventListener('touchmove', function (e) {
            if (e.target.type === 'range') {
                return;
            }
            e.preventDefault();
        }, false);
    };

    /**
     * Prevent iOS from zooming onfocus
     * https://github.com/h5bp/mobile-boilerplate/pull/108
     * Adapted from original jQuery code here: http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
     */

    MBP.preventZoom = function () {
        let formFields = document.querySelectorAll('input, select, textarea');
        let contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        let i = 0;

        for (i = 0; i < formFields.length; i++) {
            formFields[i].onfocus = function () {
                MBP.viewportmeta.content = contentString + '1';
            };
            formFields[i].onblur = function () {
                MBP.viewportmeta.content = contentString + '10';
            };
        }
    };

    /**
     * iOS Startup Image helper
     */

    MBP.startupImage = function () {
        let portrait;
        let landscape;
        let pixelRatio;
        let head;
        let link1;
        let link2;

        pixelRatio = window.devicePixelRatio;
        head = document.getElementsByTagName('head')[0];

        if (navigator.platform === 'iPad') {
            portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
            landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';

            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('media', 'screen and (orientation: portrait)');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);

            link2 = document.createElement('link');
            link2.setAttribute('rel', 'apple-touch-startup-image');
            link2.setAttribute('media', 'screen and (orientation: landscape)');
            link2.setAttribute('href', landscape);
            head.appendChild(link2);
        } else {
            portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
            portrait = screen.height === 568 ? "img/startup/startup-retina-4in.png" : portrait;
            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);
        }

        //hack to fix letterboxed full screen web apps on 4" iPhone / iPod
        if ((navigator.platform === 'iPhone' || 'iPod') && (screen.height === 568)) {
            if (MBP.viewportmeta) {
                MBP.viewportmeta.content = MBP.viewportmeta.content
                        .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
                        .replace(/\bwidth\s*=\s*device-width\b/, '');
            }
        }
    };

})(document);

//HandleBars Helpers

Handlebars.registerHelper('date', function (date) {
    return formatDate(date);
});

Handlebars.registerHelper('time', function (time) {
    return formatTime(time);
});

Handlebars.registerHelper('datetime', function (date) {
    return formatDate(date) + " " + formatTime(date);
});

Handlebars.registerHelper('diff', function (date) {
    return formatTimeDiff(date);
});

Handlebars.registerHelper('I18N', function (label) {
    return new Handlebars.SafeString(getProperty(label));
});

Handlebars.registerHelper('smartI18N', function (label) {
    let propertyTemplate = getProperty(label);
    let compiledTemplate = Handlebars.compile(propertyTemplate);
    return compiledTemplate(this);
});

Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
    let decoded_operator = $('<div/>').html(operator).text();
    switch (decoded_operator) {
        case "==":
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case "!=":
            return (v1 != v2) ? options.fn(this) : options.inverse(this);

        case "===":
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case "!==":
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case "&&":
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case "||":
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case "<":
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case "<=":
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case ">":
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case ">=":
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return eval("" + v1 + operator + v2) ? options.fn(this) : options
                    .inverse(this);
    }
});

Handlebars.registerPartial("stampatreno", $("#stampatreno-partial").html());
Handlebars.registerPartial("legenda", $("#legenda-partial").html());

function appendRenderedTemplate(selector, templateName) {
    template = $("#" + templateName + "-template").html();
    let compiledTemplate = Handlebars.compile(template);
    let renderedTemplate = compiledTemplate(null);
    let recompiledTemplate = Handlebars.compile(renderedTemplate);
    $(selector).append(recompiledTemplate(null));
}

let app;
jQuery(document).ready(function () {
    appendRenderedTemplate("#alert-message3", "tabs-alert3");
    appendRenderedTemplate("#alert-message4", "tabs-alert4");
    appendRenderedTemplate("#bottone-cerca", "train-search-label");
    appendRenderedTemplate("#bottone-acquista", "link-compra");
   // appendRenderedTemplate("#bottone-meteo", "meteo-label");
    appendRenderedTemplate("#bottone-modprog", "modprog-label");
    appendRenderedTemplate("#bottone-news", "news-label");
    appendRenderedTemplate("#bottone-come", "howto-label");
    appendRenderedTemplate("#bottone-legale", "legal-notes-label");
    appendRenderedTemplate("#bottone-contatti", "contacts-label");
    appendRenderedTemplate("#bottone-stampatreno", "printtrain-label");
    appendRenderedTemplate("#form-cercatreno", "train-search-placeholder");
    appendRenderedTemplate("#form-impostaviaggio", "timetable-labels");
    appendRenderedTemplate("#form-stampatreno", "printtrain-labels");
    appendRenderedTemplate("#news-title", "news-label");
    appendRenderedTemplate("#box-title", "filtri-label-title");
    appendRenderedTemplate("#box-title-infomob", "infomob-label-title");
    appendRenderedTemplate("#box-filtri-tipo", "traffic-label");
    appendRenderedTemplate("#box-news-infomob", "news-infomob");
    appendRenderedTemplate("#filtri-nazionale", "all-traffic-label");
    appendRenderedTemplate("#filtri-regionale", "region-choice");
    appendRenderedTemplate("#infomob", "infomob-tab-label");
    appendRenderedTemplate("#modprog", "modprog-tab-label");
    appendRenderedTemplate("#ultime-news", "latest-news-label");
    appendRenderedTemplate("#ultimo-aggiornamento-title", "latest-update");
    appendRenderedTemplate("#link-siti", "link-siti");
    appendRenderedTemplate("#link-lavora", "link-lavora");
    appendRenderedTemplate("#link-fsnews", "link-fsnews");
    appendRenderedTemplate("#link-compra", "link-compra");
    appendRenderedTemplate("#link-social", "link-social");
    appendRenderedTemplate("#infomobility-popup", "infomobility-popup");
    appendRenderedTemplate("#smartcaring-popup", "smartcaring-popup");
    appendRenderedTemplate("#crossbar-siti-chiudi", "link-chiudi");
    appendRenderedTemplate("#crossbar-social-chiudi", "link-chiudi");
    //###################################### SiteCatalyst #############################################
    sc_send('Home Page', null, null, null, null);
    //#################################################################################################
    app = new VT.App();
});
