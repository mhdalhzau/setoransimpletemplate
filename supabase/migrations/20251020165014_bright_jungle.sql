-- Database Structure Backup for Setoran Harian
-- Created: <?= date('Y-m-d H:i:s') ?>

CREATE DATABASE IF NOT EXISTS `setoran_harian` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `setoran_harian`;

-- Table structure for table `setoran`
CREATE TABLE IF NOT EXISTS `setoran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tanggal` date NOT NULL,
  `nama_karyawan` varchar(100) NOT NULL,
  `jam_masuk` time NOT NULL,
  `jam_keluar` time NOT NULL,
  `nomor_awal` int(11) NOT NULL,
  `nomor_akhir` int(11) NOT NULL,
  `total_liter` decimal(10,2) NOT NULL,
  `qris` int(11) NOT NULL DEFAULT 0,
  `cash` int(11) NOT NULL,
  `total_setoran` int(11) NOT NULL,
  `total_pengeluaran` int(11) NOT NULL DEFAULT 0,
  `total_pemasukan` int(11) NOT NULL DEFAULT 0,
  `total_keseluruhan` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `pengeluaran`
CREATE TABLE IF NOT EXISTS `pengeluaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setoran_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `setoran_id` (`setoran_id`),
  CONSTRAINT `pengeluaran_ibfk_1` FOREIGN KEY (`setoran_id`) REFERENCES `setoran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for table `pemasukan`
CREATE TABLE IF NOT EXISTS `pemasukan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setoran_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `setoran_id` (`setoran_id`),
  CONSTRAINT `pemasukan_ibfk_1` FOREIGN KEY (`setoran_id`) REFERENCES `setoran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional)
-- INSERT INTO `setoran` (`tanggal`, `nama_karyawan`, `jam_masuk`, `jam_keluar`, `nomor_awal`, `nomor_akhir`, `total_liter`, `qris`, `cash`, `total_setoran`, `total_keseluruhan`) VALUES
-- (CURDATE(), 'John Doe', '08:00:00', '17:00:00', 1000, 1100, 100.00, 50000, 1100000, 1150000, 1150000);