"use strict";
var proofOfWorkIntervals= {};

jQuery.extend({
    parseQuerystring: function(string) {
        if (typeof(string) !== "undefined") {
            var a = document.createElement('a');
            if (!string.match(/^\?/) && !string.match(/\?/)) {
                string = '?' + string;
            }
            a.href = string;
            string = a.search.replace('?', '');
        }

        var nvpair = {};
        var qs = (typeof(string) === "undefined" ? window.location.search.replace('?', '') : string);
        var pairs = qs.split('&');
        $.each(pairs, function(i, v) {
            var pair = v.split('=');
            nvpair[pair[0]] = pair[1];
        });
        return nvpair;
    },
    randomString: function randomString(length) {
        var text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            i = 0;

        while (i < length) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            i++;
        }
        return text;
    }
});
