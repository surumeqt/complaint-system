<?php

namespace Config;

class ConfigSensitiveFields
{
    public static function getFieldsToEncrypt(): array
    {
        return [
            'email',
            'phone_number',
            'description',
            'response'
        ];
    }
}