<?php

namespace Middlewares;

use Core\Http\Request;
use Core\Http\Validator;
use Core\Feature\JWT;

class AuthMiddleware
{
    public function handle(Request $request, callable $next)
    {
        $route = $request->route;

        // VALIDATION
        if (!empty($route['validation'])) {
            // Detect if using new strict validation (associative array with pipe-separated rules)
            // or old simple validation (indexed array of field names)
            if (self::isStrictValidation($route['validation'])) {
                Validator::validateStrict($request->all(), $route['validation']);
            } else {
                Validator::validate($request->all(), $route['validation']);
            }
        }

        // AUTH & ROLE CHECK
        // If 'roles' is not empty, it means the route is protected
        if (!empty($route['roles'])) {

            $token = $_COOKIE['token'] ?? null;

            if (!$token) {
                throw new \Exception("Authentication required", 401);
            }

            $payload = JWT::decode($token);

            if (!$payload) {
                throw new \Exception("Invalid or expired token", 401);
            }

            if (!in_array($payload['role'], $route['roles'])) {
                throw new \Exception("Forbidden: You do not have the required permissions", 403);
            }
            
            // Attach user data to request for use in controllers
            $request->user = $payload;
        }

        return $next($request);
    }

    /**
     * Detect if validation array uses new strict format
     * (associative array with pipe-separated rules) or old simple format (indexed array)
     */
    private static function isStrictValidation(array $validation): bool
    {
        // If empty, use old format
        if (empty($validation)) {
            return false;
        }

        // Check if keys are strings (strict format) or all numeric (simple format)
        $keys = array_keys($validation);
        $isAssociative = !empty(array_filter($keys, 'is_string'));
        
        return $isAssociative;
    }
}