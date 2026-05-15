<?php

namespace Core\Http;

class Router
{
    private static array $routes = [];

    public static function add(
        string $method,
        string $path,
        array $handler,
        array $validation = [],
        array $roles = []
    ): void {
        self::$routes[] = [
            'method' => $method,
            'path' => trim($path, '/'),
            'handler' => $handler,
            'validation' => $validation,
            'roles' => $roles
        ];
    }

    public static function match(Request $request): array
    {
        foreach (self::$routes as $route) {

            if ($route['method'] !== $request->method()) continue;

            $pattern = preg_replace('#\{([^}]+)\}#', '([^/]+)', $route['path']);
            $pattern = "#^$pattern$#";

            if (preg_match($pattern, $request->uri(), $matches)) {

                array_shift($matches);

                preg_match_all('#\{([^}]+)\}#', $route['path'], $keys);

                $params = [];
                foreach ($keys[1] as $i => $key) {
                    $params[$key] = $matches[$i];
                }

                $request->setParams($params);

                return $route;
            }
        }

        throw new \Exception("Route not found");
    }

    public static function dispatch(Request $request, array $route)
    {
        [$controller, $method] = $route['handler'];
        return (new $controller())->$method($request);
    }

    public static function run(Request $request, array $middlewares)
    {
        // Define the innermost core: Matching and Dispatching
        $coreExecution = function ($request) use ($middlewares) {
            // Match the route ONLY after global middlewares (CORS) have passed
            $route = self::match($request);
            $request->setRoute($route);

            // Now that we have a route, build the rest of the pipeline 
            return self::buildPipeline($request, $middlewares);
        };

        // Wrap the core with the CORS middleware specifically
        // This ensures CORS headers are set even if match() fails later
        try {
            $cors = new \Middlewares\CorsMiddleware();
            
            return $cors->handle($request, $coreExecution);

        } catch (\Exception $e) {
            return \Core\Http\Response::json([
                'success' => false,
                'message' => $e->getMessage()
            ], $e->getCode() ?: 400);
        }
    }

    /**
     * Helper to build the pipeline for the remaining middlewares
     */
    private static function buildPipeline(Request $request, array $middlewares)
    {
        $runner = function ($request) {
            return self::dispatch($request, $request->route);
        };

        // Filter out CorsMiddleware if it's in the array to avoid double-running
        $remainingMiddlewares = array_filter($middlewares, function($m) {
            return !($m instanceof \Middlewares\CorsMiddleware);
        });

        $pipeline = array_reduce(
            array_reverse($remainingMiddlewares),
            function ($next, $middleware) {
                return function ($request) use ($middleware, $next) {
                    return $middleware->handle($request, $next);
                };
            },
            $runner
        );

        return $pipeline($request);
    }
}