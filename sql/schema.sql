CREATE DATABASE IF NOT EXISTS `mall_led` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mall_led`;

DROP TABLE IF EXISTS `portfolio_demos`;
DROP TABLE IF EXISTS `risks`;
DROP TABLE IF EXISTS `evaluation_criteria`;
DROP TABLE IF EXISTS `deliverables`;
DROP TABLE IF EXISTS `timeline`;
DROP TABLE IF EXISTS `financials`;
DROP TABLE IF EXISTS `legal_compliance`;
DROP TABLE IF EXISTS `requirements`;
DROP TABLE IF EXISTS `scope`;
DROP TABLE IF EXISTS `location`;
DROP TABLE IF EXISTS `owner`;
DROP TABLE IF EXISTS `projects`;

CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` VARCHAR(50) NOT NULL UNIQUE,
  `title_ar` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'approved',
  `priority` VARCHAR(50) DEFAULT 'high',
  `created_at` DATE,
  `updated_at` DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `owner` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `name` VARCHAR(255),
  `company` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `location` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `city` VARCHAR(100),
  `district` VARCHAR(100),
  `street` VARCHAR(255),
  `road_width_m` DECIMAL(8,2),
  `building_height_m` DECIMAL(8,2),
  `facade_area_m2` DECIMAL(10,2),
  `lat` DECIMAL(10,8),
  `lng` DECIMAL(11,8),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `scope` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `summary` TEXT,
  `objectives` JSON,
  `out_of_scope` JSON,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `requirements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `design_style` VARCHAR(100) DEFAULT 'modern',
  `visual_hierarchy` TINYINT(1) DEFAULT 1,
  `day_night_views` TINYINT(1) DEFAULT 1,
  `three_d_visuals` TINYINT(1) DEFAULT 1,
  `content_simulation` TINYINT(1) DEFAULT 1,
  `led_type` VARCHAR(100),
  `led_area_m2` DECIMAL(10,2),
  `brightness_nit_min` INT DEFAULT 6000,
  `refresh_rate_hz_min` INT DEFAULT 3840,
  `ip_rating_min` VARCHAR(20) DEFAULT 'IP65',
  `contrast_ratio_min` VARCHAR(50) DEFAULT '40000:1',
  `power_avg_w_m2` INT DEFAULT 150,
  `power_peak_w_m2` INT DEFAULT 800,
  `maintenance_access` VARCHAR(100) DEFAULT 'front_and_back',
  `control_system` VARCHAR(100) DEFAULT 'CMS Cloud Sync',
  `wind_load_standard` VARCHAR(100) DEFAULT 'ASCE/SEI 7 & SBC 301',
  `substructure` VARCHAR(255),
  `mounting` VARCHAR(255),
  `weight_kg_m2` DECIMAL(8,2),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `legal_compliance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `country` VARCHAR(50) DEFAULT 'SA',
  `municipality_approval` TINYINT(1) DEFAULT 1,
  `consultant_required` TINYINT(1) DEFAULT 1,
  `max_facade_coverage_percent` INT DEFAULT 80,
  `min_distance_from_boundary_m` DECIMAL(8,2) DEFAULT 2.50,
  `min_building_height_m` DECIMAL(8,2) DEFAULT 15.00,
  `sbc_codes` JSON,
  `content_restrictions` JSON,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `financials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `budget_estimate` DECIMAL(12,2),
  `led_cost_per_m2_min` DECIMAL(10,2),
  `led_cost_per_m2_max` DECIMAL(10,2),
  `installation_cost` DECIMAL(12,2),
  `annual_operating_cost` DECIMAL(12,2),
  `roi_months` INT,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `timeline` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `brief_approval` DATE,
  `concept_design` DATE,
  `three_d_visuals` DATE,
  `technical_design` DATE,
  `tender` DATE,
  `execution` DATE,
  `handover` DATE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `deliverables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `code` VARCHAR(50),
  `name` VARCHAR(255),
  `format` VARCHAR(100),
  `required` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `evaluation_criteria` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `criterion` VARCHAR(255),
  `weight` INT,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `risks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `risk` TEXT,
  `probability` VARCHAR(50),
  `impact` VARCHAR(50),
  `mitigation` TEXT,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `portfolio_demos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `year` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `image_gradient` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- إدراج بيانات المشروع الابتدائية النموذجية
