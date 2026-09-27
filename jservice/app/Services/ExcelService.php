<?php
declare(strict_types=1);

namespace App\Services;

class ExcelService
{
    /**
     * Export rows as Excel-compatible CSV with UTF-8 BOM for Microsoft Excel Persian compatibility
     *
     * @param string $filename
     * @param array $headers
     * @param array $rows
     */
    public static function exportCsv(string $filename, array $headers, array $rows): void
    {
        if (!str_ends_with($filename, '.csv')) {
            $filename .= '.csv';
        }

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $output = fopen('php://output', 'w');

        // Output UTF-8 BOM so Persian characters display correctly in Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

        // Output headers
        fputcsv($output, $headers);

        // Output rows
        foreach ($rows as $row) {
            fputcsv($output, array_values($row));
        }

        fclose($output);
        exit;
    }
}
