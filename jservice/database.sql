-- ========================================================
-- JSERVICE ERP - Database Schema (MySQL / MariaDB)
-- سازگار با هاست‌های اشتراکی cPanel / DirectAdmin / Plesk
-- Charset: utf8mb4 / Collation: utf8mb4_persian_ci
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. جدول کاربران (Users)
CREATE TABLE IF NOT EXISTS `js_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(191) NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'technician',
  `role_title` VARCHAR(100) NOT NULL DEFAULT 'تکنسین',
  `branch_id` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `avatar_url` VARCHAR(255) NULL,
  `last_login` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_mobile` (`mobile`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 2. جدول شعب و نمایندگی‌ها (Branches)
CREATE TABLE IF NOT EXISTS `js_branches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `type` ENUM('central', 'branch', 'agency') NOT NULL DEFAULT 'branch',
  `manager_name` VARCHAR(191) NOT NULL,
  `province` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `max_daily_intake` INT NOT NULL DEFAULT 30,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 3. جدول مشتریان (Customers & CRM)
CREATE TABLE IF NOT EXISTS `js_customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `company_name` VARCHAR(191) NULL,
  `mobile` VARCHAR(20) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `national_code` VARCHAR(20) NOT NULL,
  `email` VARCHAR(191) NULL,
  `province` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `postal_code` VARCHAR(20) NULL,
  `customer_type` ENUM('real', 'legal') NOT NULL DEFAULT 'real',
  `source` VARCHAR(50) NOT NULL DEFAULT 'walk-in',
  `vip_level` ENUM('normal', 'silver', 'gold', 'platinum') NOT NULL DEFAULT 'normal',
  `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cust_mobile` (`mobile`),
  INDEX `idx_cust_national` (`national_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 4. جدول برندها و دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS `js_brands` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

CREATE TABLE IF NOT EXISTS `js_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 5. جدول کالاها (Products)
CREATE TABLE IF NOT EXISTS `js_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `brand_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `sku` VARCHAR(100) NOT NULL UNIQUE,
  `default_warranty_months` INT NOT NULL DEFAULT 18,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`brand_id`) REFERENCES `js_brands`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `js_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 6. جدول سریال‌ها - موجودیت مستقل و قلب سیستم (Serials)
CREATE TABLE IF NOT EXISTS `js_serials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serial_number` VARCHAR(100) NOT NULL UNIQUE,
  `imei` VARCHAR(50) NULL,
  `batch_number` VARCHAR(50) NULL,
  `product_id` INT NOT NULL,
  `customer_id` INT NULL,
  `branch_id` INT NOT NULL,
  `production_date` DATE NULL,
  `sale_date` DATE NULL,
  `warranty_type` ENUM('corporate', 'branch', 'extended', 'part', 'repair', 'none') NOT NULL DEFAULT 'corporate',
  `warranty_status` ENUM('active', 'expired', 'voided', 'not_activated') NOT NULL DEFAULT 'active',
  `warranty_start_date` DATE NULL,
  `warranty_end_date` DATE NULL,
  `status` ENUM('in_stock', 'sold', 'in_service', 'replaced', 'scrapped') NOT NULL DEFAULT 'in_stock',
  `void_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_serial_num` (`serial_number`),
  INDEX `idx_serial_imei` (`imei`),
  FOREIGN KEY (`product_id`) REFERENCES `js_products`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 7. جدول تاریخچه سریال (Serial Lifecycle History)
CREATE TABLE IF NOT EXISTS `js_serial_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serial_id` INT NOT NULL,
  `event_type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `operator_name` VARCHAR(100) NOT NULL,
  `reference_code` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`serial_id`) REFERENCES `js_serials`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 8. جدول جاب و گردش کار پذیرش (Jobs & Workflows)
