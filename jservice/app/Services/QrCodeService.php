<?php
declare(strict_types=1);

namespace App\Services;

class QrCodeService
{
    /**
     * Generate an SVG or Data URI QR code for tracking links or serial verification
     */
    public static function generateSvg(string $data, int $size = 150): string
    {
        // Safe standard QR generator or API fallback
        $encodedData = urlencode($data);
        return "https://api.qrserver.com/v1/create-qr-code/?size={$size}x{$size}&data={$encodedData}&margin=2";
    }

    public static function getTrackingUrl(string $trackingCode): string
    {
        $appUrl = rtrim(env('APP_URL', 'http://localhost'), '/');
        return "{$appUrl}/track?code={$trackingCode}";
    }
}
