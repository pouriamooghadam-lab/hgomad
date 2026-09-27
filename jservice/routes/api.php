<?php
declare(strict_types=1);

use App\Core\Router;
use App\Controllers\ApiController;
use App\Controllers\LicenseController;

Router::group(['prefix' => 'api'], function () {
    // License API
    Router::post('/license/activate', [LicenseController::class, 'activate']);
    Router::post('/license/verify', [LicenseController::class, 'verify']);
    Router::get('/license/modules', [LicenseController::class, 'modules']);
    Router::post('/license/heartbeat', [LicenseController::class, 'heartbeat']);
    Router::post('/license/deactivate', [LicenseController::class, 'deactivate']);

    // Public inquiry & tracking
    Router::get('/inquiry', [ApiController::class, 'inquiry']);
    Router::get('/jobs/{trackingCode}', [ApiController::class, 'jobStatus']);
});
