<?php
function copyDirectory($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                copyDirectory($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

$demoPath = '../demo';
$sourcePath = '../';

// Delete existing demo directory if it exists
if (is_dir($demoPath)) {
    array_map('unlink', glob("$demoPath/*.*"));
    rmdir($demoPath);
}

// Copy necessary files and directories to the demo directory
copyDirectory($sourcePath . 'config', $demoPath . '/config');
copyDirectory($sourcePath . 'css', $demoPath . '/css');
copyDirectory($sourcePath . 'js', $demoPath . '/js');
copyDirectory($sourcePath . 'json', $demoPath . '/json');
copyDirectory($sourcePath . 'lib', $demoPath . '/lib');
copyDirectory($sourcePath . 'logfile', $demoPath . '/logfile');
copyDirectory($sourcePath . 'php', $demoPath . '/php');

echo json_encode(["status" => "success"]);

