$(document).ready(function () {
    "use strict";

    var currentPage = document.location.href.match(/\/([a-zA-Z]+)\/|$/)[1],
        $menu = $('body > nav'),
        $headerSeperator = $('body > header > hr');

    $('li', $menu).each(function (index, element) {
        var $menuItem = $(element), name = $menuItem.attr('data-menu');
        if (name == currentPage || (!currentPage && name == 'overview')) {
            $('.nob', $menuItem).css('display', 'block');
            $menuItem.addClass('selected');
        }
    });

    $('a', $menu).mouseover(function () {
        var $menuItem = $(this).closest('li');
        if (!$menuItem.hasClass('selected')) {
            $('.nob', $menuItem).css('display', 'block');
        }
    }).mouseout(function () {
        var $menuItem = $(this).closest('li');
        if (!$menuItem.hasClass('selected')) {
            $('.nob', $menuItem).css('display', 'none');
        }
    });

    $('a', $menu).click(function () {
        $('.handle img', $menu).trigger('click', {url: this.href});
        return false;
    });

    $('.handle img', $menu).click(function (event, options) {
        if ($('ul:visible', $menu).length > 0) {
            $('ul', $menu).slideUp(function () {
                $('div.handle > img', $menu).prop('src', '/mpf-admin/images/icons/32x32/grayArrowDown.png');
                if (options && options.hasOwnProperty('url')) {
                    document.location.href=options.url;
                }
            });
        } else {
            $('ul', $menu).slideDown(function () {
                $('div.handle > img', $menu).prop('src', '/mpf-admin/images/icons/32x32/grayArrowUp.png');
            });
        }
    });

    setTimeout(function () {
        $('.handle img', $menu).click();
    }, 250);

    mpf.globalEvents.push({
        load: function() {
            // ########### Ajax Validation forms
            $('input,select,textarea').on('addCheck', function(event, check) {
                var $element = $(this), $form = $element.closest('form'), $label = $('label[for="' + $element.attr('id') + '"]', $form);
                if (check === 'required') {
                    $('[data-form-check-required="' + $element.attr('name') + '"]', $label).remove();
                    $label.prepend('<span class="required" data-form-check-required="' + $element.attr('name') + '">*</span>');
                }
            });

            $('form,input,select,textarea').on('error', function(event, errorMsg) {
                var $element = $(this), $form = $element.closest('form'), $label = $('label[for="' + $element.attr('name') + '"]', $form);
                $('[data-form-error-img="' + $element.attr('name') + '"]', $form).remove();
                $label.after('<img src="/mpf-admin/images/icons/16x16/error.png" width="16" height="16" data-form-error-img="' + $element.attr('name') + '" alt="error icon" title="' + errorMsg + '" />');

                if ($('ul.error li', $form).length === 1) {
                    $('ul.error li', $form).addClass('singleError');
                } else {
                    $('ul.error li', $form).removeClass('singleError');
                }
            });
        },
        unload: function() {
            $('input,select,textarea').unbind('addCheck');
            $('form,input,select,textarea').unbind('error');
        }
    });
    mpf.reloadGlobalEvents();

});