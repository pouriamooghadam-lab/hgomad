<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Core\Auth;
use App\Models\Job;

class WorkflowService
{
    public const STATUS_REGISTERED               = 'registered';
    public const STATUS_IN_TRANSIT                = 'in_transit';
    public const STATUS_WAITING_FOR_TECH_MANAGER  = 'waiting_for_tech_manager';
    public const STATUS_ASSIGNED_TO_TECH          = 'assigned_to_tech';
    public const STATUS_WAITING_FOR_CUSTOMER_CALL = 'waiting_for_customer_call';
    public const STATUS_REFERRED_TO_CRM           = 'referred_to_crm';
    public const STATUS_WAITING_FOR_COST_APPROVAL = 'waiting_for_cost_approval';
    public const STATUS_COST_APPROVED             = 'cost_approved';
    public const STATUS_WAITING_FOR_PARTS         = 'waiting_for_parts';
    public const STATUS_IN_REPAIR                 = 'in_repair';
    public const STATUS_IN_QC                     = 'in_qc';
    public const STATUS_QC_FAILED                 = 'qc_failed';
    public const STATUS_QC_PASSED                 = 'qc_passed';
    public const STATUS_WAITING_FOR_REPLACEMENT   = 'waiting_for_replacement';
    public const STATUS_WAITING_FOR_DISPATCH      = 'waiting_for_dispatch';
    public const STATUS_COMPLETED                 = 'completed';
    public const STATUS_CANCELED                  = 'canceled';

    public static function changeStatus(Job $job, string $newStatus, string $title, string $description = ''): bool
    {
        $currentUser = Auth::user();
        $operatorName = $currentUser ? $currentUser->name : 'سیستم خودکار';
        $userRole = $currentUser ? $currentUser->role : 'system';

        // 1. Update Job record
        $job->update(['current_status' => $newStatus]);

        // 2. Add Timeline Event
        Database::insert(
            "INSERT INTO js_job_timeline (job_id, status, title, description, operator_name, user_role, created_at)
             VALUES (:jid, :st, :t, :d, :op, :role, NOW())",
            [
                ':jid'  => $job->id,
                ':st'   => $newStatus,
                ':t'    => $title,
                ':d'    => $description,
                ':op'   => $operatorName,
                ':role' => $userRole
            ]
        );

        // 3. Trigger SMS for key milestones
        $customer = $job->customer();
        if ($customer && !empty($customer->mobile)) {
            if ($newStatus === self::STATUS_WAITING_FOR_DISPATCH || $newStatus === self::STATUS_COMPLETED) {
                SmsService::send($customer->mobile, 'job_ready_delivery', [
                    'customer_name' => $customer->name,
                    'tracking_code' => $job->tracking_code,
                    'status'        => 'آماده تحویل در شعبه'
                ]);
            }
        }

        return true;
    }
}
