"use strict";

var mpf = mpf || $({});

// Retrieve the query string of the src
$('script[src*="mpf.jquery"]').each(function (index, item) {
    mpf.restUrl = '/rest/';
    mpf.options = {};

    mpf.options = $.parseQuerystring(item.src);
    if (mpf.options.hasOwnProperty('restUrl')) {
        mpf.restUrl = mpf.options.restUrl;
    }
});

(function () {
    var mpfTexts = {},
        mpfTextAjax = {},
        mpfTemplates = {},
        mpfTemplateAjax = {},
        mpfResourcesVersion = "0.1.1",
        mpfResourcesInfo = null,
        mpfProofOfWorkIntervals = {};

    mpf.globalEvents = [];
    mpf.overlayLoaderOpts = {
        lines: 17, // The number of lines to draw
        length: 50, // The length of each line
        width: 15, // The line thickness
        radius: 25, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#FFF', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 31, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '-40px', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };

    /**
     * Returns what $.ajax() returns to be able to abort at any time
     *
     * @param {String} url
     * @param {String} querystring
     * @param {String} method
     * @param {Function} callback
     * @returns {@exp;$@pro;ajax@call;@call;always|@exp;@exp;$@pro;ajax@call;@call;always}
     */
    mpf.ajax = function ajax() {
        var args = Array.prototype.slice.call(arguments),
            callback = args.pop(),
            url = args.shift(),
            querystring = (args.length === 0 ? '' : args.shift()),
            method = (args.length === 0 ? 'POST' : args.shift()),
            dataType = 'jsonp';

        if (typeof callback !== 'function') {
            throw new Error('A callback must be provided for all ajax calls');
        }

        querystring = (!querystring ? 'PWD='+encodeURIComponent(document.location.href) : querystring+'&PWD='+encodeURIComponent(document.location.href));

        // if we are retrieving a static package.json files we change the datatype
        if (url.match(/mpfResourcesInfo/)) {
            dataType = 'json';
        }

        return $.ajax({
            type: method,
            url: url,
            dataType: dataType,
            data: querystring
        }).always(function (response) {
            if (response.hasOwnProperty('responseText')) {
                if (response.readyState !== 0) {
                    var errors = null;
                    try {
                        errors = JSON.parse(response.responseText.replace(/^jQuery[0-9_\.]+\((.*)\)[;|]$/, "$1"));
                        if (errors.hasOwnProperty('errors')) {
                            errors = errors.errors;
                        }
                    } catch (e) {}
                    callback(errors, null);
                }

                return;
            }

            if (!response) {
                callback('Unexpected error', response);
            }

            if (!response.hasOwnProperty('errors')) {
                callback(null, response);
            } else if (response.hasOwnProperty('errors')) {
                callback(response.errors, response);
            } else {
                callback('Unexpected error', response);
            }
        });
    };

    /**
     *
     * @param {string} url
     * @param {Function} callback
     * @returns {@exp;mpf@call;ajax}
     */
    mpf.ajaxGet = function ajaxGet(url, callback) {
        return mpf.ajax(url, null, 'GET', callback);
    };

    /**
     *
     * @param {Function} callback
     * @returns {null}
     */
    function loadMpfResourcesInfo(callback) {
        if (mpfResourcesInfo === null) {
            var storageIndex = 'mpfResourcesInfo:v'+ mpfResourcesVersion;
            if (localStorage && localStorage.hasOwnProperty(storageIndex)) {
                mpfResourcesInfo = JSON.parse(localStorage[ storageIndex ]);
                if (typeof callback === 'function') {
                    callback(mpfResourcesInfo);
                }
                return;
            }

            mpf.ajaxGet('/mpf-admin/media/js/mpfResourcesInfo.json', function (errors, result) {
                var i = '';
                if (errors) {
                    throw new Error(errors[0].msg);
                }

                if (localStorage) {
                    localStorage[ storageIndex ] = JSON.stringify(result);
                }

                // Remove previous versions of the resources' info
                for (i in localStorage) {
                    if (localStorage.hasOwnProperty(i) && /^mpfResourcesInfo/.test(i)) {
                        localStorage.removeItem(i);
                    }
                }
                mpfResourcesInfo = result;

                if (typeof callback === 'function') {
                    callback(mpfResourcesInfo);
                }
            });
            return;
        }

        if (typeof callback === 'function') {
            callback(mpfResourcesInfo);
        }

        return;
    }

    /**
     *
     * @param {String} id
     * @param {Function} callback
     * @returns {null}
     */
    mpf.loadResources = function loadResources(id, callback) {
        loadMpfResourcesInfo(function (mpfResourcesInfo) {
            var dir = '';
            if (!mpfResourcesInfo.hasOwnProperty(id)) {
                throw new Error('Could not find any package information for "'+ id +'", make sure its in the /media/js/mpfResourcesInfo.json and that you have flushed localstorage for the key "mpfResourcesInfo".');
            }

            if (mpfResourcesInfo[id].hasOwnProperty('dir')) {
                dir = mpfResourcesInfo[id].dir +'/';
            }

            // load template first if any
            if (mpfResourcesInfo[id].resources.indexOf('html') !== -1) {
                $(mpf.template(dir + id, function () {
                    // load text second if any
                    if (mpfResourcesInfo[id].resources.indexOf('text') !== -1) {
                        mpf.text(dir + id);
                    }

                    // load css third if any
                    if (mpfResourcesInfo[id].resources.indexOf('css') !== -1) {
                        $('<link rel="stylesheet" type="text/css" href="/mpf-admin/media/'+ mpfResourcesInfo[id].version +'/css/'+ dir + id +'.css" />').appendTo('head');
                    }

                    // load js last if any
                    if (mpfResourcesInfo[id].resources.indexOf('js') !== -1) {
                        $.getScript('/mpf-admin/media/'+ mpfResourcesInfo[id].version +'/js/'+ dir + id +'.js', function () {
                            if (typeof callback === 'function') {
                                callback();
                            }
                        });
                        return;
                    }

                    if (typeof callback === 'function') {
                        callback();
                    }
                })).appendTo('body');
            }
        });
    };

    /**
     *
     * @returns {String}
     */
    mpf.locale = function locale() {
        if ($.cookie('mpf_locale')) {
            return $.cookie('mpf_locale');
        }

        return 'en_CA';
    };

    /**
     * Everytime markup is dynamicly added to the document this function should be called
     * @returns {void}
     */
    mpf.reloadGlobalEvents = function reloadGlobalEvents() {
        // Unload the binds
        for (var i in mpf.globalEvents) {
            if (mpf.globalEvents.hasOwnProperty(i)) {
                mpf.globalEvents[i].unload();
            }
        }

        // reload the binds
        for (var i in mpf.globalEvents) {
            if (mpf.globalEvents.hasOwnProperty(i)) {
                mpf.globalEvents[i].load();
            }
        }
    }

    /**
     *
     * @param {String} filename
     * @param {String} version
     * @param {Function} callback
     * @returns {String}
     */
    mpf.template = function template() {
        var args = Array.prototype.slice.call(arguments),
            filename = args.shift(),
            callback = args.pop(),
            version = mpfResourcesVersion;

        if (args.length !== 0) {
            version = args.shift();
        }

        filename = filename.replace('/', '::');

        if (mpfTemplates.hasOwnProperty(filename)) {
            if (typeof callback === 'function') {
                setTimeout(function () { callback(); }, 50);
            }

            return mpfTemplates[ filename ];
        }

        var localStorageIndex = 'mpfTemplates/'+ filename;
        if (localStorage && localStorage.hasOwnProperty(localStorageIndex +'/v'+ version)) {
            mpfTemplates[ filename ] = JSON.parse(localStorage[ localStorageIndex +'/v'+ version ]);
            if (typeof callback === 'function') {
                setTimeout(function () { callback(); }, 50);
            }
            return mpfTemplates[ filename ];
        }

        if (!mpfTemplateAjax.hasOwnProperty(filename)) {
            mpfTemplateAjax[filename] = mpf.ajaxGet(mpf.restUrl+'template/'+ filename, function (errors, response) {
                var i = '';
                if (errors) {
                    throw new Error(errors[0].msg);
                }

                // Remove previous versions of the filename
                for (i in localStorage) {
                    if (localStorage.hasOwnProperty(i)) {
                        var fileRegex = new RegExp(localStorageIndex, "g");
                        if (fileRegex.test(i)) {
                            localStorage.removeItem(i);
                        }
                    }
                }

                mpfTemplates[ filename ] = response;
                mpf.trigger('template/'+ filename +'/loaded');

                if (localStorage) {
                    localStorage[ localStorageIndex+'/v'+version ] = JSON.stringify(response);
                }
                delete mpfTemplateAjax[filename];
            });

            mpf.bind('template/'+ filename +'/loaded', function loadTemplate(event) {
                $('[ data-mpf-template*="'+ filename +'"]').each(function (index, element) {
                    var $element = $(element);
                    $element.replaceWith(mpfTemplates[$element.attr('data-mpf-template')]);

                    if (typeof callback === 'function') {
                        callback();
                    }
                });

                mpf.unbind('template/'+ filename +'/loaded');
            });
        }

        return '<span data-mpf-template="'+ filename +'">&nbsp;</span>';
    };

    /**
     *
     * @param {type} filename
     * @param {type} id
     * @param {type} replacements
     * @param {type} version
     * @returns {String}
     */
    mpf.text = function text() {
        var args = Array.prototype.slice.call(arguments),
            filename = args.shift(),
            id = args.shift(),
            replacements = args.shift(),
            version = mpfResourcesVersion;

        if (args.length !== 0) {
            if (typeof args[ args.length-1 ] === 'string') {
                version = args.shift();
            } else if(typeof args[ args.length-1 ] === 'object') {
                replacements = args.shift();
            }
        }

        filename = filename.replace('/', '::');

        function replaceKeyValues (text, kv) {
            var key = ''; text = text || '';
            for (key in kv) {
                if (kv.hasOwnProperty(key)) {
                    text = text.replace(key, kv[key]);
                }
            }
            return text;
        }

        if (mpfTexts.hasOwnProperty(filename) && mpfTexts[filename].hasOwnProperty(id)) {
            return replaceKeyValues(mpfTexts[filename][id], replacements);
        }

        var localStorageIndex = 'mpfText/'+mpf.locale() +'/'+ filename;
        if (localStorage && localStorage.hasOwnProperty(localStorageIndex+'/v'+ version)) {
            mpfTexts[ filename ] = JSON.parse(localStorage[ localStorageIndex+'/v'+ version ]);
            return replaceKeyValues(mpfTexts[ filename ][id], replacements);
        }

        if (!mpfTextAjax.hasOwnProperty(filename)) {
            mpfTextAjax[filename] = mpf.ajaxGet(mpf.restUrl +'text/'+ filename, function (errors, response) {
                var i = '';
                if (errors) {
                    throw new Error(errors[0].msg);
                }

                // Remove previous versions of the filename
                for (i in localStorage) {
                    if (localStorage.hasOwnProperty(i)) {
                        var fileRegex = new RegExp(localStorageIndex, "g");
                        if (fileRegex.test(i)) {
                            localStorage.removeItem(i);
                        }
                    }
                }

                mpfTexts[ filename ] = response;
                mpf.trigger('text/'+ filename +'/loaded');

                if (localStorage) {
                    localStorage[ localStorageIndex+'/v'+version ] = JSON.stringify(response);
                }
                delete mpfTextAjax[filename];
            });

            mpf.bind('text/'+ filename +'/loaded', function loadText(event) {
                $('[ data-mpf-text*="'+ filename +'"]').each(function (index, element) {
                    var $element = $(element),
                        parts = $element.attr('data-mpf-text').split(':'),
                        keyValues = JSON.parse($element.attr('data-mpf-text-replacements').replace(/&quot;/g, '"'));

                    $element.replaceWith(replaceKeyValues(mpfTexts[parts[0]][parts[1]], keyValues));
                });

                mpf.unbind('text/'+ filename +'/loaded');
            });
        }

        if (id) {
            return '<span data-mpf-text="'+ filename +':'+ id +'" data-mpf-text-replacements="'+ JSON.stringify(replacements).replace(/"/g, '&quot;') +'">&nbsp;</span>';
        }
        return '';
    };

    mpf.verifyProofOfWork = function verifyProofOfWork(message, h, difficulty) {
        var hash = sha256_digest(message), diff = difficulty.toString().replace(/[^0]/, '');

        if (message.length !== 65) {
            return false;
        }

        if (hash !== h) {
            return false;
        }

        if (diff === hash.toString().substr(0, diff.length)) {
            return true;
        }
        return false;
    };

    mpf.proofOfWork = function proofOfWork(id, difficulty) {
        mpf.trigger('pfw_start:'+id);
        mpfProofOfWorkIntervals[ id ] = setInterval(function() {
            var message = $.randomString(65), hash = sha256_digest(message), diff = difficulty.toString().replace(/[^0]/, '');
            if (diff.length <= 0) {
                clearInterval(mpfProofOfWorkIntervals[ id ]);
                throw new Error('proofOfWork requires the difficulty to be a series of zeros');
            }

            if (diff === hash.toString().substr(0, diff.length)) {
                mpf.trigger('pfw_end:'+id, [hash.toString(), message]);
                clearInterval(mpfProofOfWorkIntervals[ id ]);
                return;
            }

            mpf.trigger('pfw_hashing:'+id, [hash.toString()]);
        }, 1);
    };

    /**
     *
     * @param {type} index
     * @param {type} element
     * @returns {null}
     */
    function each_tooltip(index, element) {
        var $element = $(element), $label = $element.find('> label'), $section = $element.find('> section'), $arrow = null;

        $element.append('<span class="triangle">&nbsp;</span>');
        $arrow = $element.find('> span');

        $label.bind('mouseenter', function () {
            $section.css('margin-top', '-'+($section.outerHeight()/2)+'px');
            $section.stop(true, true).fadeIn();
            $arrow.stop(true, true).fadeIn();
        });

        $label.bind('mouseleave', function () {
            $section.stop(true, true).fadeOut();
            $arrow.stop(true, true).fadeOut();
        });
    }

    mpf.globalEvents.push({
        load: function() {
            $('[data-mpf-tooltip]').each(each_tooltip);
        },
        unload: function() {
            $('[data-mpf-tooltip] > label').unbind('mouseenter');
            $('[data-mpf-tooltip] > label').unbind('mouseleave');
        }
    });
}());

/*
$.fn.bindFirst = function(name, fn) {
    var elem, handlers, i, _len;
    this.bind(name, fn);
    for (i = 0, _len = this.length; i < _len; i++) {
        elem = this[i];
        handlers = jQuery._data(elem).events[name.split('.')[0]];
        handlers.unshift(handlers.pop());
    }
};
*/
