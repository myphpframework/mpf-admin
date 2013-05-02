<?php

use MPF\ENV;
use MPF\Text;

$MPF_INFO = json_decode(file_get_contents(PATH_MPF_CORE.'bucket.json'), true);

$cssFiles[] = '/mpf-admin/css/overview.css';
$jsFiles[] = '/mpf-admin/js/overview.js';

$template = MPF\Template::getFile('layout');
$template->startContent(); ?>

    <section>
        <h4>Settings</h4>
        <ul>
            <li>
                <label>Default Local</label>
                <span>en_CA</span>
            </li>
            <li>
                <label>Logs</label>
                <span>Disabled</span>
            </li>
            <li>
                <label>Cache</label>
                <span>Disabled</span>
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
echo $template->parse();