<?php

namespace Core\Http;

class Request
{
    private array $data = [];
    private array $params = [];
    public array $route = [];
    public array $user = [];

    public function __construct()
    {
        $this->parse();
    }

    private function parse(): void
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $this->data = $input ?? [];
    }

    public function all(): array
    {
        return $this->data;
    }

    public function input(string $key)
    {
        return $this->data[$key] ?? null;
    }

    public function merge(array $data): void
    {
        $this->data = $data;
    }

    public function setParams(array $params): void
    {
        $this->params = $params;
    }

    public function params(?string $key = null)
    {
        if ($key === null) return $this->params;
        
        if (!isset($this->params[$key])) {
            throw new \Exception("Route parameter '$key' is missing or undefined in the route structure.");
        }
        
        return $this->params[$key];
    }

    public function user(?string $key = null)
    {
        if ($key === null) return $this->user;
        if (!isset($this->user[$key])) {
            throw new \Exception("User attribute '$key' not found in token.", 500);
        }
        return $this->user[$key];
    }

    public function method(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function uri(): string
    {
        return trim($_GET['params'] ?? '', '/');
    }

    public function setRoute(array $route): void
    {
        $this->route = $route;
    }
}