<?php

require_once __DIR__ . '/core/autoload.php';

use Core\Http\Request;
use Core\Http\Router;
use Core\Http\Response;

use Middlewares\ErrorMiddleware;
use Middlewares\CorsMiddleware;
use Middlewares\FeatureMiddleware;
use Middlewares\AuthMiddleware;

// Load routes
require_once __DIR__ . '/routes/AuthRoutes.php';
require_once __DIR__ . '/routes/UserRoutes.php';
require_once __DIR__ . '/routes/ComplaintRoutes.php';
require_once __DIR__ . '/routes/AdminRoutes.php';

// Initialize request
$request = new Request();

// Define middleware stack
$middlewares = [
    new ErrorMiddleware(),
    new CorsMiddleware(),
    new AuthMiddleware(),
    new FeatureMiddleware(),
];

// Execute pipeline
$response = Router::run($request, $middlewares);

// var_dump($response); // For debugging purposes

// Final output
Response::json($response);