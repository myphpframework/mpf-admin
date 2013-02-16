<?php

use MPF\ENV;
use MPF\Text;

$MPF_INFO = json_decode(file_get_contents(PATH_MPF_CORE.'bucket.json'), true);

$cssFiles[] = '/mpf-admin/css/overview.css';
$jsFiles[] = '/mpf-admin/js/overview.js';

$template = MPF\Template::getFile('layout');
$template->startContent(); ?>

    <h3><?= Text::byXml('layout')->get('overview') ?></h3>

    <div>
        <h4>Settings</h4>
        <ul>
            <li>
                <h5>Log Levels</h5>
                <label>File</label>
                <span>???</span>
                <label>Type</label>
                <span>???</span>
                <label>Categories</label>
                <span>???</span>
            </li>
            <li>
                <h5>Caches</h5>
                <label>Templates</label>
                <span>???</span>
                <label>Templates</label>
                <span>???</span>
            </li>
            <li>
                <h5>Default Local</h5>
                <span>en_CA</span>
            </li>
            <li>
                <label>Test</label>
                <span>Status</span>
            </li>
        </ul>
    </div>

    <div>
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
    </div>

    <div>
        <h4>users</h4>
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
    </div>

    <div>
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
    </div>

<? $template->stopContent();
echo $template;