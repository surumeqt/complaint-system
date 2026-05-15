<?php

namespace Middlewares;

use Core\Http\Request;
use Core\Feature\Encryptor;
use Core\Feature\Decryptor;

class FeatureMiddleware
{
    public function handle(Request $request, callable $next)
    {
        // INCOMING → ENCRYPT
        $data = $request->all();

        if (!empty($data)) {
            $encrypted = Encryptor::Encrypt($data);
            $request->merge($encrypted);
        }

        // CONTROLLER EXECUTION
        $response = $next($request);

        // OUTGOING → DECRYPT
        if (is_array($response)) {
            $response = Decryptor::Decrypt($response);
        }

        return $response;
    }
}