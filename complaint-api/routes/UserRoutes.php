<?php

use Core\Http\Router;
use Controllers\UserController;
use Controllers\ComplaintController;

Router::add(
    'GET',
    '/api/users/profile',
    [UserController::class, 'getProfile'],
    [],
    ['user', 'admin']
);

Router::add(
    'GET',
    '/api/users/dashboard',
    [ComplaintController::class, 'getDashboardData'],
    [],
    ['user']
);

Router::add(
    'PUT',
    '/api/users/profile',
    [UserController::class, 'updateProfile'],
    [
        'name' => 'required|string|min:2|max:100',
        'phone_number' => 'required|string|min:7|max:20'
    ],
    ['user', 'admin']
);