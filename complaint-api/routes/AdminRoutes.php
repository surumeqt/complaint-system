<?php

use Core\Http\Router;
use Controllers\ComplaintController;
use Controllers\ReportController;

Router::add(
    'PUT',
    '/api/complaints/{complaint_id}/status',
    [ComplaintController::class, 'UpdateComplaintStatus'],
    [
        'status' => 'required|string|min:3|max:20'
    ],
    ['admin']
);

Router::add(
    'POST',
    '/api/complaints/{complaint_id}/response',
    [ComplaintController::class, 'CreateComplaintResponse'],
    [
        'response' => 'required|string|min:5|max:5000'
    ],
    ['admin']
);

Router::add(
    'GET',
    '/api/admin/complaints',
    [ComplaintController::class, 'GetAllComplaints'],
    [],
    ['admin']
);

Router::add(
    'GET',
    '/api/reports/complaint-category',
    [ReportController::class, 'GetComplaintCategoryReport'],
    [],
    ['admin']
);

Router::add(
    'GET',
    '/api/reports/resolution-status',
    [ReportController::class, 'GetResolutionStatusReport'],
    [],
    ['admin']
);