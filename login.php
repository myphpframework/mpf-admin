<?php

use \MPF\Text;
use \MPF\User;

if (\MPF\User::bySession()) {
    header('Location: /mpf-admin/');
    exit;
}

$totalUsers = User::getTotalEntries();

$cssFiles[] = '/mpf-admin/css/forms.css';
$cssFiles[] = '/mpf-admin/css/login.css';
$jsFiles[] = '/mpf-admin/js/login.js';

$template = MPF\Template::getFile('layout');
$template->startContent();
?>

    <form name="login" action="/mpf-admin/rest/login.html" method="PUT">
        <fieldset>
            <legend><?= Text::byXml('login')->get('title') ?></legend>
            <? if ($totalUsers == 1): ?><p class="information"><?= Text::byXml('login')->get('firstUser') ?></p><? endif; ?>
            <div><label for="username"><?= Text::byXml('login')->get('username') ?></label><input type="text" name="username" id="username"/></div>
            <div>
                <label for="password"><?= Text::byXml('login')->get('password') ?></label>
                <input type="password" name="password" id="password" />
                <div class="newUser" data-mpf-tooltip="passwordStrength">
                    <label><img src="/mpf-admin/images/icons/16x16/information.png" width="16" height="16" alt="i" /></label>
                    <section>
                        <h5><?= Text::byXml('login')->get('passwordStrengthTitle') ?></h5>
                        <hr />
                        <?= Text::byXml('login')->get('passwordStrengthDescription') ?>
                    </section>
                </div>
            </div>
            <div class="newUser"><label for="passwordConfirm"><?= Text::byXml('login')->get('passwordConfirm') ?></label><input type="password" name="passwordConfirm" id="passwordConfirm" /></div>
            <? if ($totalUsers != 1): ?><p class="existingUser"><?= Text::byXml('login')->get('passwordLost') ?></p><? endif; ?>
            <div><label for="new"><?= Text::byXml('login')->get('newUser') ?></label><input type="checkbox" name="new" id="new" <? if ($totalUsers == 1): ?>checked="checked" disabled="disabled" <? endif; ?>/></div>
            <input type="submit" value="<?= Text::byXml('login')->get('submit') ?>" class="gradientGreen" />
        </fieldset>
    </form>
<section id="proofOfWork"></section>
<? $template->stopContent();
echo $template;
