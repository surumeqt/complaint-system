<?php

namespace Controllers;

use Core\Http\Request;
use Core\Feature\JWT;
use Core\Feature\Decryptor;
use Models\UserModel;

class AuthController
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    // REGISTER
    public function register(Request $request)
    {
        $data = $request->all();

        // decrypt email for hashing
        $emailPlain = trim(strtolower(
            Decryptor::Decrypt(['email' => $data['email']])['email']
        ));

        $emailHash = hash('sha256', $emailPlain);

        $user = $this->userModel->findByEmailHash($emailHash);

        if ($user) {
            throw new \Exception("User already exists!");
        }

        // hash password
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

        $userData = [
            'usr_id' => generateId('USR'),
            'usr_name' => $data['name'],
            'email_hash' => $emailHash,
            'email' => $data['email'],
            'password' => $passwordHash
        ];

        $this->userModel->create($userData);

        return [
            'success' => true,
            'message' => 'User registered successfully'
        ];
    }

    // LOGIN
    public function login(Request $request)
    {
        $data = $request->all();

        // decrypt email
        $emailPlain = trim(strtolower(
            Decryptor::Decrypt(['email' => $request->input('email')])['email']
        ));
        $emailHash = hash('sha256', $emailPlain);

        $user = $this->userModel->findByEmailHash($emailHash);

        if (!$user) {
            throw new \Exception("Invalid credentials!");
        }

        if (!password_verify($data['password'], $user['usr_password'])) {
            throw new \Exception("Invalid credentials");
        }

        // generate JWT
        $token = JWT::encode([
            'usr_id' => $user['usr_id'],
            'role' => $user['usr_role']
        ]);

        JWT::setCookie($token);

        return [
            'success' => true,
            'message' => 'Login successful',
            'role' => $user['usr_role']
        ];
    }

    // LOGOUT
    public function logout()
    {
        JWT::clearCookie();

        return [
            'success' => true,
            'message' => 'Logged out successfully'
        ];
    }
}