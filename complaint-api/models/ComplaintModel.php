<?php

namespace Models;

use Config\DatabaseConfig;
use PDO;

class ComplaintModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = DatabaseConfig::getConnection();
    }

    public function create(array $data)
    {
        $sql = "INSERT INTO complaints (
                    complaint_id, usr_id, category_id, title, 
                    description_ciphertext, description_iv, description_tag, attachment_path
                ) VALUES (
                    :id, :usr_id, :cat_id, :title, 
                    :desc_cipher, :desc_iv, :desc_tag, :attachment_path
                )";

        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':id'               => $data['complaint_id'],
            ':usr_id'           => $data['usr_id'],
            ':cat_id'           => $data['category_id'],
            ':title'            => $data['title'],
            ':desc_cipher'      => $data['description']['cipher'] ?? null,
            ':desc_iv'          => $data['description']['iv'] ?? null,
            ':desc_tag'         => $data['description']['tag'] ?? null,
            ':attachment_path'  => $data['attachment_path'] ?? null,
        ]);
    }

    public function getDashboardStats(string $userId)
    {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
                FROM complaints 
                WHERE usr_id = :user_id";
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getRecentActivity(string $userId, int $limit = 5)
    {
        $sql = "SELECT 
                    c.complaint_id, 
                    c.title, 
                    c.status, 
                    c.created_at,
                    cat.name as category_name
                FROM complaints c
                JOIN categories cat ON c.category_id = cat.category_id
                WHERE c.usr_id = :user_id
                ORDER BY c.created_at DESC
                LIMIT :limit";
                
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':user_id', $userId);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(string $complaintId)
    {
        $sql = "SELECT 
                    c.complaint_id,
                    c.usr_id,
                    c.category_id,
                    c.title AS complaint_title,
                    c.description_ciphertext,
                    c.description_iv,
                    c.description_tag,
                    c.status AS complaint_status,
                    c.created_at AS complaint_created_at,
                    cat.name AS category_name,
                    -- Admin Response Encryption Fields
                    cr.response_ciphertext,
                    cr.response_iv,
                    cr.response_tag,
                    cr.created_at AS response_created_at,
                    u.usr_name AS admin_name
                FROM complaints c
                JOIN categories cat ON c.category_id = cat.category_id
                LEFT JOIN complaint_responses cr ON c.complaint_id = cr.complaint_id
                LEFT JOIN users u ON cr.admin_id = u.usr_id
                WHERE c.complaint_id = :complaint_id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':complaint_id' => $complaintId]); 
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->formatFindByComplaintIdRow($row) : null;
    }

    private function formatFindByComplaintIdRow(array $row): array
    {
        return [
            'complaint_id'   => $row['complaint_id'],
            'user_id'        => $row['usr_id'],
            'category_id'    => $row['category_id'],
            'category_name'  => $row['category_name'],
            'title'          => $row['complaint_title'],
            'status'         => $row['complaint_status'],
            'created_at'     => $row['complaint_created_at'],
            
            // Encrypted Description Object
            'description' => $row['description_ciphertext'] ? [
                'cipher' => $row['description_ciphertext'],
                'iv'     => $row['description_iv'],
                'tag'    => $row['description_tag']
            ] : null,

            // Encrypted Admin Response Object
            'response' => $row['response_ciphertext'] ? [
                    'cipher' => $row['response_ciphertext'],
                    'iv'     => $row['response_iv'],
                    'tag'    => $row['response_tag']
            ] : null,
            'admin_name' => $row['admin_name'],
            'replied_at' => $row['response_created_at']
        ];
    }

    public function findByUserId(string $userId)
    {
        $sql = "SELECT c.*, cat.name as category_name 
                FROM complaints c
                JOIN categories cat ON c.category_id = cat.category_id
                WHERE c.usr_id = :usr_id 
                ORDER BY c.created_at DESC";
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':usr_id' => $userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'formatFindUserIdRow'], $rows);
    }

    private function formatFindUserIdRow(array $row): array
    {
        $formatted = [
            'complaint_id'  => $row['complaint_id'],
            'category_name' => $row['category_name'] ?? 'Uncategorized',
            'title'         => $row['title'],
            'status'        => $row['status'],
            'created_at'    => $row['created_at'],
        ];

        return $formatted;
    }

    public function updateStatus(string $complaintId, string $newStatus, string $oldStatus, string $adminId)
    {
        try {
            $this->db->beginTransaction();

            // 1. Update the status
            $sql = "UPDATE complaints SET status = :status WHERE complaint_id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':status' => $newStatus, ':id' => $complaintId]);

            // 2. Log the change
            $sqlLog = "INSERT INTO complaint_status_logs (complaint_id, changed_by, old_status, new_status) 
                       VALUES (:id, :admin, :old, :new)";
            $stmtLog = $this->db->prepare($sqlLog);
            $stmtLog->execute([
                ':id'    => $complaintId,
                ':admin' => $adminId,
                ':old'   => $oldStatus,
                ':new'   => $newStatus
            ]);

            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Saves an admin response (Encrypted via Middleware)
     */
    public function saveResponse(array $data)
    {
        $sql = "INSERT INTO complaint_responses (
                    response_id, complaint_id, admin_id, 
                    response_ciphertext, response_iv, response_tag
                ) VALUES (
                    :res_id, :cmp_id, :admin_id, 
                    :cipher, :iv, :tag
                )";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':res_id'   => $data['response_id'],
            ':cmp_id'   => $data['complaint_id'],
            ':admin_id' => $data['admin_id'],
            ':cipher'   => $data['response']['cipher'],
            ':iv'       => $data['response']['iv'],
            ':tag'      => $data['response']['tag']
        ]);
    }

    public function findAll()
    {
        $sql = "SELECT c.*, u.usr_name, cat.name as category_name 
                FROM complaints c
                JOIN users u ON c.usr_id = u.usr_id
                JOIN categories cat ON c.category_id = cat.category_id
                ORDER BY c.created_at DESC";
                
        $stmt = $this->db->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'formatRow'], $rows);
    }

    private function formatRow(array $row): array
    {
        return [
            'complaint_id' => $row['complaint_id'],
            'usr_id'       => $row['usr_id'],
            'category_id'  => $row['category_id'],
            'title'        => $row['title'],
            'status'       => $row['status'],
            'created_at'   => $row['created_at'],
            'description'  => $row['description_ciphertext'] ? [
                'cipher' => $row['description_ciphertext'],
                'iv'     => $row['description_iv'],
                'tag'    => $row['description_tag']
            ] : null
        ];
    }

    public function getAllCategories()
    {
        $sql = "SELECT category_id, name FROM categories ORDER BY name ASC";
        $stmt = $this->db->query($sql);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(function($row) {
            return [
                'category_id' => $row['category_id'],
                'name' => $row['name']
            ];
        }, $res);
    }
}