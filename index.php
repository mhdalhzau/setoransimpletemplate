<?php
session_start();

// Get current date in Indonesian format
function getCurrentDate() {
    $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    $months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    $day = $days[date('w')];
    $date = date('j');
    $month = $months[date('n') - 1];
    $year = date('Y');
    
    return "$day, $date $month $year";
}

// Format number with dots as thousand separator
function formatNumber($number) {
    return number_format($number, 0, ',', '.');
}

// Format rupiah
function formatRupiah($amount) {
    return number_format($amount, 0, ',', '.');
}

// Process form data
$namaKaryawan = $_POST['nama_karyawan'] ?? '';
$jamMasuk = $_POST['jam_masuk'] ?? '';
$jamKeluar = $_POST['jam_keluar'] ?? '';
$nomorAwal = (int)($_POST['nomor_awal'] ?? 0);
$nomorAkhir = (int)($_POST['nomor_akhir'] ?? 0);
$qris = (int)($_POST['qris'] ?? 0);

// Calculate values
$totalLiter = max(0, $nomorAkhir - $nomorAwal);
$total = $totalLiter * 11500;
$cash = max(0, $total - $qris);

// Handle pengeluaran and pemasukan
$pengeluaranItems = $_SESSION['pengeluaran'] ?? [];
$pemasukanItems = $_SESSION['pemasukan'] ?? [];

if ($_POST['action'] ?? '' === 'add_pengeluaran') {
    $desc = trim($_POST['pengeluaran_desc'] ?? '');
    $amount = (int)($_POST['pengeluaran_amount'] ?? 0);
    if ($desc && $amount > 0) {
        $pengeluaranItems[] = ['description' => $desc, 'amount' => $amount];
        $_SESSION['pengeluaran'] = $pengeluaranItems;
    }
}

if ($_POST['action'] ?? '' === 'add_pemasukan') {
    $desc = trim($_POST['pemasukan_desc'] ?? '');
    $amount = (int)($_POST['pemasukan_amount'] ?? 0);
    if ($desc && $amount > 0) {
        $pemasukanItems[] = ['description' => $desc, 'amount' => $amount];
        $_SESSION['pemasukan'] = $pemasukanItems;
    }
}

if ($_POST['action'] ?? '' === 'remove_pengeluaran') {
    $index = (int)($_POST['index'] ?? -1);
    if (isset($pengeluaranItems[$index])) {
        unset($pengeluaranItems[$index]);
        $pengeluaranItems = array_values($pengeluaranItems);
        $_SESSION['pengeluaran'] = $pengeluaranItems;
    }
}

if ($_POST['action'] ?? '' === 'remove_pemasukan') {
    $index = (int)($_POST['index'] ?? -1);
    if (isset($pemasukanItems[$index])) {
        unset($pemasukanItems[$index]);
        $pemasukanItems = array_values($pemasukanItems);
        $_SESSION['pemasukan'] = $pemasukanItems;
    }
}

$totalPengeluaran = array_sum(array_column($pengeluaranItems, 'amount'));
$totalPemasukan = array_sum(array_column($pemasukanItems, 'amount'));
$totalKeseluruhan = $cash + $totalPemasukan - $totalPengeluaran;

