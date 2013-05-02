
$(document).ready(function () {
    var overlayLinksInterval = setInterval(function () {
        $('[data-overlay-link]').each(function (index, element) {
            var $link = $(element),
                options = {},
                overlayId = element.getAttribute('data-overlay-link');

            // We remove the overlay link attribute first not to be picked up by the next interval
            $link.attr('data-overlay-link', null);
            console.log($link.text());

            mpf.loadResources(overlayId, function () {
                console.log('--- packages callback');
                if ($link.attr('data-overlay-options')) {
                    options = $.parseQuerystring($link.attr('data-overlay-options'));
                }

                $link.click(function (event) {
                    $overlay.trigger('open', options);
                    return false;
                });
                $link.attr('data-overlay-link', null);
            });
        });
    }, 150);
});
