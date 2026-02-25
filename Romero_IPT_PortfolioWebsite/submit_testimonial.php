<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$role    = trim($_POST['role'] ?? '');
$message = trim($_POST['message'] ?? '');
$rating  = (int)($_POST['rating'] ?? 3);

// Validation
if (empty($name)) {
    echo json_encode(['success' => false, 'error' => 'Name is required.']);
    exit;
}
if (mb_strlen($message) < 15) {
    echo json_encode(['success' => false, 'error' => 'Message must be at least 15 characters.']);
    exit;
}
if ($rating < 1 || $rating > 5) {
    $rating = 3;
}

$stmt = $pdo->prepare(
    'INSERT INTO testimonials (name, role, message, rating) VALUES (?, ?, ?, ?)'
);
$stmt->execute([$name, $role ?: null, $message, $rating]);

echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);