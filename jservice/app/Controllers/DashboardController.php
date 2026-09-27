<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;

class DashboardController extends BaseController
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $today = date('Y-m-d');

        // Fetch Live KPIs
        $receptionsToday = (int) Database::selectOne(
            "SELECT COUNT(*) as cnt FROM js_jobs WHERE DATE(created_at) = :d AND deleted_at IS NULL",
            [':d' => $today]
        )['cnt'];

        $inRepairCount = (int) Database::selectOne(
            "SELECT COUNT(*) as cnt FROM js_jobs WHERE current_status IN ('assigned_to_tech', 'in_repair', 'waiting_for_parts', 'in_qc') AND deleted_at IS NULL"
        )['cnt'];

        $readyDeliveryCount = (int) Database::selectOne(
            "SELECT COUNT(*) as cnt FROM js_jobs WHERE current_status = 'waiting_for_dispatch' AND deleted_at IS NULL"
        )['cnt'];

        $criticalPartsCount = (int) Database::selectOne(
            "SELECT COUNT(*) as cnt FROM js_parts WHERE current_stock <= min_stock"
        )['cnt'];

        $recentJobs = Database::select(
            "SELECT j.*, c.name as customer_name, c.mobile as customer_mobile, p.name as product_name, p.model 
             FROM js_jobs j
             LEFT JOIN js_customers c ON j.customer_id = c.id
             LEFT JOIN js_products p ON j.product_id = p.id
             WHERE j.deleted_at IS NULL
             ORDER BY j.id DESC LIMIT 8"
        );

        return $this->view('dashboard.index', [
            'user'               => $user,
            'receptionsToday'    => $receptionsToday,
            'inRepairCount'      => $inRepairCount,
            'readyDeliveryCount' => $readyDeliveryCount,
            'criticalPartsCount' => $criticalPartsCount,
            'recentJobs'         => $recentJobs,
        ]);
    }
}
