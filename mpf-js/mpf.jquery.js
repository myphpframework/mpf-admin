"use strict";

var mpf = $({restUrl: '/rest/', options: {}}), mpfTexts = {}, mpfTextAjax = {}, mpfTemplates = {}, mpfTemplateAjax = {}, mpfResourcesVersion = "0.1.0", mpfResourcesInfo = null;
;

// Retrieve the query string of the src
$('script[src*="mpf.jquery"]').each(function (index, item) {
    mpf.options = $.parseQuerystring(item.src);
    if (mpf.options.hasOwnProperty('restUrl')) {
        mpf.restUrl = mpf.options.restUrl;
    }
});

mpf.ajaxForm = function ajaxForm($form, callback) {
    var data = [];

    $('[type="radio"]:checked', $form).each(function (index, element) {
        var $element = $(element);
        data.push($element.attr('name') +'='+ $element.val());
    });

    $('[type="checkbox"]:checked', $form).each(function (index, element) {
        var $element = $(element);
        data.push($element.attr('name') +'[]='+ $element.val());
    });

    $('[type="text"],[type="password"],textarea,select').each(function (index, element) {
        var $element = $(element);
        data.push($element.attr('name') +'='+ $element.val());
    });


    $('fieldset', $form).prepend('<div class="spinnerWrapper">&nbsp;</div>');
    $('.spinnerWrapper', $form).spin();
    $('[type="submit"]', $form).hide();
    $('ul.error', $form).remove();
    return mpf.ajax($form.attr('action').replace('.html', ''), data.join('&'), $form.attr('method'), function (errors, response) {
        if (errors) {
            var $spinner = $('.spinnerWrapper', $form);
            $('[type="submit"]', $form).show();
            $spinner.spin(false);
            $spinner.fadeOut(function () {
                $(this).remove();
            });
        }

        callback(errors, response);
    });
};

/**
 * Returns what $.ajax() returns to be able to abort at any time
 */
mpf.ajax = function ajax(url, querystring, method, callback) {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        url = args.shift(),
        querystring = (args.length == 0 ? '' : args.shift()),
        method = (args.length == 0 ? 'POST' : args.shift()),
        dataType = 'jsonp';

    if (typeof callback != 'function') {
        throw new Error('A callback must be provided for all ajax calls');
        return;
    }

    querystring = (!querystring ? 'PWD='+encodeURIComponent(document.location.href) : querystring+'&PWD='+encodeURIComponent(document.location.href));

    // if we are retrieving a static package.json files we change the datatype
    if (url.match(/mpfResourcesInfo/)) {
        dataType = 'json'
    }

    return $.ajax({
        type: method,
        url: url,
        dataType: dataType,
        data: querystring,
        error: function (error) {
            if (error.readyState != 0) {
                var response = null;
                try {
                    response = JSON.parse(error.responseText);
                    if (response.hasOwnProperty('error')) {
                        response = response.error;
                    }
                } catch (e) {}
                callback(response, null);
            }
        },
        success: function(response) {
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
        }
    });
};

mpf.ajaxGet = function ajaxGet(url, callback) {
    return mpf.ajax(url, null, 'GET', callback);
};

mpf.loadResources = function loadResources(id, callback) {
    loadMpfResourcesInfo(function () {
        if (!mpfResourcesInfo.hasOwnProperty(id)) {
            throw new Error('Could not find any package information for "'+ id +'", make sure its in the /js/mpfResourcesInfo.json and that you have flushed localstorage for the key "mpfResourcesInfo".');
            return;
        }

        for (var i=0; i < mpfResourcesInfo[id]['resources'].length; i++) {
            var type = mpfResourcesInfo[id]['resources'][i];
            switch (type.toLowerCase()) {
                case 'js':
                    break;
                case 'css':
                    break;
                case 'html':
                    break;
                case 'text':
                    break;
            }
        }
    });
};

function loadMpfResourcesInfo(callback) {
    if (mpfResourcesInfo === null) {
        var storageIndex = 'mpfResourcesInfo:v'+ mpfResourcesVersion;
        if (localStorage && localStorage.hasOwnProperty(storageIndex)) {
            mpfResourcesInfo = JSON.parse(localStorage[ storageIndex ]);
            if (typeof callback == 'function') {
                callback();
            }
            return;
        }

        mpf.ajaxGet('/mpf-admin/js/mpfResourcesInfo.json', function (errors, result) {
            if (errors) {
                throw new Error(errors[0].msg);
                return;
            }

            if (false && localStorage) {
                localStorage[ storageIndex ] = JSON.stringify(result);
            }

            // Remove previous versions of the resources' info
            for (var i in localStorage) {
                if (/^mpfResourcesInfo/.test(i)) {
                    localStorage.removeItem(i);
                }
            }
            mpfResourcesInfo = result;

            if (typeof callback == 'function') {
                callback();
            }
        });
        return;
    }

    if (typeof callback == 'function') {
        callback();
    }

    return;
};

