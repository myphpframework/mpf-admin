<?php

use MPF\ENV;
use MPF\Text;

$MPF_INFO = json_decode(file_get_contents(PATH_MPF_CORE.'bucket.json'), true);

$cssFiles[] = '/mpf-admin/media/css/settings.css';
$jsFiles[] = '/mpf-admin/media/js/settings.js';

$configFiles = array();
foreach (ENV::paths()->configs() as $path) {
    if ($handle = opendir($path)) {
        while (false !== ($entry = readdir($handle))) {
            if (!array_key_exists($entry, $configFiles) && is_file($path.$entry) && $entry != 'settings.ini') {
                $configFiles[ $entry ] = true;
            }
        }
    }
}

$template = MPF\Template::getFile('layout');
$template->startContent(); ?>

    <h3><?= Text::byXml('settings')->get('title') ?></h3>

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

<?= $template->stopContent();