<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

class OnsiteController extends BaseController
{
    public function index(Request $request): Response
    {
        $dispatches = Database::select("SELECT * FROM js_onsite_dispatches ORDER BY id DESC LIMIT 50");
        $technicians = Database::select("SELECT * FROM js_users WHERE role = 'technician' AND is_active = 1");

        return $this->view('onsite.index', [
            'dispatches'  => $dispatches,
            'technicians' => $technicians,
        ]);
    }

    public function store(Request $request): Response
    {
        $customerName = trim((string) $request->input('customer_name'));
        $mobile = trim((string) $request->input('customer_mobile'));
        $address = trim((string) $request->input('address'));

        if (empty($customerName) || empty($mobile) || empty($address)) {
            Session::flash('error', 'مشخصات مشتری و آدرس محل مراجعه الزامی است.');
            return $this->redirect('/onsite');
        }

        $zone = (string) $request->input('zone', 'inside_city');
        $cost = 350000;
        if ($zone === 'suburbs') $cost = 600000;
        if ($zone === 'intercity') $cost = 1200000;

        $tracking = 'JS-' . date('Y') . '-' . mt_rand(1000, 9999);

        Database::insert(
            "INSERT INTO js_onsite_dispatches (
                tracking_code, customer_name, customer_mobile, address, province, city, district,
                scheduled_date, time_slot, technician_id, technician_name, travel_cost, zone, status, notes, created_at
            ) VALUES (
                :tracking, :cname, :cmobile, :addr, :prov, :city, :dist,
                :sdate, :tslot, :tid, :tname, :tcost, :zone, 'scheduled', :notes, NOW()
            )",
            [
                ':tracking' => $tracking,
                ':cname'    => $customerName,
                ':cmobile'  => $mobile,
                ':addr'     => $address,
                ':prov'     => $request->input('province', 'تهران'),
                ':city'     => $request->input('city', 'تهران'),
                ':dist'     => $request->input('district', ''),
                ':sdate'    => $request->input('scheduled_date', date('Y-m-d')),
                ':tslot'    => $request->input('time_slot', 'morning'),
                ':tid'      => $request->input('technician_id', 1),
                ':tname'    => $request->input('technician_name', 'تکنسین اعزامی'),
                ':tcost'    => $cost,
                ':zone'     => $zone,
                ':notes'    => $request->input('notes', '')
            ]
        );

        Session::flash('success', "ماموریت اعزام به محل با کد {$tracking} ثبت شد.");
        return $this->redirect('/onsite');
    }
}
