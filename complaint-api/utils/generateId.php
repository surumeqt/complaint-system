<?php 

function generateId(string $prefix)
{
    $timestamp = time();
    $randomStr = bin2hex(random_bytes(4));
    return "{$prefix}-{$timestamp}-{$randomStr}";
}