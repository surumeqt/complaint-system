<?php

namespace Middlewares;

use Core\Http\Request;
use Core\Http\Response;

class ErrorMiddleware
{
    public function handle(Request $request, callable $next)
    {
        try {
            return $next($request);
        } catch (\Exception $e) {
            Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}