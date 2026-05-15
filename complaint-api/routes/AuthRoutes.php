<?php

use Core\Http\Router;
use Controllers\AuthController;

Router::add(
    'POST',
    '/api/auth/register',
    [AuthController::class, 'register'],
    [
        'name' => 'required|string|min:2|max:100',
        'email' => 'required|email',
        'password' => 'required|string|min:6|max:255'
    ],
    []
);

Router::add(
    'POST',
    '/api/auth/login',
    [AuthController::class, 'login'],
    [
        'email' => 'required|email',
        'password' => 'required|string'
    ],
    []
);

Router::add(
    'POST',
    '/api/auth/logout',
    [AuthController::class, 'logout'],
    [],
    ['user','admin'] // must be logged in
);