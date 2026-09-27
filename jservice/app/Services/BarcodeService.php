<?php
declare(strict_types=1);

namespace App\Services;

class BarcodeService
{
    /**
     * Generate HTML representation of Code128 / Code39 style barcode
     */
    public static function generateBarcodeHtml(string $code): string
    {
        $code = htmlspecialchars($code);
        return <<<HTML
<div style="display: inline-block; text-align: center; font-family: monospace;">
    <div style="letter-spacing: 4px; font-weight: bold; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 7px, #fff 7px, #fff 9px); height: 42px; width: 180px; margin: 0 auto;"></div>
    <div style="font-size: 11px; margin-top: 3px; letter-spacing: 2px;">*{$code}*</div>
</div>
HTML;
    }
}