-- ============================================

INSERT INTO `projects` (`project_id`, `title_ar`, `title_en`, `status`, `priority`, `created_at`, `updated_at`)
VALUES ('MALL-LED-001', 'تصميم واجهة مول تجاري عصري مع شاشات LED', 'Modern Mall Facade Design with Integrated LED Screens', 'approved', 'high', CURRENT_DATE, CURRENT_DATE);

SET @pid = LAST_INSERT_ID();

INSERT INTO `owner` (`project_id`, `name`, `company`, `email`, `phone`)
VALUES (@pid, 'شركة التطوير العقاري الحديثة', 'Modern Real Estate Development Co.', 'info@malled.sa', '+966500000000');

INSERT INTO `location` (`project_id`, `city`, `district`, `street`, `road_width_m`, `building_height_m`, `facade_area_m2`, `lat`, `lng`)
VALUES (@pid, 'الرياض', 'حطين', 'طريق الملك سلمان', 60.00, 28.50, 2400.00, 24.774265, 46.623812);

INSERT INTO `scope` (`project_id`, `summary`, `objectives`, `out_of_scope`)
VALUES (
  @pid,
  'تصميم واجهة معمارية عصرية لمول تجاري فاخر تدمج شاشات LED شفافة عالية الدقة مع إضاءة برمجية تفاعلية ومحاكاة ثلاثية الأبعاد ثلاثية العرض نهاراً وليلاً.',
  '["ابتكار واجهة معمارية أيقونية تجذب الزوار والمارة", "دمج شاشات LED عالية السطوع مع الحفاظ على الرؤية البصرية من الداخل (Transparent LED)", "الالتزام التام بكود البناء السعودي (SBC) ومتطلبات البلدية", "تقديم تصورات 3D ومحاكاة تفاعلية للمحتوى ولعرض النهار والليل", "توفير جدوى مالية متكاملة وحساب فترة استرداد الاستثمار (ROI)"]',
  '["التوريد الفعلي للمعدات الشاشات", "أعمال المقاولات الإنشائية الميدانية", "إدارة الحملات الإعلانية التجارية التشغيلية"]'
);

INSERT INTO `requirements` (
  `project_id`, `design_style`, `visual_hierarchy`, `day_night_views`, `three_d_visuals`, `content_simulation`,
  `led_type`, `led_area_m2`, `brightness_nit_min`, `refresh_rate_hz_min`, `ip_rating_min`, `contrast_ratio_min`,
  `power_avg_w_m2`, `power_peak_w_m2`, `maintenance_access`, `control_system`, `wind_load_standard`,
  `substructure`, `mounting`, `weight_kg_m2`
) VALUES (
  @pid, 'Parametric Modern LED Architecture', 1, 1, 1, 1,
  'Transparent Outdoor LED Glass Facade (P3.9-7.8)', 680.00, 6500, 3840, 'IP65 Outdoor', '40000:1',
  160, 750, 'front_and_back (صيانة أمامية وخلفية مزدوجة)', 'Novastar / Colorlight Cloud CMS with Automatic Dimming',
  'ASCE/SEI 7 & SBC 301 (كود الأحمال والاستقرار)', 'Steel Truss Grid integrated with Curtain Wall Structure', 'Custom Aluminum Bracket Substructure', 18.50
);

INSERT INTO `legal_compliance` (
  `project_id`, `country`, `municipality_approval`, `consultant_required`, `max_facade_coverage_percent`,
  `min_distance_from_boundary_m`, `min_building_height_m`, `sbc_codes`, `content_restrictions`
) VALUES (
  @pid, 'SA', 1, 1, 75,
  3.00, 18.00,
  '["SBC 301 (الأحمال والقوى)", "SBC 306 (كود ترشيد الطاقة)", "SBC 801 (كود السلامة والحماية من الحريق)", "اشتراطات أمانات المدن لللوحات الإعلانية والشاشات"]',
  '["الالتزام بضوابط الذوق العام والهوية الوطنية", "تجنب الإضاءة المبهرة للسائقين على الطرق السريعة", "تعديل السطوع تلقائياً بحسب الإضاءة المحيطة (Day/Night Brightness Control)"]'
);

