<?php

use MPF\ENV;
use MPF\Text;
use MPF\Config;

$settings = Config::get('settings');

$cssFiles[] = '/mpf-admin/media/css/overview.css';
$jsFiles[] = '/mpf-admin/media/js/overview.js';

$template = MPF\Template::getFile('layout');
/*
function keyValue($key, $settings) { ?>
    <h5><?= $key ?></h5>
    <ul>
        <? foreach ((array)$settings as $k => $v):  if (is_object($v) || is_array($v)) { keyValue($k, $v); continue; } ?>
        <li>
            <label><?= $k ?></label>
            <span><?= $v ?></span>
        </li>
        <? endforeach; ?>
    </ul>
<?php
}


$template->startContent(); ?>

    <section>
        <h4>Settings</h4>
        <ul>
            <? foreach ($settings as $key => $setting): ?>
            <li>
                <? if (is_object($setting)) { keyValue($key, $setting); continue; } ?>
                <label><?= $key ?></label>
                <span><?= $setting ?></span>
            </li>
            <? endforeach; ?>
        </ul>
    </section>

    <section>
        <h4>Databases</h4>
        <ul>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
        </ul>
    </section>

    <section>
        <h4>Users</h4>
        <ul>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
        </ul>
    </section>

    <section>
        <h4>Buckets</h4>
        <ul>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
        </ul>
    </section>

<?
 */
$template->stopContent();
echo $template->parse();