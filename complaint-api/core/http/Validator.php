<?php

namespace Core\Http;

class Validator
{
    /**
     * Validate data against simple field list (legacy support)
     */
    public static function validate(array $data, array $fields): void
    {
        // Missing fields
        foreach ($fields as $field) {
            if (!array_key_exists($field, $data)) {
                throw new \Exception("Missing field: $field", 400);
            }
        }

        // Extra fields
        foreach ($data as $key => $value) {
            if (!in_array($key, $fields)) {
                throw new \Exception("Unexpected field: $key", 400);
            }
        }
    }

    /**
     * Validate data against detailed rules
     * 
     * Example:
     * [
     *     'category_id' => 'required|int|min:1|max:99999',
     *     'title' => 'required|string|min:3|max:255',
     *     'description' => 'required|string|min:10|max:5000'
     * ]
     */
    public static function validateStrict(array $data, array $rules): void
    {
        foreach ($rules as $field => $ruleString) {
            $fieldValue = $data[$field] ?? null;
            $ruleArray = explode('|', $ruleString);

            // Check if field is optional
            $isOptional = in_array('optional', $ruleArray);

            // If optional and field is missing/empty, skip remaining validations
            if ($isOptional && ($fieldValue === null || $fieldValue === '' || $fieldValue === false || (is_array($fieldValue) && empty($fieldValue)))) {
                continue;
            }

            foreach ($ruleArray as $rule) {
                self::applyRule($field, $fieldValue, $rule);
            }
        }

        // Check for extra fields
        foreach ($data as $key => $value) {
            if (!array_key_exists($key, $rules)) {
                throw new \Exception("Unexpected field: $key", 400);
            }
        }
    }

    /**
     * Apply individual validation rule
     */
    private static function applyRule(string $field, mixed $value, string $rule): void
    {
        // Parse rule (e.g., "min:1" -> rule="min", param="1")
        $parts = explode(':', $rule);
        $ruleName = $parts[0];
        $param = $parts[1] ?? null;

        match ($ruleName) {
            'required' => self::validateRequired($field, $value),
            'optional' => self::validateOptional($value),
            'int' => self::validateInt($field, $value),
            'string' => self::validateString($field, $value),
            'email' => self::validateEmail($field, $value),
            'min' => self::validateMin($field, $value, $param),
            'max' => self::validateMax($field, $value, $param),
            'mindigits' => self::validateMinDigits($field, $value, $param),
            'maxdigits' => self::validateMaxDigits($field, $value, $param),
            'notnegative' => self::validateNotNegative($field, $value),
            default => throw new \Exception("Unknown validation rule: $ruleName", 500),
        };
    }

    private static function validateRequired(string $field, mixed $value): void
    {
        if ($value === null || $value === '' || $value === false) {
            throw new \Exception("Field '$field' is required", 400);
        }
    }

    private static function validateOptional(mixed $value): void
    {
        // Optional fields skip all remaining validations if null/empty
        // This is handled by the validateStrict logic below
    }

    private static function validateInt(string $field, mixed $value): void
    {
        if (!is_numeric($value) || (int)$value != $value) {
            throw new \Exception("Field '$field' must be an integer", 400);
        }
    }

    private static function validateString(string $field, mixed $value): void
    {
        if (!is_string($value)) {
            throw new \Exception("Field '$field' must be a string", 400);
        }
    }

    private static function validateEmail(string $field, mixed $value): void
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("Field '$field' must be a valid email", 400);
        }
    }

    private static function validateMin(string $field, mixed $value, ?string $param): void
    {
        if ($param === null) {
            throw new \Exception("Min rule requires a parameter", 500);
        }

        if (is_string($value) && strlen($value) < (int)$param) {
            throw new \Exception("Field '$field' must be at least $param characters", 400);
        }

        if (is_numeric($value) && $value < (int)$param) {
            throw new \Exception("Field '$field' must be at least $param", 400);
        }
    }

    private static function validateMax(string $field, mixed $value, ?string $param): void
    {
        if ($param === null) {
            throw new \Exception("Max rule requires a parameter", 500);
        }

        if (is_string($value) && strlen($value) > (int)$param) {
            throw new \Exception("Field '$field' must be at most $param characters", 400);
        }

        if (is_numeric($value) && $value > (int)$param) {
            throw new \Exception("Field '$field' must be at most $param", 400);
        }
    }

    private static function validateMinDigits(string $field, mixed $value, ?string $param): void
    {
        if ($param === null) {
            throw new \Exception("MinDigits rule requires a parameter", 500);
        }

        $digitCount = strlen((string)abs($value));
        if ($digitCount < (int)$param) {
            throw new \Exception("Field '$field' must have at least $param digit(s)", 400);
        }
    }

    private static function validateMaxDigits(string $field, mixed $value, ?string $param): void
    {
        if ($param === null) {
            throw new \Exception("MaxDigits rule requires a parameter", 500);
        }

        $digitCount = strlen((string)abs($value));
        if ($digitCount > (int)$param) {
            throw new \Exception("Field '$field' must have at most $param digit(s)", 400);
        }
    }

    private static function validateNotNegative(string $field, mixed $value): void
    {
        if (is_numeric($value) && $value < 0) {
            throw new \Exception("Field '$field' cannot be negative", 400);
        }
    }
}