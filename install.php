<?php
require_once __DIR__ . '/api/config.php';

$dsnsToTry = [];
if (strpos(DB_HOST, ':') !== false) {
    list($h, $p) = explode(':', DB_HOST, 2);
    $dsnsToTry[] = "mysql:host=$h;port=$p;charset=" . DB_CHARSET;
}
$dsnsToTry[] = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
$dsnsToTry[] = "mysql:host=127.0.0.1;port=3306;charset=" . DB_CHARSET;
$dsnsToTry[] = "mysql:host=127.0.0.1;port=3307;charset=" . DB_CHARSET;
$dsnsToTry[] = "mysql:host=localhost;charset=" . DB_CHARSET;

$pdo = null;
$lastError = null;

foreach ($dsnsToTry as $dsn) {
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        break;
    } catch (PDOException $e) {
        $lastError = $e;
    }
}

if ($pdo) {
    try {
        $sql = file_get_contents(__DIR__ . '/sql/schema.sql');
        $pdo->exec($sql);
        echo "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'>";
        echo "<title>تثبيت المشروع</title>";
        echo "<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:40px;line-height:1.8}";
        echo "a{color:#38bdf8;margin-left:12px;font-weight:bold}h1{color:#4ade80}pre{background:#020617;padding:16px;border-radius:8px}</style>";
        echo "</head><body>";
        echo "<h1>✅ تم إنشاء قاعدة البيانات والجداول بنجاح</h1>";
        echo "<p><b>اسم قاعدة البيانات:</b> " . DB_NAME . "</p>";
        echo "<p><b>عدد الجداول:</b> 11</p>";
        echo "<p><a href='index.html'>→ صفحة العرض الرئيسي والـ 3D Simulation</a> <a href='admin.html'>→ صفحة التحرير والإدارة</a></p>";
        echo "</body></html>";
    } catch (PDOException $e) {
        echo "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'>";
        echo "<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:40px}h1{color:#f87171}pre{background:#020617;padding:16px;border-radius:8px}</style>";
        echo "</head><body>";
        echo "<h1>❌ فشل تنفيذ السكريبت SQL</h1>";
        echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
        echo "</body></html>";
    }
} else {
    echo "<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'>";
    echo "<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;padding:40px}h1{color:#f87171}pre{background:#020617;padding:16px;border-radius:8px}</style>";
    echo "</head><body>";
    echo "<h1>❌ فشل الاتصال بخادم MySQL</h1>";
    echo "<pre>" . htmlspecialchars($lastError ? $lastError->getMessage() : 'تأكد من تشغيل XAMPP MySQL') . "</pre>";
    echo "</body></html>";
}