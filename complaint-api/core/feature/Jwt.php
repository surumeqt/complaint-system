<?php 

namespace Core\Feature;

class JWT {
    private static function getSecret() {
        return $_ENV['JWT_SECRET_KEY'];
    }

    public static function setCookie(string $token, $expiry = 3600) {
        setcookie("token", $token, [
            'expires' => time() + $expiry,
            'path' => '/',
            'domain' => '', // domain in production
            'secure' => isset($_SERVER['HTTPS']), // True if using HTTPS
            'httponly' => true,  // Prevents JS access
            'samesite' => 'Lax'  // CSRF protection layer
        ]);
    }

    public static function clearCookie() {
        setcookie("token", "", [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }

    public static function encode(array $payload) {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        // expiration 1 hour from now
        $payload['iat'] = time();
        $payload['exp'] = time() + 3600;

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::getSecret(), true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;

        [$header, $payload, $signature] = $parts;

        // Verify Signature
        $validSignature = hash_hmac('sha256', $header . "." . $payload, self::getSecret(), true);
        if (!hash_equals(self::base64UrlEncode($validSignature), $signature)) {
            return false;
        }

        $payloadData = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
        
        // Check Expiration
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return false;
        }

        return $payloadData;
    }

    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }
}