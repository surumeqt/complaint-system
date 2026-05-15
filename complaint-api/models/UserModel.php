<?php

namespace Models;

use Config\DatabaseConfig;
use PDO;

class UserModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = DatabaseConfig::getConnection();
    }

    public function create(array $data)
    {
        $sql = "INSERT INTO users (
            usr_id,
            usr_name,
            email_hash,
            email_ciphertext,
            email_iv,
            email_tag,
            usr_password
        ) VALUES (
            :usr_id,
            :usr_name,
            :email_hash,
            :email_cipher,
            :email_iv,
            :email_tag,
            :password
        )";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            ':usr_id' => $data['usr_id'],
            ':usr_name' => $data['usr_name'],
            ':email_hash' => $data['email_hash'],
            ':email_cipher' => $data['email']['cipher'],
            ':email_iv' => $data['email']['iv'],
            ':email_tag' => $data['email']['tag'],
            ':password' => $data['password']
        ]);
    }

    public function findByEmailHash(string $emailHash)
    {
        $sql = "SELECT * FROM users WHERE email_hash = :email_hash LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email_hash' => $emailHash]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById(string $id)
    {
        $sql = "SELECT * FROM users WHERE usr_id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $this->formatEncryptedFields($user) : null;
    }

    private function formatEncryptedFields(array $user): array
    {
        return [
            'usr_name' => $user['usr_name'],
            'role'     => $user['usr_role'],
            'created_at' => $user['created_at'],
            'email' => [
                'cipher' => $user['email_ciphertext'],
                'iv'     => $user['email_iv'],
                'tag'    => $user['email_tag']
            ],
            'phone_number' => $user['phone_ciphertext'] ? [
                'cipher' => $user['phone_ciphertext'],
                'iv'     => $user['phone_iv'],
                'tag'    => $user['phone_tag']
            ] : 'No phone number provided Yet!'
        ];
    }

    public function update(string $id, array $data)
    {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "$key = :$key, ";
        }
        $fields = rtrim($fields, ", ");

        $sql = "UPDATE users SET $fields WHERE usr_id = :usr_id";
        $stmt = $this->db->prepare($sql);
        $data['usr_id'] = $id;
        return $stmt->execute($data);
    }
}