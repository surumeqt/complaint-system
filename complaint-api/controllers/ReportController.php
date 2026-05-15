<?php

namespace Controllers;

use Core\Http\Request;
use Models\ReportModel;

class ReportController
{
    private ReportModel $reportModel;

    public function __construct() {
        $this->reportModel = new ReportModel();
    }

    /**
     * GET /api/reports/complaint-category
     */
    public function GetComplaintCategoryReport(Request $request)
    {
        $data = $this->reportModel->getCountByCategory();
        return [
            'success' => true,
            'report_type' => 'complaints_by_category',
            'data' => $data
        ];
    }

    /**
     * GET /api/user/complaint-categories
     */
    public function GetAllCategoryForUser(Request $request)
    {
        $data = $this->reportModel->getCountByCategory();
        return [
            'success' => true,
            'report_type' => 'complaints_by_category',
            'data' => $data
        ];
    }

    /**
     * GET /api/reports/resolution-status
     */
    public function GetResolutionStatusReport(Request $request)
    {
        $data = $this->reportModel->getStatusDistribution();
        return [
            'success' => true,
            'report_type' => 'resolution_status_distribution',
            'data' => $data
        ];
    }
}