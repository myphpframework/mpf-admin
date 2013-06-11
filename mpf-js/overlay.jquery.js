"use strict";

var mpfOverlaysInterval = null;
$(document).ready(function mpf_overlay_closure() {
    var parsedOverlayIds = [], windowMode = false;

    function setResizableEvents($overlay) {
        var $container = $overlay.find('> section'),
            $resizer = $container.find('> footer .resizer');

        $resizer.css('cursor', 'se-resize');
        $resizer.bind('mousedown', function bind_mousedown(event) {
            var dragTime = null,
                currentOffsetX = 0, startPositionX = 0, maxOffsetX = $(window).width() - $container.outerWidth(), minOffsetX = 0,
                currentOffsetY = 0, startPositionY = 0, maxOffsetY = $(window).height() - $container.outerHeight(), minOffsetY = 0;

            if (event.which !== 1) {
                return;
            }
            event.preventDefault();

            dragTime = new Date().getTime();
            currentOffsetX = ($container.css('width') === 'auto' ? 0 : parseInt($container.css('width'), 10));
            startPositionX = event.pageX;

            currentOffsetY = ($container.css('height') === 'auto' ? 0 : parseInt($container.css('height'), 10));
            startPositionY = event.pageY;

            $overlay.trigger('startResize');
            $(window).bind('mousemove', function bind_mousemove(event) {
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

            $(window).bind('mouseup', function bind_mouseup(event) {
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
                event.preventDefault();
                if (event.which !== 1) {
                    return false;
                }

                return false;
            });

            return false;
        });
    }

    function setDraggableEvents($overlay) {
        var $container = $overlay.find('> section'),
            $header = $container.find('> header');

        $header.css('cursor', 'move');
        $header.bind('mousedown', function bind_mousedown(event) {
            var dragTime = null,
                currentOffsetX = 0, startPositionX = 0, maxOffsetX = $(window).width() - $container.outerWidth(), minOffsetX = 0,
                currentOffsetY = 0, startPositionY = 0, maxOffsetY = $(window).height() - $container.outerHeight(), minOffsetY = 0;

            if (event.which !== 1) {
                return;
            }
            event.preventDefault();

            dragTime = new Date().getTime();
            currentOffsetX = ($container.css('margin-left') === 'auto' ? 0 : parseInt($container.css('margin-left'), 10));
            startPositionX = event.pageX;

            currentOffsetY = ($container.css('margin-top') === 'auto' ? 0 : parseInt($container.css('margin-top'), 10));
            startPositionY = event.pageY;

            $overlay.trigger('startDrag');
            $(window).bind('mousemove', function bind_mousemove(event) {
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

            $(window).bind('mouseup', function bind_mouseup(event) {
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
                event.preventDefault();
                if (event.which !== 1) {
                    return false;
                }

                $overlay.trigger('endDrag');
                return false;
            });

            return false;
        });
    }

    function setGenericEvents($overlay) {
        var $container = $overlay.find('> section'),
            $header = $container.find('> header'),
            $footer = $container.find('> footer');

        parsedOverlayIds.push($overlay.attr('data-mpf-overlay'));

        function centerContainer() {
            var totalWidth = parseInt($overlay.width(), 10),
            totalHeight = parseInt($overlay.height(), 10),
            bodyWidth = parseInt($container.width(), 10),
            bodyHeight = parseInt($container.height(), 10);

            $container.css('margin-left', (totalWidth / 2) - (bodyWidth / 2) +'px');
            $container.css('margin-top', (totalHeight / 2) - (bodyHeight / 2) +'px');
        }

        $container.bind('click', function bind_click_container(event) {
            event.stopPropagation();
            return false;
        });

        $overlay.not('[data-mpf-overlay="loader"]').bind('click', function bind_click(event) {
            $overlay.trigger('close');
        });

        $overlay.bind('center', function bind_center(event) {
            centerContainer();
        });

        $overlay.bind('open', function bind_open(event, options) {
            options = options || {};

            if (options.hasOwnProperty('windowMode')) {
                $overlay.css('background', 'none');
                windowMode = true;
            }

            if (options.hasOwnProperty('draggable') && $header.length > 0) {
                setDraggableEvents($overlay);
            }

            if (options.hasOwnProperty('resizable') && $footer.length > 0 && $footer.find('.resizer')) {
                setResizableEvents($overlay);
            }

            if (windowMode) {
                $overlay.css('width', '100%');
                $overlay.css('height', '100%');
            }

            $container.hide();
            $overlay.fadeIn(function () {
                $overlay.trigger('center');
                $container.fadeIn();
            });

            if (windowMode) {
                $overlay.css('width', $container.outerWidth());
                $overlay.css('height', $container.outerHeight());
            }
        });

        $overlay.bind('close', function bind_close(event) {
            if ($overlay.attr('data-mpf-overlay') === 'loader') {
                $overlay.hide();
            } else {
                $overlay.fadeOut();
            }
        });

        $('.close', $header).bind('click', function bind_click_close() {
            $overlay.trigger('close');
        });

        return $overlay;
    }

    function each_overlays(index, element) {
        if (parsedOverlayIds.indexOf($(element).attr('data-mpf-overlay')) === -1) {
            setGenericEvents($(element));
        }
    }

    function each_overlay_links(index, element) {
        var $link = $(element),
            options = {},
            overlayId = $link.attr('data-mpf-overlay-link');

        // We remove the overlay link attribute first not to be picked up by the next interval
        $link.attr('data-mpf-overlay-link', null);

        if ($link.attr('data-mpf-overlay-options')) {
            options = $.parseQuerystring($link.attr('data-mpf-overlay-options'));
        }

        $link.bind('click', function bind_click_link(index, element) {
            var id = overlayId, $overlay = $('[data-mpf-overlay="'+ id +'"]'), $loader = $('[data-mpf-overlay="loader"]');

            if ($overlay.length >= 1) {
                $overlay.trigger('open', options);
                return false;
            }

            $('section', $loader).spin(mpf.overlayLoaderOpts).parent().trigger('open');
            mpf.loadResources(id, function loadOverlayResources() {
                $('section', $loader).spin(false).parent().trigger('close');
                setGenericEvents($('[data-mpf-overlay="'+ id +'"]')).trigger('open', options);
                mpf.reloadGlobalEvents();
            });

            return false;
        });
    }

    mpfOverlaysInterval = setInterval(function () {
        $('[data-mpf-overlay]').each(each_overlays);
        $('[data-mpf-overlay-link]').each(each_overlay_links);
    }, 150);
});
