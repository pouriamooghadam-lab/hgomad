<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Core\Logger;

class SmsService
{
    public static function send(string $mobile, string $templateKey, array $tokens = []): bool
    {
        // 1. Fetch template from database
        $tpl = Database::selectOne(
            "SELECT * FROM js_sms_templates WHERE event = :evt AND is_enabled = 1 LIMIT 1",
            [':evt' => $templateKey]
        );

        $text = $tpl['template_text'] ?? "اطلاعیه وضعیت خدمات جی سرویس: کد رهگیری {tracking_code}، وضعیت جدید: {status}.";
        foreach ($tokens as $k => $v) {
            $text = str_replace('{' . $k . '}', (string)$v, $text);
        }

        $provider = env('SMS_PROVIDER', 'kavenegar');
        $apiKey = env('SMS_API_KEY', '');
        $status = 'sent';

        // 2. Dispatch via provider if API key present
        if (!empty($apiKey) && $apiKey !== 'your_sms_gateway_api_key_here') {
            try {
                if ($provider === 'kavenegar') {
                    $url = "https://api.kavenegar.com/v1/{$apiKey}/sms/send.json";
                    $ch = curl_init($url);
                    curl_setopt_array($ch, [
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_POST           => true,
                        CURLOPT_POSTFIELDS     => [
                            'receptor' => $mobile,
                            'message'  => $text,
                            'sender'   => env('SMS_LINE_NUMBER', '10008888')
                        ],
                        CURLOPT_TIMEOUT        => 5
                    ]);
                    $res = curl_exec($ch);
                    curl_close($ch);
                }
            } catch (\Throwable $e) {
                Logger::error('SMS Dispatch Error: ' . $e->getMessage());
                $status = 'failed';
            }
        }

        // 3. Log into database
        Database::insert(
            "INSERT INTO js_sms_logs (mobile, recipient_name, event, message_text, status, provider, created_at)
             VALUES (:m, :name, :evt, :txt, :st, :prov, NOW())",
            [
                ':m'    => $mobile,
                ':name' => $tokens['customer_name'] ?? 'مشتری گرامی',
                ':evt'  => $templateKey,
                ':txt'  => $text,
                ':st'   => $status,
                ':prov' => $provider
            ]
        );

        return true;
    }
}
