<?php

namespace Models;

use Config\DatabaseConfig;
use PDO;

class ReportModel
{
    private PDO $db;

    public function __construct() {
        $this->db = DatabaseConfig::getConnection();
    }

    /**
     * Data for Pie Chart: Complaints per Category
     */
    public function getCountByCategory()
    {
        $sql = "SELECT cat.name, COUNT(c.complaint_id) as total
                FROM categories cat
                LEFT JOIN complaints c ON cat.category_id = c.category_id
                GROUP BY cat.category_id
                ORDER BY total DESC";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Data for Status Overview: Pending vs Resolved etc.
     */
    public function getStatusDistribution()
    {
        $sql = "SELECT status, COUNT(*) as count 
                FROM complaints 
                GROUP BY status";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
}