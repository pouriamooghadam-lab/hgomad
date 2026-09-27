<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\SmsLog;
use App\Models\SmsTemplate;
use App\Services\SmsService;

class SmsController extends BaseController
{
    public function index(Request $request): Response
    {
        $logs = SmsLog::all('id DESC', 100);
        $templates = SmsTemplate::all('id ASC');
        return $this->json(['success' => true, 'logs' => $logs, 'templates' => $templates]);
    }

    public function send(Request $request): Response
    {
        $mobile = trim($request->input('mobile', ''));
        $text = trim($request->input('message', ''));
        $type = $request->input('type', 'manual');

        if (empty($mobile) || empty($text)) {
            return $this->json(['success' => false, 'error' => 'شماره موبایل و متن پیامک الزامی است.'], 422);
        }

        $sent = SmsService::send($mobile, $text);

        $id = SmsLog::create([
            'mobile' => $mobile,
            'message' => $text,
            'type' => $type,
            'status' => $sent ? 'sent' : 'failed',
            'gateway_response' => $sent ? '200 OK - Sent' : 'Failed to reach gateway',
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->json([
            'success' => $sent,
            'id' => $id,
            'message' => $sent ? 'پیامک با موفقیت ارسال شد.' : 'ارسال پیامک با خطا مواجه شد.'
        ]);
    }
}
