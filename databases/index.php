<?php

use MPF\ENV;
use MPF\Text;

$MPF_INFO = json_decode(file_get_contents(PATH_MPF_CORE.'bucket.json'), true);

$cssFiles[] = '/mpf-admin/media/css/overview.css';
$jsFiles[] = '/mpf-admin/media/js/overview.js';

$template = MPF\Template::getFile('layout');
$template->startContent(); ?>

    <h3><?= Text::byXml('layout')->get('overview') ?></h3>

    <section>
        <h4>Settings</h4>
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

<? $template->stopContent();
echo $template;