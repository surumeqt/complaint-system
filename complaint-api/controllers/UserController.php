<?php

namespace Controllers;

use Core\Http\Request;
use Models\UserModel;

class UserController
{
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function getProfile(Request $request)
    {
        $id = $request->user('usr_id');
        $user = $this->userModel->findById($id);

        if (!$user) throw new \Exception("User not found", 404);

        return [
            'success' => true,
            'id' => $id,
            'name' => $user['usr_name'],
            'email' => $user['email'],
            'phone_number' => $user['phone_number'],
            'role' => $user['role'],
            'created_at' => $user['created_at']
        ];
    }

    public function updateProfile(Request $request)
    {
        $userId = $request->user('usr_id');
        $input = $request->all(); // Middleware already encrypted 'email', 'phone_number', etc.

        $updateData = [];
        if (isset($input['name'])) $updateData['usr_name'] = $input['name'];
        
        if (isset($input['phone_number'])) {
            $updateData['phone_ciphertext'] = $input['phone_number']['cipher'];
            $updateData['phone_iv'] = $input['phone_number']['iv'];
            $updateData['phone_tag'] = $input['phone_number']['tag'];
        }

        if (empty($updateData)) throw new \Exception("No changes provided", 400);

        $this->userModel->update($userId, $updateData);

        return [
            'success' => true,
            'message' => 'Profile updated successfully'
        ];
    }
}