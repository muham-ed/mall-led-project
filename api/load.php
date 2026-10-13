<?php
header('Cache-Control: no-cache, no-store, must-revalidate');
require_once __DIR__ . '/db.php';

function getDefaultProjectData() {
    return [
        'meta' => [
            'project_id' => 'MALL-LED-001',
            'title_ar'   => 'تصميم واجهة مول تجاري عصري مع شاشات LED',
            'title_en'   => 'Modern Mall Facade Design with Integrated LED Screens',
            'status'     => 'approved',
            'priority'   => 'high',
            'created_at' => date('Y-m-d'),
            'updated_at' => date('Y-m-d'),
            'owner' => [
                'name'    => 'شركة التطوير العقاري الحديثة',
                'company' => 'Modern Real Estate Development Co.',
                'email'   => 'info@malled.sa',
                'phone'   => '+966500000000',
            ],
        ],
        'location' => [
            'city'              => 'الرياض',
            'district'          => 'حطين',
            'street'            => 'طريق الملك سلمان',
            'road_width_m'      => 60,
            'building_height_m' => 28.5,
            'facade_area_m2'    => 2400,
            'coordinates' => [
                'lat' => 24.774265,
                'lng' => 46.623812,
            ],
        ],
        'scope' => [
            'summary'      => 'تصميم واجهة معمارية عصرية لمول تجاري فاخر تدمج شاشات LED شفافة عالية الدقة مع إضاءة برمجية تفاعلية ومحاكاة ثلاثية الأبعاد ثلاثية العرض نهاراً وليلاً.',
            'objectives'   => [
                'ابتكار واجهة معمارية أيقونية تجذب الزوار والمارة',
                'دمج شاشات LED عالية السطوع مع الحفاظ على الرؤية البصرية من الداخل (Transparent LED)',
                'الالتزام التام بكود البناء السعودي (SBC) ومتطلبات البلدية',
                'تقديم تصورات 3D ومحاكاة تفاعلية للمحتوى ولعرض النهار والليل',
                'توفير جدوى مالية متكاملة وحساب فترة استرداد الاستثمار (ROI)'
            ],
            'out_of_scope' => [
                'التوريد الفعلي للمعدات الشاشات',
                'أعمال المقاولات الإنشائية الميدانية',
                'إدارة الحملات الإعلانية التجارية التشغيلية'
            ],
        ],
        'requirements' => [
            'design' => [
                'style'              => 'Parametric Modern LED Architecture',
                'visual_hierarchy'   => true,
                'day_night_views'    => true,
                '3d_visuals'         => true,
                'content_simulation' => true,
            ],
            'led' => [
                'type'                        => 'Transparent Outdoor LED Glass Facade (P3.9-7.8)',
                'area_m2'                     => 680,
                'brightness_nit_min'          => 6500,
                'refresh_rate_hz_min'         => 3840,
                'ip_rating_min'               => 'IP65 Outdoor',
                'contrast_ratio_min'          => '40000:1',
                'power_consumption_w_m2_avg'  => 160,
                'power_consumption_w_m2_peak' => 750,
                'maintenance_access'          => 'front_and_back (صيانة أمامية وخلفية مزدوجة)',
                'control_system'              => 'Novastar / Colorlight Cloud CMS with Automatic Dimming',
            ],
            'structural' => [
                'wind_load_standard' => 'ASCE/SEI 7 & SBC 301 (كود الأحمال والاستقرار)',
                'substructure'       => 'Steel Truss Grid integrated with Curtain Wall Structure',
                'mounting'           => 'Custom Aluminum Bracket Substructure',
                'weight_kg_m2'       => 18.5,
            ],
        ],
        'legal_compliance' => [
            'country'                      => 'SA',
            'municipality_approval'        => true,
            'consultant_required'          => true,
            'max_facade_coverage_percent'  => 75,
            'min_distance_from_boundary_m' => 3.0,
            'min_building_height_m'        => 18.0,
            'sbc_codes'                    => [
                'SBC 301 (الأحمال والقوى)',
                'SBC 306 (كود ترشيد الطاقة)',
                'SBC 801 (كود السلامة والحماية من الحريق)',
                'اشتراطات أمانات المدن لللوحات الإعلانية والشاشات'
            ],
            'content_restrictions'         => [
                'الالتزام بضوابط الذوق العام والهوية الوطنية',
                'تجنب الإضاءة المبهرة للسائقين على الطرق السريعة',
                'تعديل السطوع تلقائياً بحسب الإضاءة المحيطة (Day/Night Brightness Control)'
            ],
        ],
        'deliverables' => [
            ['id' => 'DEL-01', 'name' => 'المخططات المعمارية والتنفيذية للواجهة والشاشات', 'format' => 'Autocad DWG + PDF', 'required' => true],
            ['id' => 'DEL-02', 'name' => 'التصورات ثلاثية الأبعاد النهارية والليلية 3D Visualizations', 'format' => '4K Rendered Images & Video Walkthrough', 'required' => true],
            ['id' => 'DEL-03', 'name' => 'دراسة أحمال الرياح والحسابات الانشائية', 'format' => 'Structural Calculation Report (SBC 301)', 'required' => true],
            ['id' => 'DEL-04', 'name' => 'محاكاة المحتوى وإدارة التحكم وتنسيق الشاشات', 'format' => 'Video Simulation & CMS Config', 'required' => true],
            ['id' => 'DEL-05', 'name' => 'جدول الكميات والتكلفة التقديرية BOQ', 'format' => 'Excel / PDF', 'required' => true],
        ],
        'financials' => [
            'currency'        => 'SAR',
            'budget_estimate' => 12170000,
            'led_cost_per_m2' => [
                'min'      => 3200,
                'max'      => 4800,
                'currency' => 'SAR',
            ],
            'installation_cost'     => 650000,
            'annual_operating_cost' => 235008,
            'roi_months'            => 22,
        ],
        'evaluation_criteria' => [
            ['criterion' => 'الجمالية والتكامل المعماري مع الشاشات LED', 'weight' => 30],
            ['criterion' => 'المواصفات الفنية وجودة الشاشات (السطوع والتباين والصيانة)', 'weight' => 25],
            ['criterion' => 'الالتزام بأكواد SBC وااشتراطات السلامة والبلدية', 'weight' => 20],
            ['criterion' => 'الجدوى الاقتصادية وسرعة استرداد الاستثمار ROI', 'weight' => 15],
            ['criterion' => 'الابتكار والتصورات 3D ومحاكاة العرض', 'weight' => 10],
        ],
        'risks' => [
            ['risk' => 'تأثير درجات الحرارة العالية وأشعة الشمس المباشرة على عمر الشاشات', 'probability' => 'medium', 'impact' => 'high', 'mitigation' => 'استخدام شاشات IP65 بطلاء حماية حراري ومستشعرات حرارة مدمجة ونظام تبريد خلفي مجوف'],
            ['risk' => 'تأخير موافقات أمانة المنطقة والجهات التنفيذية', 'probability' => 'low', 'impact' => 'high', 'mitigation' => 'إعداد الملف الهندسي المتكامل بواسطة مكتب استشاري معتمد والالتزام بكود SBC 301 & 306'],
            ['risk' => 'ارتفاع أحمال الرياح على الهيكل المعدني للواجهة', 'probability' => 'medium', 'impact' => 'high', 'mitigation' => 'اعتماد تصميم الهيكل الشبكي المفرغ (Transparent Steel Grid) ومطابقته لشهادات أحمال الرياح'],
        ],
        'timeline' => [
            'brief_approval'   => '2026-10-13',
            'concept_design'   => '2026-10-20',
            '3d_visuals'       => '2026-10-27',
            'technical_design' => '2026-11-10',
            'tender'           => '2026-11-20',
            'execution'        => '2026-12-15',
            'handover'         => '2027-03-01',
        ],
        'portfolio_demos' => [
            [
                'id' => 1,
                'title' => 'نموذج تصوري A — واجهة زجاجية متعددة الطوابق',
                'year' => '2025 (نموذج)',
                'description' => 'تصميم واجهة زجاجية شفافة P3.9 مدمجة مع الهيكل المعماري الخارجي بسطوع 6,500 Nit.',
                'image_gradient' => 'linear-gradient(135deg, #1e1b4b, #0284c7, #38bdf8)'
            ],
            [
                'id' => 2,
                'title' => 'نموذج تصوري B — شاشة LED منحنية معمارية',
                'year' => '2025 (نموذج)',
                'description' => 'دمج شاشة LED منحنية بدقة 4K بالواجهة مع نظام تحكم سحابي ومحاكاة نهارية/ليلية.',
                'image_gradient' => 'linear-gradient(135deg, #0f172a, #0369a1, #38bdf8)'
            ],
            [
                'id' => 3,
                'title' => 'نموذج تصوري C — تكامل زجاج + LED شفاف',
                'year' => '2025 (نموذج)',
                'description' => 'واجهة معمارية عصرية هجينة تجمع بين الألومنيوم وشاشات LED الشفافة التفاعلية.',
                'image_gradient' => 'linear-gradient(135deg, #312e81, #0284c7, #06b6d4)'
            ]
        ],
        'attachments' => [],
    ];
}