mpf.locale = function locale() {
    if ($.cookie('mpf_locale')) {
        return $.cookie('mpf_locale');
    }

    return 'en_CA';
};

mpf.template = function template(filename, version, callback) {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        filename = args.shift();

    version = '0.0.0'
    if (args.length != 0) {
        version = args.shift();
    }

    if (mpfTemplates.hasOwnProperty(filename)) {
        return mpfTemplates[ filename ];
    }

    var localStorageIndex = 'mpfTemplates:'+ filename;
    if (localStorage && localStorage.hasOwnProperty(localStorageIndex +'.v'+ version)) {
        mpfTemplates[ filename ] = JSON.parse(localStorage[ localStorageIndex +'.v'+ version ]);
        return mpfTemplates[ filename ];
    }

    if (!mpfTemplateAjax.hasOwnProperty(filename)) {
        mpfTemplateAjax[filename] = mpf.ajaxGet(mpf.restUrl+'template/'+ filename, function (errors, response) {
            if (errors) {
                throw new Error(errors[0].msg);
                return;
            }

            // Remove previous versions of the filename
            for (var i in localStorage) {
                var fileRegex = new RegExp(localStorageIndex, "g");
                if (fileRegex.test(i)) {
                    localStorage.removeItem(i);
                }
            }

            mpfTemplates[ filename ] = response;
            $('[data-mpf-template="'+ filename +'"]').replaceWith(mpfTemplates[ filename ]);

            if (localStorage) {
                localStorage[ localStorageIndex+'.v'+version ] = JSON.stringify(response);
            }
            delete mpfTemplateAjax[filename];
        });
    }

    return '<span data-mpf-template="'+ filename +'">&nbsp;</span>';
};


mpf.text = function text(filename, id, replacements, version) {
    var args = Array.prototype.slice.call(arguments),
        filename = args.shift(),
        id = args.shift(),
        replacements = args.shift();

    version = '0.0.0'
    if (args.length != 0) {
        if (typeof args[ args.length-1 ] == 'string') {
            version = args.shift();
        } else if(typeof args[ args.length-1 ] == 'object') {
            replacements = args.shift();
        }
    }

    function replaceKeyValues (text, kv) {
        for (var key in kv) {
            if (kv.hasOwnProperty(key)) {
                text = text.replace(key, kv[key]);
            }
        }
        return text;
    }

    if (mpfTexts.hasOwnProperty(filename) && mpfTexts[filename].hasOwnProperty(id)) {
        return replaceKeyValues(mpfTexts[filename][id], replacements);
    }

    var localStorageIndex = 'mpfText:'+mpf.locale() +':'+ filename;
    if (localStorage && localStorage.hasOwnProperty(localStorageIndex+'.v'+ version)) {
        mpfTexts[ filename ] = JSON.parse(localStorage[ localStorageIndex+'.v'+ version ]);
        return replaceKeyValues(mpfTexts[ filename ][id], replacements);
    }

    if (!mpfTextAjax.hasOwnProperty(filename)) {
        mpfTextAjax[filename] = mpf.ajaxGet(mpf.restUrl +'text/'+ filename, function (errors, response) {
            if (errors) {
                throw new Error(errors[0].msg);
                return;
            }

            // Remove previous versions of the filename
            for (var i in localStorage) {
                var fileRegex = new RegExp(localStorageIndex, "g");
                if (fileRegex.test(i)) {
                    localStorage.removeItem(i);
                }
            }

            mpfTexts[ filename ] = response;
            mpf.trigger('text:'+ filename +':loaded');

            if (localStorage) {
                localStorage[ localStorageIndex+'.v'+version ] = JSON.stringify(response);
            }
            delete mpfTextAjax[filename];
        });

        mpf.bind('text:'+ filename +':loaded', function loadText(event) {
            $('[ data-mpf-text*="'+ filename +'"]').each(function (index, element) {
                var $element = $(element),
                    parts = $element.attr('data-mpf-text').split(':'),
                    keyValues = JSON.parse($element.attr('data-mpf-text-replacements').replace(/&quot;/g, '"'));

                $element.replaceWith(replaceKeyValues(mpfTexts[parts[0]][parts[1]], keyValues));
            });

            mpf.unbind('text:'+ filename +':loaded');
        });
    }

    if (id) {
        return '<span data-mpf-text="'+ filename +':'+ id +'" data-mpf-text-replacements="'+ JSON.stringify(replacements).replace(/"/g, '&quot;') +'">&nbsp;</span>';
    }
    return '';
};
