"use strict";

var mpfOverlaysInterval = null;

$(document).ready(function () {
    function setupOverlay($overlay) {
        var $container = $('section', $overlay);

        // We remove the overlay init attribute first not to be picked up by the next interval
        $overlay.attr('data-overlay-init', null);

        function resizeOverlay() {
            var totalWidth = parseInt($overlay.width(), 10),
            totalHeight = parseInt($overlay.height(), 10),
            bodyWidth = parseInt($container.width(), 10),
            bodyHeight = parseInt($container.height(), 10);

            $container.css('margin-left', (totalWidth / 2) - (bodyWidth / 2) +'px');
            $container.css('margin-top', (totalHeight / 2) - (bodyHeight / 2) +'px');
        }

        $container.bind('click', function(event) {
            event.stopPropagation();
            return false;
        });

        $overlay.not('[data-overlay="loader"]').bind('click', function (event) {
            $overlay.trigger('close');
        });

        $overlay.bind('resize', function(event) {
            resizeOverlay();
        });

        $overlay.bind('open', function(event, options) {
            $container.hide();
            $overlay.fadeIn();
            $overlay.trigger('resize');
            $container.fadeIn();
        });

        $overlay.bind('close', function(event) {
            $overlay.fadeOut();
        });

        return $overlay;
    }

    mpfOverlaysInterval = setInterval(function () {
        $('[data-overlay-init]').each(function (index, element) {
            setupOverlay($(element));
        });

        $('[data-overlay-link]').each(function (index, element) {
            var $link = $(element),
                options = {},
                overlayId = $link.attr('data-overlay-link');

            // We remove the overlay link attribute first not to be picked up by the next interval
            $link.attr('data-overlay-link', null);

            if ($link.attr('data-overlay-options')) {
                options = $.parseQuerystring($link.attr('data-overlay-options'));
            }

            $link.bind('click', function () {
                var id = overlayId, $overlay = $('[data-overlay="'+ id +'"]'), $loader = $('[data-overlay="loader"]');

                if ($overlay.length >= 1) {
                    $overlay.trigger('open', options);
                    return false;
                }

                $('section', $loader).spin(mpf.overlayLoaderOpts).parent().trigger('open');
                mpf.loadResources(id, function () {
                    $('section', $loader).spin(false).parent().trigger('close');

                    setupOverlay($('[data-overlay="'+ id +'"]')).trigger('open', options);
                });

                return false;
            });
        });
    }, 150);
});