try {
    $pdo = db();
    $project = $pdo->query("SELECT * FROM projects ORDER BY id LIMIT 1")->fetch();

    if (!$project) {
        respond(getDefaultProjectData(), 200);
    }

    $pid = (int)$project['id'];

    $owner = $pdo->query("SELECT * FROM owner WHERE project_id = $pid")->fetch() ?: [];
    $loc   = $pdo->query("SELECT * FROM location WHERE project_id = $pid")->fetch() ?: [];
    $scope = $pdo->query("SELECT * FROM scope WHERE project_id = $pid")->fetch() ?: [];
    $req   = $pdo->query("SELECT * FROM requirements WHERE project_id = $pid")->fetch() ?: [];
    $legal = $pdo->query("SELECT * FROM legal_compliance WHERE project_id = $pid")->fetch() ?: [];
    $fin   = $pdo->query("SELECT * FROM financials WHERE project_id = $pid")->fetch() ?: [];
    $tl    = $pdo->query("SELECT * FROM timeline WHERE project_id = $pid")->fetch() ?: [];

    $delivs = $pdo->query("SELECT * FROM deliverables WHERE project_id = $pid")->fetchAll();
    $evals  = $pdo->query("SELECT * FROM evaluation_criteria WHERE project_id = $pid")->fetchAll();
    $risks  = $pdo->query("SELECT * FROM risks WHERE project_id = $pid")->fetchAll();
    $demos  = $pdo->query("SELECT * FROM portfolio_demos")->fetchAll();

    $out = [
        'meta' => [
            'project_id' => $project['project_id'],
            'title_ar'   => $project['title_ar'],
            'title_en'   => $project['title_en'],
            'status'     => $project['status'],
            'priority'   => $project['priority'],
            'created_at' => $project['created_at'],
            'updated_at' => $project['updated_at'],
            'owner' => [
                'name'    => $owner['name'] ?? '',
                'company' => $owner['company'] ?? '',
                'email'   => $owner['email'] ?? '',
                'phone'   => $owner['phone'] ?? '',
            ],
        ],
        'location' => [
            'city'              => $loc['city'] ?? '',
            'district'          => $loc['district'] ?? '',
            'street'            => $loc['street'] ?? '',
            'road_width_m'      => $loc['road_width_m'] !== null ? (float)$loc['road_width_m'] : null,
            'building_height_m' => $loc['building_height_m'] !== null ? (float)$loc['building_height_m'] : null,
            'facade_area_m2'    => $loc['facade_area_m2'] !== null ? (float)$loc['facade_area_m2'] : null,
            'coordinates' => [
                'lat' => $loc['lat'] !== null ? (float)$loc['lat'] : null,
                'lng' => $loc['lng'] !== null ? (float)$loc['lng'] : null,
            ],
        ],
        'scope' => [
            'summary'      => $scope['summary'] ?? '',
            'objectives'   => json_decode($scope['objectives'] ?? '[]', true) ?: [],
            'out_of_scope' => json_decode($scope['out_of_scope'] ?? '[]', true) ?: [],
        ],
        'requirements' => [
            'design' => [
                'style'              => $req['design_style'] ?? 'modern',
                'visual_hierarchy'   => (bool)($req['visual_hierarchy'] ?? 0),
                'day_night_views'    => (bool)($req['day_night_views'] ?? 0),
                '3d_visuals'         => (bool)($req['three_d_visuals'] ?? 0),
                'content_simulation' => (bool)($req['content_simulation'] ?? 0),
            ],
            'led' => [
                'type'                        => $req['led_type'] ?? '',
                'area_m2'                     => $req['led_area_m2'] !== null ? (float)$req['led_area_m2'] : null,
                'brightness_nit_min'          => (int)($req['brightness_nit_min'] ?? 0),
                'refresh_rate_hz_min'         => (int)($req['refresh_rate_hz_min'] ?? 0),
                'ip_rating_min'               => $req['ip_rating_min'] ?? '',
                'contrast_ratio_min'          => $req['contrast_ratio_min'] ?? '',
                'power_consumption_w_m2_avg'  => (int)($req['power_avg_w_m2'] ?? 0),
                'power_consumption_w_m2_peak' => (int)($req['power_peak_w_m2'] ?? 0),
                'maintenance_access'          => $req['maintenance_access'] ?? '',
                'control_system'              => $req['control_system'] ?? '',
            ],
            'structural' => [
                'wind_load_standard' => $req['wind_load_standard'] ?? '',
                'substructure'       => $req['substructure'] ?? '',
                'mounting'           => $req['mounting'] ?? '',
                'weight_kg_m2'       => $req['weight_kg_m2'] !== null ? (float)$req['weight_kg_m2'] : null,
            ],
        ],
        'legal_compliance' => [
            'country'                      => $legal['country'] ?? 'SA',
            'municipality_approval'        => (bool)($legal['municipality_approval'] ?? 0),
            'consultant_required'          => (bool)($legal['consultant_required'] ?? 0),
            'max_facade_coverage_percent'  => (int)($legal['max_facade_coverage_percent'] ?? 0),
            'min_distance_from_boundary_m' => $legal['min_distance_from_boundary_m'] !== null ? (float)$legal['min_distance_from_boundary_m'] : null,
            'min_building_height_m'        => $legal['min_building_height_m'] !== null ? (float)$legal['min_building_height_m'] : null,
            'sbc_codes'                    => json_decode($legal['sbc_codes'] ?? '[]', true) ?: [],
            'content_restrictions'         => json_decode($legal['content_restrictions'] ?? '[]', true) ?: [],
        ],
        'deliverables' => array_map(fn($d) => [
            'id'       => $d['code'],
            'name'     => $d['name'],
            'format'   => $d['format'],
            'required' => (bool)$d['required'],
        ], $delivs),
        'financials' => [
            'currency'        => $fin['currency'] ?? 'SAR',
            'budget_estimate' => $fin['budget_estimate'] !== null ? (float)$fin['budget_estimate'] : 12170000,
            'led_cost_per_m2' => [
                'min'      => $fin['led_cost_per_m2_min'] !== null ? (float)$fin['led_cost_per_m2_min'] : 3200,
                'max'      => $fin['led_cost_per_m2_max'] !== null ? (float)$fin['led_cost_per_m2_max'] : 4800,
                'currency' => 'SAR',
            ],
            'installation_cost'     => $fin['installation_cost'] !== null ? (float)$fin['installation_cost'] : 650000,
            'annual_operating_cost' => $fin['annual_operating_cost'] !== null ? (float)$fin['annual_operating_cost'] : 235008,
            'roi_months'            => $fin['roi_months'] !== null ? (int)$fin['roi_months'] : 22,
        ],
        'evaluation_criteria' => array_map(fn($e) => [
            'criterion' => $e['criterion'],
            'weight'    => (int)$e['weight'],
        ], $evals),
        'risks' => array_map(fn($r) => [
            'risk'        => $r['risk'],
            'probability' => $r['probability'],
            'impact'      => $r['impact'],
            'mitigation'  => $r['mitigation'],
        ], $risks),
        'timeline' => [
            'brief_approval'   => $tl['brief_approval'] ?? '2026-10-13',
            'concept_design'   => $tl['concept_design'] ?? '2026-10-20',
            '3d_visuals'       => $tl['three_d_visuals'] ?? '2026-10-27',
            'technical_design' => $tl['technical_design'] ?? '2026-11-10',
            'tender'           => $tl['tender'] ?? '2026-11-20',
            'execution'        => $tl['execution'] ?? '2026-12-15',
            'handover'         => $tl['handover'] ?? '2027-03-01',
        ],
        'portfolio_demos' => $demos ?: getDefaultProjectData()['portfolio_demos'],
        'attachments' => [],
    ];

    respond($out, 200);
} catch (Throwable $e) {
    respond(getDefaultProjectData(), 200);
}