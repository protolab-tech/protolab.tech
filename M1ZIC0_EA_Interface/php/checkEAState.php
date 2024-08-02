<?php
header('Content-Type: application/json');

$ea = isset($_GET['ea']) ? $_GET['ea'] : 'default';
$filePath = __DIR__ . "/{$ea}_ea_control.json";

if (file_exists($filePath)) {
    $data = json_decode(file_get_contents($filePath), true);
    echo json_encode(['running' => $data['running']]);
} else {
    echo json_encode(['running' => false]);
}
