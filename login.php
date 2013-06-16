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

$loginText = Text::byXml('login');
$template = MPF\Template::getFile('layout');
$template->startContent();
?>
    <form name="login" action="/mpf-admin/rest/login.html" method="PUT">
        <fieldset>
            <legend><?= $loginText->get('title') ?></legend>
            <? if ($totalUsers == 1): ?><p class="information"><?= $loginText->get('firstUser') ?></p><? endif; ?>
            <div><label for="username"><?= $loginText->get('username') ?></label><input type="text" name="username" id="username" tabindex="1" /></div>
            <div>
                <label for="password"><?= $loginText->get('password') ?></label>
                <input type="password" name="password" id="password" tabindex="2" />
            </div>
            <div class="newUser">
                <label><?= $loginText->get('passwordStrength') ?></label>
                <div data-mpf-password-strength="password"><div data-mpf-password-strength-meter="password" class="mpfStrengthLow">&nbsp;</div></div>
                <div data-mpf-tooltip="passwordStrength">
                    <label><img src="/mpf-admin/images/icons/16x16/information.png" width="16" height="16" alt="i" /></label>
                    <section>
                        <h5><?= $loginText->get('passwordStrengthTitle') ?></h5>
                        <hr />
                        <?= $loginText->get('passwordStrengthDescription') ?>
                    </section>
                </div>
            </div>
            <div class="newUser"><label for="passwordConfirm"><?= $loginText->get('passwordConfirm') ?></label><input type="password" name="passwordConfirm" id="passwordConfirm" tabindex="3" /></div>
            <? if ($totalUsers != 1): ?><p class="existingUser"><?= $loginText->get('passwordLost') ?></p><? endif; ?>
            <div><label for="new"><?= $loginText->get('newUser') ?></label><input type="checkbox" name="new" id="new" <? if ($totalUsers == 1): ?>checked="checked" disabled="disabled" <? endif; ?> /></div>
            <input type="submit" value="<?= $loginText->get('submit') ?>" class="gradientGreen" tabindex="4" />
        </fieldset>
    </form>
<? $template->stopContent();
echo $template;
