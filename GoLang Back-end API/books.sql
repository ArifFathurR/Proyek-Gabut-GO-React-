-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2026 at 05:28 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `books`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `user_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'akan_dibaca'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `year`, `user_id`, `image_url`, `status`) VALUES
(7, 'Book with Image', 'Tester', 2025, 2, 'http://localhost:8080/uploads/1770834006457497500.png', 'akan_dibaca'),
(8, 'Penance', 'Minato Kanae', 2025, 1, 'http://localhost:8080/uploads/1770834051718645800.jpg', 'finished'),
(9, 'Girls In The Dark', 'Akiyoshi Rikako', 2014, 1, 'http://localhost:8080/uploads/1770836101697996500.jpg', 'finished'),
(10, 'Motherhood', 'Minato Kanae', 2024, 1, 'http://localhost:8080/uploads/1770836159834922600.jpg', 'finished'),
(11, 'Memory Of Glass', 'Akiyoshi Rikako', 2025, 1, 'http://localhost:8080/uploads/1770836228202662900.jpg', 'finished'),
(12, 'Masked Ward', 'Chinen Mikoto', 2024, 1, 'http://localhost:8080/uploads/1770836305556936500.jpg', 'finished'),
(13, 'Confessions', 'Minoto Kanae', 2019, 1, 'http://localhost:8080/uploads/1770836354396437700.jpg', 'finished'),
(14, 'Platina Data', 'Keigo Higashino', 2025, 1, 'http://localhost:8080/uploads/1770836439606814400.jpg', 'finished'),
(15, 'The Devotion of Suspect-X', 'Keigo Higashino', 2005, 1, 'http://localhost:8080/uploads/1770836502483720300.jpg', 'finished'),
(16, 'Masquerade Hotel', 'Keigo Higashino', 2011, 1, 'http://localhost:8080/uploads/1770836571970092100.jpg', 'reading'),
(17, 'Goodbye Eri', 'Tatsuki Fujimoto', 2024, 1, 'http://localhost:8080/uploads/1770836659229779500.jpg', 'finished'),
(18, 'Black Showman Dan Pembunuhan Di Kota Tak Bernama', 'Keigo Higashino', 2021, 1, 'http://localhost:8080/uploads/1770836703584808800.jpg', 'finished'),
(19, '22 - 26', 'Tatsuki Fujimoto', 2025, 1, 'http://localhost:8080/uploads/1770836786329611100.jpg', 'reading'),
(20, 'Enam Mahasiswa Pembohong', 'Akinari Asakura', 2023, 1, 'http://localhost:8080/uploads/1770836833225901000.jpg', 'on_hold'),
(21, '86 Vol 4', 'Asato Asato', 2025, 1, 'http://localhost:8080/uploads/1770836942788488900.jpg', 'on_hold'),
(22, 'The Abc Murders', 'Agatha Christie', 1965, 1, 'http://localhost:8080/uploads/1770837003341022300.jpg', 'finished'),
(23, 'And Then There Were None', 'Agatha Christie', 2021, 1, 'http://localhost:8080/uploads/1770837078483425400.jpg', 'reading'),
(24, 'A Suspicious Secondhand Shop', 'Michio Shusuke', 2011, 1, 'http://localhost:8080/uploads/1770837189958771400.jpg', 'reading'),
(25, 'Teka Teki Rumah Aneh', 'Uketsu', 2013, 1, 'http://localhost:8080/uploads/1770837258990777900.jpg', 'finished');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `bio` text,
  `avatar_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `bio`, `avatar_url`) VALUES
(1, 'arif@gmail.com', '$2a$10$LzbaTJESqOG6LJ4yHgWgRuqPNFElBigo9B1fBLGu8kBtEYzQrndca', 'tesss', ''),
(2, 'upload_test_1770834006', '$2a$10$oj1.ZC7Vf6rrSAsi4xjhT.Ov2TSmyE5HD2.KKCNRMZk3DDArKAkxK', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
