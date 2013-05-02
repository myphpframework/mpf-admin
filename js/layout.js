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
        $('.handle', $menu).trigger('click', {url: this.href});
        return false;
    });

    $('.handle', $menu).click(function (event, options) {
        if ($('ul:visible', $menu).length > 0) {
            $('ul', $menu).slideUp(function () {
                $('div.handle > div', $menu).css('background', 'url("/mpf-admin/images/menuHandles.png") 0 -15px');
                if (options && options.hasOwnProperty('url')) {
                    document.location.href=options.url;
                }
            });
        } else {
            $('ul', $menu).slideDown(function () {
                $('div.handle > div', $menu).css('background', 'url("/mpf-admin/images/menuHandles.png") 0 0');
            });
        }
    });

    setTimeout(function () {
        $('.handle', $menu).click();
    }, 250);

    // ########### Ajax Validation forms
    $('input,select,textarea,checkbox,radio').on('addCheck', function (event, check) {
        var $element = $(this), $form = $element.closest('form'), $label = $('label[for="'+$element.attr('id')+'"]', $form);
        if (check == 'required') {
            $('[data-form-check-required="'+$element.attr('name')+'"]', $label).remove();
            $label.prepend('<span class="required" data-form-check-required="'+$element.attr('name')+'">*</span>');
        }
    });

    $('form,input,select,textarea,checkbox,radio').on('error', function (event, errorMsg) {
        var $element = $(this), $form = $element.closest('form'), $label = $('label[for="'+$element.attr('name')+'"]', $form);
        $('[data-form-error-img="'+$element.attr('name')+'"]', $form).remove();
        $label.after('<img src="/mpf-admin/images/icons/16x16/error.png" width="16" height="16" data-form-error-img="'+$element.attr('name')+'" alt="error icon" title="'+errorMsg+'" />');

        if ($('ul.error li', $form).length == 1) {
            $('ul.error li', $form).addClass('singleError');
        } else {
            $('ul.error li', $form).removeClass('singleError');
        }
    });
});