// Generate report text
function generateReport($namaKaryawan, $jamMasuk, $jamKeluar, $nomorAwal, $nomorAkhir, $totalLiter, $cash, $qris, $total, $pengeluaranItems, $pemasukanItems, $totalPengeluaran, $totalPemasukan, $totalKeseluruhan) {
    $jamKerja = ($jamMasuk && $jamKeluar) ? "($jamMasuk - $jamKeluar)" : '';
    
    $report = "*Setoran Harian* 📋\n";
    $report .= getCurrentDate() . "\n";
    $report .= "🤦‍♀️ Nama: $namaKaryawan\n";
    $report .= "🕐 Jam: $jamKerja\n\n";
    
    $report .= "⛽ Data Meter\n";
    $report .= "• Nomor Awal : " . formatNumber($nomorAwal) . "\n";
    $report .= "• Nomor Akhir: " . formatNumber($nomorAkhir) . "\n";
    $report .= "• Total Liter: " . number_format($totalLiter, 2) . " L\n\n";
    
    $report .= "💰 Setoran\n";
    $report .= "• Cash  : Rp " . formatRupiah($cash) . "\n";
    $report .= "• QRIS  : Rp " . formatRupiah($qris) . "\n";
    $report .= "• Total : Rp " . formatRupiah($total) . "\n\n";
    
    if (!empty($pengeluaranItems)) {
        $report .= "💸 Pengeluaran (PU)\n";
        foreach ($pengeluaranItems as $item) {
            $report .= "• {$item['description']}: Rp " . formatRupiah($item['amount']) . "\n";
        }
        $report .= "Total Pengeluaran: Rp " . formatRupiah($totalPengeluaran) . "\n\n";
    }
    
    if (!empty($pemasukanItems)) {
        $report .= "💵 Pemasukan (PU)\n";
        foreach ($pemasukanItems as $item) {
            $report .= "• {$item['description']}: Rp " . formatRupiah($item['amount']) . "\n";
        }
        $report .= "Total Pemasukan: Rp " . formatRupiah($totalPemasukan) . "\n\n";
    }
    
    $report .= "💼 Total Keseluruhan: Rp " . formatRupiah($totalKeseluruhan);
    
    return $report;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Setoran Harian</title>
    <link rel="shortcut icon" href="https://scontent.fbth7-1.fna.fbcdn.net/v/t39.30808-6/477440850_589520410728667_7020102743555682684_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jrdr1qgu2AYQ7kNvwEJiMMJ&_nc_oc=AdmP9tWSG2fIs97XwFRLZV_U6lLldjcflxr0YgkuLtgl0QyuV_0MGj5ztVrgllUhqAQ&_nc_zt=23&_nc_ht=scontent.fbth7-1.fna&_nc_gid=ZX8bPCLbQjYlucWrE7pSmg&oh=00_AfXN1n6ExVIkUYDVViRWBejXBXGgR9W3s9CdH_N8DT-Oyw&oe=68B619AA">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .modal {
            display: none;
        }
        .modal.show {
            display: flex;
        }
    </style>
</head>
<body class="min-h-screen bg-gray-50 py-4">
    <div class="max-w-2xl mx-auto px-3">
        <div class="bg-white rounded-lg shadow-lg p-4 space-y-6">
            <!-- Title with Date -->
            <div class="border-b pb-3">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    Setoran Harian 📋
                </h2>
                <p class="text-sm text-gray-600"><?= getCurrentDate() ?></p>
            </div>

            <form method="POST" class="space-y-6">
                <!-- Nama Karyawan -->
                <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">🤷‍♂️ Nama Karyawan</h3>
                    <input
                        type="text"
                        name="nama_karyawan"
                        value="<?= htmlspecialchars($namaKaryawan) ?>"
                        class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama karyawan..."
                        required
                    />
                </div>

                <!-- Jam Kerja -->
                <div>
                    <h3 class="text-sm font-medium text-gray-700 mb-2">🕐 Jam Kerja</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Jam Masuk</label>
                            <input
                                type="time"
                                name="jam_masuk"
                                value="<?= htmlspecialchars($jamMasuk) ?>"
                                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Jam Keluar</label>
                            <input
                                type="time"
                                name="jam_keluar"
                                value="<?= htmlspecialchars($jamKeluar) ?>"
                                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                    <?php if ($jamMasuk && $jamKeluar): ?>
                        <div class="mt-2 p-2 bg-blue-50 rounded-lg">
                            <span class="text-sm text-blue-700 font-medium">
                                Jam Kerja: (<?= $jamMasuk ?> - <?= $jamKeluar ?>)
                            </span>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Data Meter -->
                <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        ⛽ Data Meter
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Nomor Awal</label>
                            <input
                                type="number"
                                name="nomor_awal"
                                value="<?= $nomorAwal ?>"
                                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                                required
                                onchange="this.form.submit()"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Nomor Akhir</label>
                            <input
                                type="number"
                                name="nomor_akhir"
                                value="<?= $nomorAkhir ?>"
                                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                                required
                                onchange="this.form.submit()"
                            />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Total Liter</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    value="<?= number_format($totalLiter, 2) ?> L"
                                    readonly
                                    class="w-full p-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                                    <?= number_format($totalLiter, 2) ?> L
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Setoran -->
                <div>
                    <h3 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        💰 Setoran
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Cash</label>
                            <div class="relative">
                                <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                <input
                                    type="text"
                                    value="<?= formatRupiah($cash) ?>"
                                    readonly
                                    class="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">QRIS</label>
                            <div class="relative">
                                <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                <input
                                    type="number"
                                    name="qris"
                                    value="<?= $qris ?>"
                                    class="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                    onchange="this.form.submit()"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Total</label>
                            <div class="relative">
                                <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                <input
                                    type="text"
                                    value="<?= formatRupiah($total) ?>"
                                    readonly
                                    class="w-full p-2.5 pl-8 text-sm border border-green-300 rounded-lg bg-green-50 text-green-700 font-semibold"
                                />
                                <div class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                                    <?= formatRupiah($total) ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <!-- Pengeluaran -->
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-base font-semibold text-gray-800 flex items-center gap-2">
                        💸 Pengeluaran (PU)
                    </h3>
                    <button
                        onclick="showModal('pengeluaranModal')"
                        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        ➕ Tambah Item
                    </button>
                </div>

                <?php foreach ($pengeluaranItems as $index => $item): ?>
                    <div class="flex justify-between items-center p-2.5 bg-red-50 rounded-lg mb-2">
                        <span class="text-sm text-gray-700"><?= htmlspecialchars($item['description']) ?></span>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-red-600 font-semibold">Rp <?= formatRupiah($item['amount']) ?></span>
                            <form method="POST" class="inline">
                                <input type="hidden" name="action" value="remove_pengeluaran">
                                <input type="hidden" name="index" value="<?= $index ?>">
                                <button type="submit" class="text-red-600 hover:text-red-800 text-sm">✕</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>

                <div class="bg-red-100 p-2.5 rounded-lg">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700">Total Pengeluaran:</span>
                        <span class="text-red-600 font-bold text-base">Rp <?= formatRupiah($totalPengeluaran) ?></span>
                    </div>
                </div>
            </div>

            <!-- Pemasukan -->
            <div>
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-base font-semibold text-gray-800 flex items-center gap-2">
                        💵 Pemasukan (PU)
                    </h3>
                    <button
                        onclick="showModal('pemasukanModal')"
                        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        ➕ Tambah Item
                    </button>
                </div>

                <?php foreach ($pemasukanItems as $index => $item): ?>
                    <div class="flex justify-between items-center p-2.5 bg-green-50 rounded-lg mb-2">
                        <span class="text-sm text-gray-700"><?= htmlspecialchars($item['description']) ?></span>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-green-600 font-semibold">Rp <?= formatRupiah($item['amount']) ?></span>
                            <form method="POST" class="inline">
                                <input type="hidden" name="action" value="remove_pemasukan">
                                <input type="hidden" name="index" value="<?= $index ?>">
                                <button type="submit" class="text-red-600 hover:text-red-800 text-sm">✕</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>

                <div class="bg-green-100 p-2.5 rounded-lg">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700">Total Pemasukan:</span>
                        <span class="text-green-600 font-bold text-base">Rp <?= formatRupiah($totalPemasukan) ?></span>
                    </div>
                </div>
            </div>

            <!-- Total Keseluruhan -->
            <div class="bg-gray-900 text-white p-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">💼 Total Keseluruhan:</h3>
                    <div class="text-right">
                        <div class="text-xl font-bold">Rp <?= formatRupiah($totalKeseluruhan) ?></div>
                        <div class="text-xs opacity-75">
                            Setoran: <?= formatRupiah($cash) ?> + Pemasukan: <?= formatRupiah($totalPemasukan) ?> - Pengeluaran: <?= formatRupiah($totalPengeluaran) ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
                <button 
                    onclick="copyToClipboard()"
                    class="flex-1 py-2.5 px-4 text-sm rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                    📋 Copy ke Clipboard
                </button>
            </div>
        </div>
    </div>

    <!-- Pengeluaran Modal -->
    <div id="pengeluaranModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Tambah Pengeluaran</h3>
            <form method="POST">
                <input type="hidden" name="action" value="add_pengeluaran">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <input
                            type="text"
                            name="pengeluaran_desc"
                            class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan keterangan pengeluaran..."
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                        <div class="relative">
                            <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                            <input
                                type="number"
                                name="pengeluaran_amount"
                                class="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 mt-6">
                    <button
                        type="submit"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Tambah
                    </button>
                    <button
                        type="button"
                        onclick="hideModal('pengeluaranModal')"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Pemasukan Modal -->
    <div id="pemasukanModal" class="modal fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Tambah Pemasukan</h3>
            <form method="POST">
                <input type="hidden" name="action" value="add_pemasukan">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <input
                            type="text"
                            name="pemasukan_desc"
                            class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan keterangan pemasukan..."
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                        <div class="relative">
                            <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                            <input
                                type="number"
                                name="pemasukan_amount"
                                class="w-full p-2.5 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div class="flex gap-2 mt-6">
                    <button
                        type="submit"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Tambah
                    </button>
                    <button
                        type="button"
                        onclick="hideModal('pemasukanModal')"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('show');
        }

        function hideModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        function copyToClipboard() {
            const reportText = `<?= addslashes(generateReport($namaKaryawan, $jamMasuk, $jamKeluar, $nomorAwal, $nomorAkhir, $totalLiter, $cash, $qris, $total, $pengeluaranItems, $pemasukanItems, $totalPengeluaran, $totalPemasukan, $totalKeseluruhan)) ?>`;
            
            navigator.clipboard.writeText(reportText).then(() => {
                alert('Laporan berhasil disalin ke clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = reportText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Laporan berhasil disalin ke clipboard!');
            });
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
        });
    </script>
</body>
</html>