var mpf = {}, mpfTexts = {}, mpfRestUrl = '/rest/', mpfOptions = {};

// Retrieve the query string of the src
$('script[src*="mpf.jquery"]').each(function (index, item) {
    mpfOptions = $.parseQuerystring(item.src);
    if (mpfOptions.hasOwnProperty('restUrl')) {
        mpfRestUrl = mpfOptions.restUrl;
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
        var $spinner = $('.spinnerWrapper', $form);
        $('[type="submit"]', $form).show();
        $spinner.spin(false);
        $spinner.fadeOut(function () {
            $(this).remove();
        });

        callback(errors, response);
    });
};

mpf.ajax = function ajax(url, querystring, method, callback) {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        url = args.shift(),
        querystring = (args.length == 0 ? '' : args.shift()),
        method = (args.length == 0 ? 'POST' : args.shift()),
        $ajaxHandler = null;

    querystring = (!querystring ? 'PWD='+encodeURIComponent(document.location.href) : querystring+'&PWD='+encodeURIComponent(document.location.href));

    $ajaxHandler = $.ajax({
        type: method,
        url: url,
        dataType: 'jsonp',
        data: querystring,
        error: function (error) {
            if (error.readyState != 0) {
                try {
                    error = JSON.parse(error.responseText).error;
                } catch (e) {}
                console.log(error);
                callback(error, null);
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

    return $ajaxHandler;
};

mpf.ajaxGet = function get(url, callback) {
    mpf.ajax(url, null, 'GET', callback);
};

mpf.locale = function () {
    if ($.cookie('mpf_locale')) {
        return $.cookie('mpf_locale');
    }

    return 'en_CA';
};

mpf.text = function text(filename, id) {
    if (mpfTexts.hasOwnProperty(filename) && mpfTexts[filename].hasOwnProperty(id)) {
        return mpfTexts[filename][id];
    }

    var localStorageIndex = mpf.locale() +':'+ filename;
    if (localStorage && localStorage.hasOwnProperty(localStorageIndex)) {
        mpfTexts[ filename ] = JSON.parse(localStorage[ localStorageIndex ]);
        return mpfTexts[ filename ][id];
    }

    mpf.ajaxGet(mpfRestUrl+'text/'+filename, function (error, response) {
        if (error) {
            console.error(error);
            return;
        }

        mpfTexts[filename] = response;
        if (localStorage) {
            localStorage[ localStorageIndex ] = JSON.stringify(response);
        }
    });
};

