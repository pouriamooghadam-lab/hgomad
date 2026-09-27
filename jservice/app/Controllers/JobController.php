<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Models\Job;
use App\Services\WorkflowService;

class JobController extends BaseController
{
    public function index(Request $request): Response
    {
        $status = $request->input('status');
        $search = $request->input('q');

        $sql = "SELECT j.*, c.name as customer_name, c.mobile as customer_mobile,
                       s.serial_number, u.name as technician_name, b.name as branch_name
                FROM js_jobs j
                LEFT JOIN js_customers c ON j.customer_id = c.id
                LEFT JOIN js_serials s ON j.serial_id = s.id
                LEFT JOIN js_users u ON j.assigned_technician_id = u.id
                LEFT JOIN js_branches b ON j.branch_id = b.id
                WHERE j.deleted_at IS NULL";

        $params = [];
        if (!empty($status) && $status !== 'all') {
            $sql .= " AND j.current_status = :st";
            $params[':st'] = $status;
        }
        if (!empty($search)) {
            $sql .= " AND (j.tracking_code LIKE :q OR s.serial_number LIKE :q OR c.name LIKE :q OR c.mobile LIKE :q)";
            $params[':q'] = "%{$search}%";
        }

        $sql .= " ORDER BY j.id DESC LIMIT 100";
        $jobs = Database::select($sql, $params);
        $technicians = Database::select("SELECT * FROM js_users WHERE role = 'technician' AND is_active = 1");

        return $this->view('jobs.index', [
            'jobs'        => $jobs,
            'technicians' => $technicians,
            'status'      => $status,
            'search'      => $search
        ]);
    }

    public function show(Request $request, array $params): Response
    {
        $id = $params['id'] ?? 0;
        $job = Job::find((int) $id);
        if (!$job) {
            Session::flash('error', 'پرونده مورد نظر یافت نشد.');
            return $this->redirect('/jobs');
        }

        $customer = $job->customer();
        $serial = $job->serial();
        $timeline = $job->logs();
        $technicians = Database::select("SELECT * FROM js_users WHERE role = 'technician' AND is_active = 1");
        $parts = Database::select("SELECT * FROM js_parts WHERE current_stock > 0 ORDER BY name ASC");

        return $this->view('jobs.show', [
            'job'         => $job,
            'customer'    => $customer,
            'serial'      => $serial,
            'timeline'    => $timeline,
            'technicians' => $technicians,
            'parts'       => $parts,
        ]);
    }

    public function updateStatus(Request $request, array $params): Response
    {
        $id = $params['id'] ?? 0;
        $job = Job::find((int) $id);
        if (!$job) {
            return $this->json(['success' => false, 'error' => 'پرونده یافت نشد.'], 404);
        }

        $newStatus = (string) $request->input('status');
        $title = (string) $request->input('title', 'تغییر وضعیت پرونده');
        $desc = (string) $request->input('description', '');

        WorkflowService::changeStatus($job, $newStatus, $title, $desc);

        if ($request->input('ajax')) {
            return $this->json(['success' => true, 'message' => 'وضعیت با موفقیت به‌روزرسانی شد.']);
        }

        Session::flash('success', 'وضعیت پرونده تغییر یافت.');
        return $this->redirect("/jobs/{$id}");
    }

    public function assignTechnician(Request $request, array $params): Response
    {
        $id = $params['id'] ?? 0;
        $job = Job::find((int) $id);
        if (!$job) {
            return $this->redirect('/jobs');
        }

        $techId = (int) $request->input('technician_id');
        $tech = Database::selectOne("SELECT name FROM js_users WHERE id = :id LIMIT 1", [':id' => $techId]);

        $job->update([
            'assigned_technician_id' => $techId,
            'current_status'         => WorkflowService::STATUS_ASSIGNED_TO_TECH
        ]);

        Database::insert(
            "INSERT INTO js_job_timeline (job_id, status, title, description, operator_name, user_role, created_at)
             VALUES (:jid, 'assigned_to_tech', 'تخصیص تکنسین', :d, :op, :role, NOW())",
            [
                ':jid'  => $id,
                ':d'    => "پرونده به تکنسین " . ($tech['name'] ?? '') . " ارجاع شد.",
                ':op'   => Auth::user()->name,
                ':role' => Auth::user()->role
            ]
        );

        Session::flash('success', 'تکنسین با موفقیت به پرونده تخصیص یافت.');
        return $this->redirect("/jobs/{$id}");
    }
}