INSERT INTO `financials` (
  `project_id`, `currency`, `budget_estimate`, `led_cost_per_m2_min`, `led_cost_per_m2_max`, `installation_cost`, `annual_operating_cost`, `roi_months`
) VALUES (
  @pid, 'SAR', 12170000.00, 3200.00, 4800.00, 650000.00, 235008.00, 22
);

INSERT INTO `timeline` (
  `project_id`, `brief_approval`, `concept_design`, `three_d_visuals`, `technical_design`, `tender`, `execution`, `handover`
) VALUES (
  @pid, '2026-10-13', '2026-10-20', '2026-10-27', '2026-11-10', '2026-11-20', '2026-12-15', '2027-03-01'
);

INSERT INTO `deliverables` (`project_id`, `code`, `name`, `format`, `required`) VALUES
(@pid, 'DEL-01', 'المخططات المعمارية والتنفيذية للواجهة والشاشات', 'Autocad DWG + PDF', 1),
(@pid, 'DEL-02', 'التصورات ثلاثية الأبعاد النهارية والليلية 3D Visualizations', '4K Rendered Images & Video Walkthrough', 1),
(@pid, 'DEL-03', 'دراسة أحمال الرياح والحسابات الانشائية', 'Structural Calculation Report (SBC 301)', 1),
(@pid, 'DEL-04', 'محاكاة المحتوى وإدارة التحكم وتنسيق الشاشات', 'Video Simulation & CMS Config', 1),
(@pid, 'DEL-05', 'جدول الكميات والتكلفة التقديرية BOQ', 'Excel / PDF', 1);

INSERT INTO `evaluation_criteria` (`project_id`, `criterion`, `weight`) VALUES
(@pid, 'الجمالية والتكامل المعماري مع الشاشات LED', 30),
(@pid, 'المواصفات الفنية وجودة الشاشات (السطوع والتباين والصيانة)', 25),
(@pid, 'الالتزام بأكواد SBC واشتراطات السلامة والبلدية', 20),
(@pid, 'الجدوى الاقتصادية وسرعة استرداد الاستثمار ROI', 15),
(@pid, 'الابتكار والتصورات 3D ومحاكاة العرض', 10);

INSERT INTO `risks` (`project_id`, `risk`, `probability`, `impact`, `mitigation`) VALUES
(@pid, 'تأثير درجات الحرارة العالية وأشعة الشمس المباشرة على عمر الشاشات', 'medium', 'high', 'استخدام شاشات IP65 بطلاء حماية حراري ومستشعرات حرارة مدمجة ونظام تبريد خلفي مجوف'),
(@pid, 'تأخير موافقات أمانة المنطقة والجهات التنفيذية', 'low', 'high', 'إعداد الملف الهندسي المتكامل بواسطة مكتب استشاري معتمد والالتزام بكود SBC 301 & 306'),
(@pid, 'ارتفاع أحمال الرياح على الهيكل المعدني للواجهة', 'medium', 'high', 'اعتماد تصميم الهيكل الشبكي المفرغ (Transparent Steel Grid) ومطابقته لشهادات أحمال الرياح');

INSERT INTO `portfolio_demos` (`title`, `year`, `description`, `image_gradient`) VALUES
('نموذج تصوري A — واجهة زجاجية متعددة الطوابق', '2025 (نموذج)', 'تصميم واجهة زجاجية شفافة P3.9 مدمجة مع الهيكل المعماري الخارجي بسطوع 6,500 Nit.', 'linear-gradient(135deg, #1e1b4b, #0284c7, #38bdf8)'),
('نموذج تصوري B — شاشة LED منحنية معمارية', '2025 (نموذج)', 'دمج شاشة LED منحنية بدقة 4K بالواجهة مع نظام تحكم سحابي ومحاكاة نهارية/ليلية.', 'linear-gradient(135deg, #0f172a, #0369a1, #38bdf8)'),
('نموذج تصوري C — تكامل زجاج + LED شفاف', '2025 (نموذج)', 'واجهة معمارية عصرية هجينة تجمع بين الألومنيوم وشاشات LED الشفافة التفاعلية.', 'linear-gradient(135deg, #312e81, #0284c7, #06b6d4)');
