<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ea = isset($_POST['ea']) ? $_POST['ea'] : 'default';
    $filePath = __DIR__ . "/../logfile/{$ea}_ea_settings.json";
    $logPath = __DIR__ . "/../settings/{$ea}_ea_settings_history.log";

    $currentSettings = file_exists($filePath) ? json_decode(file_get_contents($filePath), true) : [];

    if (!empty($currentSettings)) {
        $logMessage = '[' . date('Y-m-d H:i:s') . '] ' . json_encode($currentSettings) . PHP_EOL;
        file_put_contents($logPath, $logMessage, FILE_APPEND);
    }

    $newSettings = [
        'FastMAPeriod' => $_POST['FastMAPeriod'],
        'SlowMAPeriod' => $_POST['SlowMAPeriod'],
        'TakeProfit' => $_POST['TakeProfit'],
        'TakeProfitCP' => $_POST['TakeProfitCP'],
        'StopLoss' => $_POST['StopLoss'],
        'StopLossCP' => $_POST['StopLossCP'],
        'CounterOrderDistance' => $_POST['CounterOrderDistance'],
        'CounterPositionCoefficient' => $_POST['CounterPositionCoefficient'],
        'EquityRiskPercentage' => $_POST['EquityRiskPercentage'],
        'TrailingStop' => $_POST['TrailingStop'],
        'NPA' => 1
    ];

    file_put_contents($filePath, json_encode($newSettings));

    header('Location: ../main.html');
    exit;
}

