<?php

namespace Controllers;

use Core\Http\Request;
use Models\ComplaintModel;

class ComplaintController
{
    private ComplaintModel $complaintModel;

    public function __construct()
    {
        $this->complaintModel = new ComplaintModel();
    }

    /**
     * POST /api/complaints
     */
    public function CreateComplaint(Request $request)
    {
        $data = $request->all();
        $userId = $request->user('usr_id');
        
        $complaintData = [
            'complaint_id' => generateId('CMP'),
            'usr_id'       => $userId,
            'category_id'  => $data['category_id'],
            'title'        => $data['title'],
            'description'  => $data['description']
        ];

        $this->complaintModel->create($complaintData);

        return [
            'success' => true,
            'message' => 'Complaint submitted successfully',
            'complaint_id' => $complaintData['complaint_id']
        ];
    }

    /**
     * GET /api/complaints/categories/all
     */
    public function GetComplaintCategories()
    {
        $categories = $this->complaintModel->getAllCategories();

        return [
            'success' => true,
            'data' => $categories
        ];
    }

    /**
     * GET /api/complaints/{complaint_id}
     */
    public function GetComplaintByComplaintId(Request $request)
    {
        $id = $request->params('complaint_id');
        $complaint = $this->complaintModel->findById($id);

        if (!$complaint) {
            throw new \Exception("Complaint not found", 404);
        }

        return [
            'success' => true,
            'data' => $complaint
        ];
    }

    /**
     * GET /api/complaints/user/{user_id}
     */
    public function GetUserComplaintsByUserId(Request $request)
    {
        $targetUserId = $request->params('user_id');

        // Security: Users can only view their own complaints
        if ($request->user('usr_id') !== $targetUserId) {
            throw new \Exception("Forbidden: You cannot view other users' complaints", 403);
        }

        $complaints = $this->complaintModel->findByUserId($targetUserId);

        return [
            'success' => true,
            'count' => count($complaints),
            'data' => $complaints
        ];
    }

    /**
     * PUT /api/complaints/{complaint_id}/status
     */
    public function UpdateComplaintStatus(Request $request)
    {
        $complaintId = $request->params('complaint_id');
        $newStatus = $request->input('status');
        $adminId = $request->user('usr_id');

        // Validate allowed statuses based on your ENUM
        $allowed = ['pending', 'in_progress', 'resolved', 'rejected'];
        if (!in_array($newStatus, $allowed)) {
            throw new \Exception("Invalid status. Allowed: " . implode(', ', $allowed), 400);
        }

        $complaint = $this->complaintModel->findById($complaintId);
        if (!$complaint) throw new \Exception("Complaint not found", 404);

        $this->complaintModel->updateStatus($complaintId, $newStatus, $complaint['status'], $adminId);

        return [
            'success' => true,
            'message' => "Status updated from {$complaint['status']} to $newStatus"
        ];
    }

    /**
     * POST /api/complaints/{complaint_id}/response
     */
    public function CreateComplaintResponse(Request $request)
    {
        $complaintId = $request->params('complaint_id');
        $responseText = $request->input('response'); // This is already an array [cipher, iv, tag]
        $adminId = $request->user('usr_id');

        // Verify complaint exists
        $complaint = $this->complaintModel->findById($complaintId);
        if (!$complaint) throw new \Exception("Complaint not found", 404);

        $responseId = generateId('RES'); // Assuming your ID generator handles 'RES'

        $this->complaintModel->saveResponse([
            'response_id'  => $responseId,
            'complaint_id' => $complaintId,
            'admin_id'     => $adminId,
            'response'     => $responseText
        ]);

        return [
            'success' => true,
            'message' => 'Response recorded successfully',
            'response_id' => $responseId
        ];
    }

    /**
     * GET /api/admin/complaints
     */
    public function GetAllComplaints(Request $request)
    {
        $complaints = $this->complaintModel->findAll();

        return [
            'success' => true,
            'count' => count($complaints),
            'data' => $complaints
        ];
    }

    public function getDashboardData(Request $request)
    {
        $userId = $request->user('usr_id');
        
        return [
            'success' => true,
            'data' => [
                'stats' => $this->complaintModel->getDashboardStats($userId),
                'recent' => $this->complaintModel->getRecentActivity($userId)
            ]
        ];
    }
}