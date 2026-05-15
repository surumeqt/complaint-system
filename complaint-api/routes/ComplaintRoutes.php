<?php

use Core\Http\Router;
use Controllers\ComplaintController;

Router::add(
    'POST',
    '/api/complaints',
    [ComplaintController::class, 'CreateComplaint'],
    [
        'category_id' => 'required|int|notnegative|mindigits:1|maxdigits:5',
        'title' => 'required|string|min:3|max:255',
        'description' => 'required|string|min:10|max:2000',
    ],
    ['user']
);

Router::add(
    'GET',
    '/api/complaints/{complaint_id}',
    [ComplaintController::class, 'GetComplaintByComplaintId'],
    [],
    ['user', 'admin']
);

Router::add(
    'GET',
    '/api/complaints/user/{user_id}',
    [ComplaintController::class, 'GetUserComplaintsByUserId'],
    [],
    ['user']
);

Router::add(
    'GET',
    '/api/complaints/categories/all',
    [ComplaintController::class, 'GetComplaintCategories'],
    [],
    ['user']
);