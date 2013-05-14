"use strict";

var mpfOverlaysInterval = null;

$(document).ready(function () {
    var parsedOverlayIds = [], windowMode = false;

    function setOverlayResizableEvents($overlay) {
        var $container = $overlay.find('> section'),
            $resizer = $container.find('> footer .resizer');

        $resizer.css('cursor', 'se-resize');
        $resizer.mousedown(function(event) {
            var dragTime = null,
                currentOffsetX = 0, startPositionX = 0, maxOffsetX = $(window).width() - $container.outerWidth(), minOffsetX = 0,
                currentOffsetY = 0, startPositionY = 0, maxOffsetY = $(window).height() - $container.outerHeight(), minOffsetY = 0;

            if (event.which != 1) {
                return;
            }
            event.preventDefault();

            dragTime = new Date().getTime();
            currentOffsetX = ($container.css('width') == 'auto' ? 0 : parseInt($container.css('width')));
            startPositionX = event.pageX;

            currentOffsetY = ($container.css('height') == 'auto' ? 0 : parseInt($container.css('height')));
            startPositionY = event.pageY;

            $overlay.trigger('startResize');
            $(window).mousemove(function(event) {
                var offsetX = currentOffsetX + (event.pageX - startPositionX),
                    offsetY = currentOffsetY + (event.pageY - startPositionY);
                //if (maxOffsetX >= offsetX && minOffsetX <= offsetX) {
                    $container.css('width', offsetX + 'px');
                //} else if (maxOffsetX < offsetX) {
                //    $container.css('width', maxOffsetX + 'px');
                //} else if (minOffsetX > offsetX) {
                //    $container.css('width', minOffsetX + 'px');
                //}

                //if (maxOffsetY >= offsetY && minOffsetY <= offsetY) {
                    $container.css('height', offsetY + 'px');
                //} else if (maxOffsetY < offsetY) {
                //    $container.css('height', maxOffsetY + 'px');
                //} else if (minOffsetY > offsetY) {
                //    $container.css('height', minOffsetY + 'px');
                //}

                $overlay.trigger('resizing');
                return false;
            });

            $(window).mouseup(function(event) {
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
                event.preventDefault();
                if (event.which != 1) {
                    return false;
                }

                return false;
            });

            return false;
        });
    }

    function setOverlayDraggableEvents($overlay) {
        var $container = $overlay.find('> section'),
            $header = $container.find('> header');

        $header.css('cursor', 'move');
        $header.mousedown(function(event) {
            var dragTime = null,
                currentOffsetX = 0, startPositionX = 0, maxOffsetX = $(window).width() - $container.outerWidth(), minOffsetX = 0,
                currentOffsetY = 0, startPositionY = 0, maxOffsetY = $(window).height() - $container.outerHeight(), minOffsetY = 0;

            if (event.which != 1) {
                return;
            }
            event.preventDefault();

            dragTime = new Date().getTime();
            currentOffsetX = ($container.css('margin-left') == 'auto' ? 0 : parseInt($container.css('margin-left')));
            startPositionX = event.pageX;

            currentOffsetY = ($container.css('margin-top') == 'auto' ? 0 : parseInt($container.css('margin-top')));
            startPositionY = event.pageY;

            $overlay.trigger('startDrag');
            $(window).mousemove(function(event) {
                var offsetX = currentOffsetX + (event.pageX - startPositionX),
                    offsetY = currentOffsetY + (event.pageY - startPositionY);
                if (maxOffsetX >= offsetX && minOffsetX <= offsetX) {
                    $container.css('margin-left', offsetX + 'px');
                } else if (maxOffsetX < offsetX) {
                    $container.css('margin-left', maxOffsetX + 'px');
                } else if (minOffsetX > offsetX) {
                    $container.css('margin-left', minOffsetX + 'px');
                }

                if (maxOffsetY >= offsetY && minOffsetY <= offsetY) {
                    $container.css('margin-top', offsetY + 'px');
                } else if (maxOffsetY < offsetY) {
                    $container.css('margin-top', maxOffsetY + 'px');
                } else if (minOffsetY > offsetY) {
                    $container.css('margin-top', minOffsetY + 'px');
                }

                $overlay.trigger('dragging');
                return false;
            });

            $(window).mouseup(function(event) {
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
                event.preventDefault();
                if (event.which != 1) {
                    return false;
                }

                $overlay.trigger('endDrag');
                return false;
            });

            return false;
        });
    }

    function setOverlayGenericEvents($overlay) {
        var $container = $overlay.find('> section'),
            $header = $container.find('> header'),
            $footer = $container.find('> footer');

        parsedOverlayIds.push($overlay.attr('data-overlay'));

        function centerOverlay() {
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

        $overlay.bind('center', function(event) {
            centerOverlay();
        });

        $overlay.bind('open', function(event, options) {
            options = options || {};

            if (options.hasOwnProperty('windowMode')) {
                $overlay.css('background', 'none');
                windowMode = true;
            }

            if (options.hasOwnProperty('draggable') && $header.length > 0) {
                setOverlayDraggableEvents($overlay);
            }

            if (options.hasOwnProperty('resizable') && $footer.length > 0 && $footer.find('.resizer')) {
                setOverlayResizableEvents($overlay);
            }

            if (windowMode) {
                $overlay.css('width', '100%');
                $overlay.css('height', '100%');
            }

            $container.hide();
            $overlay.fadeIn();
            $overlay.trigger('center');
            $container.fadeIn();

            if (windowMode) {
                $overlay.css('width', $container.outerWidth());
                $overlay.css('height', $container.outerHeight());
            }
        });

        $overlay.bind('close', function(event) {
            $overlay.fadeOut();
        });

        $('.close', $header).bind('click', function () {
            $overlay.trigger('close');
        });

        return $overlay;
    }

    mpfOverlaysInterval = setInterval(function () {
        $('[data-overlay]').each(function (index, element) {
            if (parsedOverlayIds.indexOf($(element).attr('data-overlay')) === -1) {
                setOverlayGenericEvents($(element));
            }
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

                    setOverlayGenericEvents($('[data-overlay="'+ id +'"]')).trigger('open', options);
                });

                return false;
            });
        });
    }, 150);
});
