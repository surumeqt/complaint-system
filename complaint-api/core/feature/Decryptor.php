<?php

namespace Core\Feature;

class Decryptor
{
    public static function Decrypt(array $data) 
    {
        $key = hex2bin($_ENV['AES_SECRET_KEY']);

        foreach ($data as $keyName => $value) {
            // If the value is an array, we need to check if it's a [cipher, iv, tag] triplet
            // OR if it's just another nested data array (like your 'data' key)
            if (is_array($value)) {
                if (isset($value['cipher'], $value['iv'], $value['tag'])) {
                    // This is a triplet - Decrypt it
                    $cipher = rtrim($value['cipher'], "\0");
                    $iv = $value['iv'];
                    $tag = $value['tag'];

                    $decrypted = openssl_decrypt(
                        $cipher,
                        'aes-256-gcm',
                        $key,
                        OPENSSL_RAW_DATA,
                        $iv,
                        $tag
                    );

                    $data[$keyName] = ($decrypted !== false) ? $decrypted : "[Decryption Failed]";
                } else {
                    // This is a nested array (like 'data') - Recurse into it
                    $data[$keyName] = self::Decrypt($value);
                }
            }
        }

        return $data;
    }
}