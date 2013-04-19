jQuery.extend({
    parseQuerystring: function(string) {
        if (typeof(string) != "undefined") {
            var a = document.createElement('a');
            a.href = string;
            string = a.search.replace('?', '');
        }

        var nvpair = {};
        var qs = (typeof(string) == "undefined" ? window.location.search.replace('?', '') : string);
        var pairs = qs.split('&');
        $.each(pairs, function(i, v){
            var pair = v.split('=');
            nvpair[pair[0]] = pair[1];
        });
        return nvpair;
    }
});
