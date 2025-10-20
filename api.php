<?php
require_once 'config.php';
header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'save_setoran':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO setoran (tanggal, nama_karyawan, jam_masuk, jam_keluar, nomor_awal, nomor_akhir, total_liter, qris, cash, total_setoran, total_pengeluaran, total_pemasukan, total_keseluruhan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                date('Y-m-d'),
                $data['nama_karyawan'],
                $data['jam_masuk'],
                $data['jam_keluar'],
                $data['nomor_awal'],
                $data['nomor_akhir'],
                $data['total_liter'],
                $data['qris'],
                $data['cash'],
                $data['total_setoran'],
                $data['total_pengeluaran'],
                $data['total_pemasukan'],
                $data['total_keseluruhan']
            ]);
            
            $setoran_id = $pdo->lastInsertId();
            
            // Save pengeluaran items
            if (!empty($data['pengeluaran'])) {
                $stmt = $pdo->prepare("INSERT INTO pengeluaran (setoran_id, description, amount) VALUES (?, ?, ?)");
                foreach ($data['pengeluaran'] as $item) {
                    $stmt->execute([$setoran_id, $item['description'], $item['amount']]);
                }
            }
            
            // Save pemasukan items
            if (!empty($data['pemasukan'])) {
                $stmt = $pdo->prepare("INSERT INTO pemasukan (setoran_id, description, amount) VALUES (?, ?, ?)");
                foreach ($data['pemasukan'] as $item) {
                    $stmt->execute([$setoran_id, $item['description'], $item['amount']]);
                }
            }
            
            echo json_encode(['success' => true, 'message' => 'Data berhasil disimpan', 'id' => $setoran_id]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
        
    case 'get_history':
        try {
            $stmt = $pdo->query("SELECT * FROM setoran ORDER BY created_at DESC LIMIT 10");
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $history]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>