<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'error' => 'يجب استخدام POST'], 405);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['meta'])) {
    respond(['ok' => false, 'error' => 'JSON غير صالح أو meta مفقود'], 400);
}

try {
    $pdo = db();
    $pdo->beginTransaction();

    $m = $data['meta'];
    $projectId = $m['project_id'] ?? 'MALL-LED-001';

    $pdo->prepare("
        INSERT INTO projects (project_id, title_ar, title_en, status, priority, updated_at)
        VALUES (?,?,?,?,?,CURRENT_DATE)
        ON DUPLICATE KEY UPDATE
            title_ar=VALUES(title_ar), title_en=VALUES(title_en),
            status=VALUES(status), priority=VALUES(priority),
            updated_at=CURRENT_DATE
    ")->execute([
        $projectId, $m['title_ar'] ?? '', $m['title_en'] ?? '',
        $m['status'] ?? 'draft', $m['priority'] ?? 'medium',
    ]);

    $pid = (int)$pdo->query("SELECT id FROM projects WHERE project_id = " . $pdo->quote($projectId))->fetchColumn();

    $o = $m['owner'] ?? [];
    $pdo->prepare("
        INSERT INTO owner (project_id, name, company, email, phone) VALUES (?,?,?,?,?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company),
            email=VALUES(email), phone=VALUES(phone)
    ")->execute([$pid, $o['name'] ?? '', $o['company'] ?? '', $o['email'] ?? '', $o['phone'] ?? '']);

    $l = $data['location'] ?? [];
    $pdo->prepare("
        INSERT INTO location (project_id, city, district, street, road_width_m, building_height_m, facade_area_m2, lat, lng)
        VALUES (?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE city=VALUES(city), district=VALUES(district),
            street=VALUES(street), road_width_m=VALUES(road_width_m),
            building_height_m=VALUES(building_height_m), facade_area_m2=VALUES(facade_area_m2),
            lat=VALUES(lat), lng=VALUES(lng)
    ")->execute([
        $pid, $l['city'] ?? '', $l['district'] ?? '', $l['street'] ?? '',
        $l['road_width_m'] ?? null, $l['building_height_m'] ?? null, $l['facade_area_m2'] ?? null,
        $l['coordinates']['lat'] ?? null, $l['coordinates']['lng'] ?? null,
    ]);

    $s = $data['scope'] ?? [];
    $pdo->prepare("
        INSERT INTO scope (project_id, summary, objectives, out_of_scope) VALUES (?,?,?,?)
        ON DUPLICATE KEY UPDATE summary=VALUES(summary),
            objectives=VALUES(objectives), out_of_scope=VALUES(out_of_scope)
    ")->execute([
        $pid, $s['summary'] ?? '',
        json_encode($s['objectives'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($s['out_of_scope'] ?? [], JSON_UNESCAPED_UNICODE),
    ]);

    $r = $data['requirements'] ?? [];
    $d = $r['design'] ?? [];
    $led = $r['led'] ?? [];
    $st = $r['structural'] ?? [];
    $pdo->prepare("
        INSERT INTO requirements (project_id, design_style, visual_hierarchy, day_night_views, three_d_visuals,
            content_simulation, led_type, led_area_m2, brightness_nit_min, refresh_rate_hz_min, ip_rating_min,
            contrast_ratio_min, power_avg_w_m2, power_peak_w_m2, maintenance_access, control_system,
            wind_load_standard, substructure, mounting, weight_kg_m2)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
            design_style=VALUES(design_style), visual_hierarchy=VALUES(visual_hierarchy),
            day_night_views=VALUES(day_night_views), three_d_visuals=VALUES(three_d_visuals),
            content_simulation=VALUES(content_simulation), led_type=VALUES(led_type),
            led_area_m2=VALUES(led_area_m2), brightness_nit_min=VALUES(brightness_nit_min),
            refresh_rate_hz_min=VALUES(refresh_rate_hz_min), ip_rating_min=VALUES(ip_rating_min),
            contrast_ratio_min=VALUES(contrast_ratio_min), power_avg_w_m2=VALUES(power_avg_w_m2),
            power_peak_w_m2=VALUES(power_peak_w_m2), maintenance_access=VALUES(maintenance_access),
            control_system=VALUES(control_system), wind_load_standard=VALUES(wind_load_standard),
            substructure=VALUES(substructure), mounting=VALUES(mounting), weight_kg_m2=VALUES(weight_kg_m2)
    ")->execute([
        $pid,
        $d['style'] ?? 'modern',
        (int)!empty($d['visual_hierarchy']),
        (int)!empty($d['day_night_views']),
        (int)!empty($d['3d_visuals']),
        (int)!empty($d['content_simulation']),
        $led['type'] ?? 'transparent',
        $led['area_m2'] ?? null,
        (int)($led['brightness_nit_min'] ?? 6000),
        (int)($led['refresh_rate_hz_min'] ?? 3840),
        $led['ip_rating_min'] ?? 'IP65',
        $led['contrast_ratio_min'] ?? '40000:1',
        (int)($led['power_consumption_w_m2_avg'] ?? 150),
        (int)($led['power_consumption_w_m2_peak'] ?? 800),
        $led['maintenance_access'] ?? 'front_and_back',
        $led['control_system'] ?? 'CMS',
        $st['wind_load_standard'] ?? 'ASCE/SEI 7',
        $st['substructure'] ?? '',
        $st['mounting'] ?? '',
        $st['weight_kg_m2'] ?? null,
    ]);

    $lc = $data['legal_compliance'] ?? [];
    $pdo->prepare("
        INSERT INTO legal_compliance (project_id, country, municipality_approval, consultant_required,
            max_facade_coverage_percent, min_distance_from_boundary_m, min_building_height_m,
            sbc_codes, content_restrictions)
        VALUES (?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE country=VALUES(country),
            municipality_approval=VALUES(municipality_approval),
            consultant_required=VALUES(consultant_required),
            max_facade_coverage_percent=VALUES(max_facade_coverage_percent),
            min_distance_from_boundary_m=VALUES(min_distance_from_boundary_m),
            min_building_height_m=VALUES(min_building_height_m),
            sbc_codes=VALUES(sbc_codes), content_restrictions=VALUES(content_restrictions)
    ")->execute([
        $pid, $lc['country'] ?? 'SA',
        (int)!empty($lc['municipality_approval']),
        (int)!empty($lc['consultant_required']),
        (int)($lc['max_facade_coverage_percent'] ?? 80),
        $lc['min_distance_from_boundary_m'] ?? 2.5,
        $lc['min_building_height_m'] ?? 15,
        json_encode($lc['sbc_codes'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($lc['content_restrictions'] ?? [], JSON_UNESCAPED_UNICODE),
    ]);

    $f = $data['financials'] ?? [];
    $pdo->prepare("
        INSERT INTO financials (project_id, currency, budget_estimate,
            led_cost_per_m2_min, led_cost_per_m2_max, installation_cost,
            annual_operating_cost, roi_months)
        VALUES (?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE currency=VALUES(currency),
            budget_estimate=VALUES(budget_estimate),
            led_cost_per_m2_min=VALUES(led_cost_per_m2_min),
            led_cost_per_m2_max=VALUES(led_cost_per_m2_max),
            installation_cost=VALUES(installation_cost),
            annual_operating_cost=VALUES(annual_operating_cost),
            roi_months=VALUES(roi_months)
    ")->execute([
        $pid, $f['currency'] ?? 'SAR',
        $f['budget_estimate'] ?? null,
        $f['led_cost_per_m2']['min'] ?? null,
        $f['led_cost_per_m2']['max'] ?? null,
        $f['installation_cost'] ?? null,
        $f['annual_operating_cost'] ?? null,
        $f['roi_months'] ?? null,
    ]);

    $t = $data['timeline'] ?? [];
    $pdo->prepare("
        INSERT INTO timeline (project_id, brief_approval, concept_design, three_d_visuals,
            technical_design, tender, execution, handover)
        VALUES (?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE brief_approval=VALUES(brief_approval),
            concept_design=VALUES(concept_design), three_d_visuals=VALUES(three_d_visuals),
            technical_design=VALUES(technical_design),
            tender=VALUES(tender), execution=VALUES(execution), handover=VALUES(handover)
    ")->execute([
        $pid, $t['brief_approval'] ?? null, $t['concept_design'] ?? null,
        $t['3d_visuals'] ?? null, $t['technical_design'] ?? null,
        $t['tender'] ?? null, $t['execution'] ?? null, $t['handover'] ?? null,
    ]);

    $pdo->exec("DELETE FROM deliverables WHERE project_id = $pid");
    foreach (($data['deliverables'] ?? []) as $d) {
        $pdo->prepare("INSERT INTO deliverables (project_id, code, name, format, required) VALUES (?,?,?,?,?)")
            ->execute([$pid, $d['id'] ?? '', $d['name'] ?? '', $d['format'] ?? '', (int)!empty($d['required'])]);
    }

    $pdo->exec("DELETE FROM evaluation_criteria WHERE project_id = $pid");
    foreach (($data['evaluation_criteria'] ?? []) as $e) {
        $pdo->prepare("INSERT INTO evaluation_criteria (project_id, criterion, weight) VALUES (?,?,?)")
            ->execute([$pid, $e['criterion'] ?? '', (int)($e['weight'] ?? 0)]);
    }

    $pdo->exec("DELETE FROM risks WHERE project_id = $pid");
    foreach (($data['risks'] ?? []) as $r) {
        $pdo->prepare("INSERT INTO risks (project_id, risk, probability, impact, mitigation) VALUES (?,?,?,?,?)")
            ->execute([$pid, $r['risk'] ?? '', $r['probability'] ?? 'medium', $r['impact'] ?? 'medium', $r['mitigation'] ?? '']);
    }

    $pdo->commit();
    respond(['ok' => true, 'saved_at' => date('c'), 'project_db_id' => $pid]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    respond(['ok' => false, 'error' => $e->getMessage()], 500);
}