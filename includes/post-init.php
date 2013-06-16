<?php

\MPF\ENV::bootstrap(\MPF\ENV::SESSION);

$url = parse_url($_SERVER['REQUEST_URI']);
if (in_array($url['path'], array('/mpf-admin/login.php')) || preg_match('@^/mpf-admin/rest@',$url['path'])) {
    return;
}

$user = \MPF\Session::mustBeLoggedIn('/mpf-admin/login.php');

if (!$user->isInGroup(\MPF\User\Group::ADMIN())) {
    header("Location: /mpf-admin/rest/user/{$user->getUsername()}/logout/?redirect=".urlencode('/mpf-admin/login.php')."\n");
    exit;
}
