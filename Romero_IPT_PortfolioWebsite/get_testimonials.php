<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'db.php';

$stmt = $pdo->query('SELECT id, name, role, message, rating, created_at FROM testimonials ORDER BY created_at DESC');
$testimonials = $stmt->fetchAll();

echo json_encode(['success' => true, 'data' => $testimonials]);