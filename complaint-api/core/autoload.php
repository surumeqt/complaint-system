<?php

$env = parse_ini_file(__DIR__ . '/../.env');
foreach ($env as $key => $value) {
    $_ENV[$key] = $value;
}

foreach (glob(__DIR__ . '/../utils/*.php') as $helper) {
    require_once $helper;
}

spl_autoload_register(function (string $class) {

    $baseDir = realpath(__DIR__ . '/../') . DIRECTORY_SEPARATOR;

    // Normalize class name
    $class = ltrim($class, '\\');

    // Convert namespace to path
    $file = $baseDir
        . str_replace('\\', DIRECTORY_SEPARATOR, $class)
        . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});