<?php

\MPF\ENV::bootstrap(\MPF\ENV::SESSION);

$url = parse_url($_SERVER['REQUEST_URI']);
if (in_array($url['path'], array('/mpf-admin/login.php')) || preg_match('@^/mpf-admin/rest@',$url['path'])) {
    return;
}

$user = \MPF\Session::mustBeLoggedIn('/mpf-admin/login.php');

