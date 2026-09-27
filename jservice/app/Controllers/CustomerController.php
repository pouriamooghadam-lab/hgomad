<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;
use App\Models\Customer;

class CustomerController extends BaseController
{
    public function index(Request $request): Response
    {
        $search = $request->input('q');
        $sql = "SELECT * FROM js_customers WHERE deleted_at IS NULL";
        $params = [];

        if (!empty($search)) {
            $sql .= " AND (name LIKE :q OR mobile LIKE :q OR national_code LIKE :q)";
            $params[':q'] = "%{$search}%";
        }
        $sql .= " ORDER BY id DESC LIMIT 100";

        $customers = Database::select($sql, $params);
        return $this->view('customers.index', ['customers' => $customers, 'search' => $search]);
    }

    public function show(Request $request, array $params): Response
    {
        $id = $params['id'] ?? 0;
        $customer = Customer::find((int) $id);
        if (!$customer) {
            Session::flash('error', 'مشتری یافت نشد.');
            return $this->redirect('/customers');
        }

        $jobs = Database::select("SELECT * FROM js_jobs WHERE customer_id = :id ORDER BY id DESC", [':id' => $id]);
        return $this->view('customers.show', ['customer' => $customer, 'jobs' => $jobs]);
    }
}
