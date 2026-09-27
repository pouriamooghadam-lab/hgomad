<?php
declare(strict_types=1);

use App\Core\Router;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\ReceptionController;
use App\Controllers\JobController;
use App\Controllers\CustomerController;
use App\Controllers\WarrantyController;
use App\Controllers\OnsiteController;
use App\Controllers\ScrapController;

// Public routes
Router::get('/', [AuthController::class, 'showLogin']);
Router::get('/login', [AuthController::class, 'showLogin']);
Router::post('/login', [AuthController::class, 'login']);
Router::get('/logout', [AuthController::class, 'logout']);

// Public Warranty Inquiry & Online Activation (No Login Required)
Router::get('/warranty/inquiry', [WarrantyController::class, 'inquiry']);
Router::get('/warranty/activate', [WarrantyController::class, 'activate']);
Router::post('/warranty/activate', [WarrantyController::class, 'activate']);
Router::get('/receptions/receipt/{trackingCode}', [ReceptionController::class, 'printReceipt']);

// Authenticated Routes (Protected by AuthMiddleware and LicenseMiddleware)
Router::group(['middleware' => ['AuthMiddleware', 'LicenseMiddleware']], function () {
    Router::get('/dashboard', [DashboardController::class, 'index']);

    // Receptions
    Router::get('/receptions', [ReceptionController::class, 'index']);
    Router::get('/receptions/create', [ReceptionController::class, 'create']);
    Router::post('/receptions/store', [ReceptionController::class, 'store']);

    // Jobs Workflow
    Router::get('/jobs', [JobController::class, 'index']);
    Router::get('/jobs/{id}', [JobController::class, 'show']);
    Router::post('/jobs/{id}/status', [JobController::class, 'updateStatus']);
    Router::post('/jobs/{id}/assign', [JobController::class, 'assignTechnician']);

    // Customers CRM
    Router::get('/customers', [CustomerController::class, 'index']);
    Router::get('/customers/{id}', [CustomerController::class, 'show']);

    // On-site Service Dispatch
    Router::get('/onsite', [OnsiteController::class, 'index']);
    Router::post('/onsite/store', [OnsiteController::class, 'store']);

    // Scrap & Defective Warehouse
    Router::get('/scrap', [ScrapController::class, 'index']);
});
