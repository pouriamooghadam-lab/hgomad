<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

class ScrapController extends BaseController
{
    public function index(Request $request): Response
    {
        $scrapItems = Database::select("SELECT * FROM js_scrap_parts ORDER BY id DESC LIMIT 100");
        $vanInventory = Database::select(
            "SELECT v.*, u.name as technician_name, p.name as part_name, p.code as part_code
             FROM js_technician_van_inventory v
             LEFT JOIN js_users u ON v.technician_id = u.id
             LEFT JOIN js_parts p ON v.part_id = p.id
             ORDER BY v.id DESC"
        );

        return $this->view('scrap.index', [
            'scrapItems'   => $scrapItems,
            'vanInventory' => $vanInventory,
        ]);
    }
}
