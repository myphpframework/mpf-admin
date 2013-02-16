$(document).ready(function () {
    var currentPage = document.location.href.match(/\/([a-zA-Z]+)\/|$/);
    currentPage = (currentPage[0] == "" ? 'overview' : currentPage[1]);

    $('body > nav li').each(function (index, element) {
        var $menuItem = $(element), name = $menuItem.attr('data-menu');
        if (name == currentPage) {
            $('.nob', $menuItem).css('display', 'block');
            $menuItem.addClass('selected');
        }
    });

    $('body > nav li a').mouseover(function () {
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


});