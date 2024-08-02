<?php
$ea = isset($_POST['ea']) ? $_POST['ea'] : 'default';
$filePath = __DIR__ . "/{$ea}_ea_control.json";

if (!file_exists($filePath)) {
    $data = ['running' => false];
    file_put_contents($filePath, json_encode($data));
} else {
    $data = json_decode(file_get_contents($filePath), true);
    $data['running'] = !$data['running'];
    file_put_contents($filePath, json_encode($data));
}

header('Location: ../main.html');
exit;