CREATE TABLE IF NOT EXISTS `js_jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_code` VARCHAR(50) NOT NULL UNIQUE, -- JS-1403-000001
  `local_reception_number` VARCHAR(50) NOT NULL,
  `customer_id` INT NOT NULL,
  `serial_id` INT NOT NULL,
  `branch_id` INT NOT NULL,
  `assigned_technician_id` INT NULL,
  `channel` ENUM('walk-in', 'branch', 'phone', 'online') NOT NULL DEFAULT 'walk-in',
  `priority` ENUM('normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
  `warranty_condition` ENUM('under_warranty', 'out_of_warranty', 'pending_inspection') NOT NULL DEFAULT 'under_warranty',
  `customer_complaint` TEXT NOT NULL,
  `expert_initial_notes` TEXT NULL,
  `visual_condition` JSON NULL,
  `accessories` JSON NULL,
  `signature_data` MEDIUMTEXT NULL,
  `current_status` VARCHAR(50) NOT NULL DEFAULT 'registered',
  `estimated_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `final_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `is_warranty_approved_tech` TINYINT(1) NOT NULL DEFAULT 0,
  `is_warranty_approved_manager` TINYINT(1) NOT NULL DEFAULT 0,
  `warranty_rejection_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_job_tracking` (`tracking_code`),
  INDEX `idx_job_status` (`current_status`),
  FOREIGN KEY (`customer_id`) REFERENCES `js_customers`(`id`),
  FOREIGN KEY (`serial_id`) REFERENCES `js_serials`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 9. جدول تایم‌لاین رویدادهای جاب (Job Timeline)
CREATE TABLE IF NOT EXISTS `js_job_timeline` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `operator_name` VARCHAR(100) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `js_jobs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 10. جدول انبارها و قطعات (Warehouses & Parts)
CREATE TABLE IF NOT EXISTS `js_warehouses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `type` ENUM('central', 'service', 'branch', 'technician', 'scrap', 'quarantine', 'salvage') NOT NULL,
  `manager_name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(191) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

CREATE TABLE IF NOT EXISTS `js_parts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `brand_name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `compatible_models` TEXT NULL,
  `barcode` VARCHAR(100) NOT NULL UNIQUE,
  `storage_bin` VARCHAR(50) NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'عدد',
  `buy_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `sell_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `warranty_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `min_stock` INT NOT NULL DEFAULT 5,
  `current_stock` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_part_barcode` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 11. جدول درخواست‌های قطعه تکنسین (Part Requests)
CREATE TABLE IF NOT EXISTS `js_part_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NOT NULL,
  `part_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `requested_by` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'delivered') NOT NULL DEFAULT 'pending',
  `rejection_reason` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `js_jobs`(`id`),
  FOREIGN KEY (`part_id`) REFERENCES `js_parts`(`id`),
  FOREIGN KEY (`warehouse_id`) REFERENCES `js_warehouses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 12. جدول قطعات داغی و مستعمل (Scrap Parts)
CREATE TABLE IF NOT EXISTS `js_scrap_parts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `part_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `technician_id` INT NOT NULL,
  `condition_status` ENUM('in_review', 'repairable', 'scrapped', 'returned_to_vendor') NOT NULL DEFAULT 'in_review',
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 13. جدول مالی و فاکتورها (Invoices & Payments)
CREATE TABLE IF NOT EXISTS `js_invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_number` VARCHAR(50) NOT NULL UNIQUE,
  `job_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `warranty_discount_total` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_payable` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('draft', 'pending_payment', 'paid', 'canceled') NOT NULL DEFAULT 'draft',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`job_id`) REFERENCES `js_jobs`(`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `js_customers`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 14. جدول لاگ پیامک (SMS Logs)
CREATE TABLE IF NOT EXISTS `js_sms_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mobile` VARCHAR(20) NOT NULL,
  `recipient_name` VARCHAR(100) NOT NULL,
  `event` VARCHAR(50) NOT NULL,
  `message_text` TEXT NOT NULL,
  `status` ENUM('delivered', 'sent', 'failed') NOT NULL DEFAULT 'sent',
  `provider` VARCHAR(50) NOT NULL DEFAULT 'kavenegar',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 15. جدول تنظیمات و لایسنس سیستم (System Settings & License)
CREATE TABLE IF NOT EXISTS `js_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` LONGTEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 16. جدول اعزام و سرویس در محل (On-Site Field Dispatch)
CREATE TABLE IF NOT EXISTS `js_onsite_dispatches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_code` VARCHAR(50) NOT NULL,
  `job_id` INT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `province` VARCHAR(100) NOT NULL DEFAULT 'تهران',
  `city` VARCHAR(100) NOT NULL DEFAULT 'تهران',
  `district` VARCHAR(100) NULL,
  `scheduled_date` VARCHAR(50) NOT NULL,
  `time_slot` ENUM('morning', 'afternoon', 'evening') NOT NULL DEFAULT 'morning',
  `technician_id` INT NULL,
  `technician_name` VARCHAR(191) NOT NULL,
  `travel_cost` DECIMAL(15, 2) NOT NULL DEFAULT 350000.00,
  `zone` ENUM('inside_city', 'suburbs', 'intercity') NOT NULL DEFAULT 'inside_city',
  `status` ENUM('scheduled', 'technician_en_route', 'arrived', 'completed', 'canceled') NOT NULL DEFAULT 'scheduled',
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_onsite_tech` (`technician_id`),
  INDEX `idx_onsite_date` (`scheduled_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 17. جدول انبارک سیار تکنسین و قطعات امانی (Technician Mobile Van Stock)
CREATE TABLE IF NOT EXISTS `js_technician_van_inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `technician_id` INT NOT NULL,
  `part_id` INT NOT NULL,
  `quantity_on_hand` INT NOT NULL DEFAULT 0,
  `consigned_date` DATE NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_van_tech` (`technician_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 18. جدول راهنمای عیب‌یابی و کدهای خطا (Diagnostic Decision Tree & Error Codes)
CREATE TABLE IF NOT EXISTS `js_fault_tree_guides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `error_code` VARCHAR(100) NOT NULL,
  `symptom` TEXT NOT NULL,
  `possible_causes` JSON NULL,
  `step_by_step_test` JSON NULL,
  `recommended_part` VARCHAR(191) NULL,
  `estimated_repair_time_min` INT NOT NULL DEFAULT 30,
  INDEX `idx_err_code` (`error_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 19. جدول نظرسنجی و رضایت‌سنجی هوشمند (CSAT Customer Feedback & Surveys)
CREATE TABLE IF NOT EXISTS `js_csat_surveys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `job_id` INT NULL,
  `tracking_code` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `technician_id` INT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `punctuality_score` INT NOT NULL DEFAULT 5,
  `behavior_score` INT NOT NULL DEFAULT 5,
  `quality_score` INT NOT NULL DEFAULT 5,
  `feedback` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_csat_tech` (`technician_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 20. جدول فعال‌سازی آنلاین گارانتی توسط مصرف‌کننده (Consumer Warranty Activations)
CREATE TABLE IF NOT EXISTS `js_warranty_activations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serial_number` VARCHAR(100) NOT NULL UNIQUE,
  `product_name` VARCHAR(191) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `customer_national_code` VARCHAR(20) NOT NULL,
  `purchase_date` VARCHAR(50) NOT NULL,
  `dealer_store_name` VARCHAR(191) NOT NULL,
  `invoice_number` VARCHAR(100) NOT NULL,
  `warranty_months` INT NOT NULL DEFAULT 18,
  `warranty_start_date` VARCHAR(50) NOT NULL,
  `warranty_end_date` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'activated',
  `activation_code` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_wact_serial` (`serial_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 21. جدول لاگ‌های امنیتی سیستم (Audit Log Trail)
CREATE TABLE IF NOT EXISTS `js_audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_name` VARCHAR(191) NULL,
  `action` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `user_agent` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

-- 22. جدول مقابله با حملات Brute-Force ورود
CREATE TABLE IF NOT EXISTS `js_login_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mobile` VARCHAR(20) NOT NULL,
  `ip_address` VARCHAR(50) NOT NULL,
  `attempt_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_brute_ip` (`ip_address`, `attempt_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

SET FOREIGN_KEY_CHECKS = 1;
