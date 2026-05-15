-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 11:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cmps-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `created_at`) VALUES
(1, 'Technical Support', 'Issues related to software bugs, login problems, or system errors.', '2026-04-07 09:24:34'),
(2, 'Billing & Payments', 'Disputes regarding invoices, overcharges, or payment failures.', '2026-04-07 09:24:34'),
(3, 'Customer Service', 'Complaints regarding staff behavior or communication delays.', '2026-04-07 09:24:34'),
(4, 'Facility Maintenance', 'Physical issues like broken equipment, plumbing, or lighting.', '2026-04-07 09:24:34'),
(5, 'Privacy & Security', 'Concerns regarding data breaches or unauthorized access.', '2026-04-07 09:24:34'),
(6, 'Product Quality', 'Complaints about physical goods being damaged or not as described.', '2026-04-07 09:24:34'),
(7, 'Delivery & Logistics', 'Issues with shipping times, tracking, or lost packages.', '2026-04-07 09:24:34'),
(8, 'Account Management', 'Requests for account deletion, verification, or profile changes.', '2026-04-07 09:24:34'),
(9, 'Feature Requests', 'Suggestions for new functionality or improvements.', '2026-04-07 09:24:34'),
(10, 'Legal & Compliance', 'Reports regarding policy violations or regulatory concerns.', '2026-04-07 09:24:34');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `complaint_id` varchar(36) NOT NULL,
  `usr_id` varchar(36) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description_ciphertext` varbinary(2048) DEFAULT NULL,
  `description_iv` varbinary(12) DEFAULT NULL,
  `description_tag` varbinary(16) DEFAULT NULL,
  `status` enum('pending','in_progress','resolved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`complaint_id`, `usr_id`, `category_id`, `title`, `description_ciphertext`, `description_iv`, `description_tag`, `status`, `created_at`, `updated_at`) VALUES
('CMP-1775554761-af3bb689', 'USR-1775555522-0db4f', 1, 'Lorem Ipsum 4 Paragraph', 0x2344f737372de8715728b690cc32777a14d9d639637693aca935dfa5f04ba9de6a4348323f07f1bace7eda9a60a5b2acb871e20610820636b742bf4cf934dac1a8096e6158023400d1d7c44415e220027198b40fcfdb7b5b912568302ed0c72debd8066e8c83ecd9af00738b3a9a2f14dbec19acc2619a4d13a2a75c517086f0638d06eac6847af77e65cecbda61eb5fb03b6167877e08d943d847b3ab7a2d57c230c57adc80755a124bd52085f3ac7a53e08734ef28306a0aef7b4d80f8cba0014c2799088b75d00ae5cceb0fe9a13c59c82e6b0cb936a3b944ee4aecad20ba1299f0f9f68727a455e51b4c7240b36a93e03a2b29c681966cae041425cc704726c28e5c2163d006697ceea5ac93028b3246bacc0379e05e2d217aaf69bd3a693bfb0c3e10fec02fb29f368c2dc3f534dbc2df6467f46f2ac26b3918fcbe9b796f447a66ff9ed1d32336c138189795bd78f69bd953dd1e1b780fc9b73d5484240a233758561c43833424d2595fcbf965a3ea814de36f7e13f82594446194c72db511f1bb5dde611aa1c76d6bb2212c9f2db69c97b727db9d7538512ebeeea90a38dfb9a89a274a84aefa258e39c6daa27a99d78669753115436f72b0b243893d6f7b821ff1427ab0b1d58535bbb035241733e1245d90337ffd1e6f155c402297764ee5ccc11b120befdc5203f761aa64ca8045d01e40c666f1a0b78f6e3413826de9b4ed4dded5b5f0b3711fdd63ba398fdd96338113cd7b9ffe02b7306a21a3ddb5940a47e6574d3d7d9537ee951bae8d27316b21a3fdfb5da0c13f4ab3cb0f94a74c5166cd08a19c1999a3a50bc223e57ab33894088f22a44892422dd74ca6755c638d24e7d9e66eb1b26c0a08173d3109fe940485a1b42412fabccaaf52788667789cd456132284613c1e10e5286250af9ec7b18a98267400ccccebbcb34b0c7dae233b0954543e2ec98b54a40d4d51b43156451f723bacba7f42ac7aa059569d6961a3c5232b351584ea37a38a4a86600e18f317ff195cd59ea4cac615adbe080cd64a9109b0153b7795c4fb476e250d98ca8b40a43e39d03856fa98c243b18ef955c66968eb7a60733fcc77e5046a405408449d55f7859a8d667455cd05f68d07f2f45b1605f0d1a723f135df144b73d25ae80c3ef7771bbf8742104a943bcdbf1c531c398f78a3deb1d7450f47e352b3750cd44fbd9b5cd900d956a399c4c561767a9fd2b5ed398e5498d0a7a9b842b5fc4ee3e830622811ca3773100f9dc7f0ba04ce291559763db3ec14a6d6dcb8630680804da476737a1b6c59ab2b812ef040c24d7105b0f91bf17a9bc77df224f8984a98f97d0ddbaaab3c767ead9847592a2840d44e5fbf6ce90bf472d9ce5e9d2ba189aab994f8da9f23cd6a1dc24a6935f0c67e12ed5156db13bd83764b1587dd13e21b7fe73f25e212ff6a2cd36ae181810e6fe253717f0664f67307f401b8a08609f2d0810e2ea79326371a6db728a7a292100573873c8f87937b85f57f67960d6967ca42b4a00973acf6fdbc9070081f84186c596dc33b11b617e35342092da2387a2fa6b89baf65bb82723aea4cc32eca50daafdf5569050ddfdeb9126358f29ae2a40b921b401f77566ac7a1cadc6ead014d49fa096c1154ff9f04eabb994af21b36e34aaf14b8d0b884f591e2803466c7612ac682dca1afa593040b78ef2435987902788346bd2ed048e44caecc08083d5fb84dd1d434148fc4577a68fb56bde9d97b9f33d322a629a93ef30a3e9af00bb87d027a3af525811f34a77c10f534e433ac5432e025d19775d9208ca59e79fb6c9bdd95bba3e915f987abcaa9e0200e2d7eb7deaa251ded6c1d231e5ca5509f75a9ae548d8e0188925946a7e4bb8557960d1649d46258b96c1fcf8c4d2457ce8e0d38cafe02ac47673251b6502c458fe61d787b25f230a0e31d8acd52b87ab47622050e2e0e007ab3b45b88703c51a36a551ac014b3baed54aee3df8b80c45be29fca1cdd226296bf107c8b2b680a602dee5df34ac189b0d648ee3ddbceeac8bba0e76cfa6a4baa0adba927879562a177f3e32071670a0b27d275142f2db094c958fdff08c96341c550f106ef9f8d8984afaab7b7312bd35f4fc69e6a75d50177ab5fe7e80546a40fd843703c8647fe2805fc93d79ae98e6a7d56955fbc43f4a7021e5af379cd1dfb0f434d7a7a58977355a376b031ed8f8366a1338ab49ed1d8e18e48d89e6118491b65f14e2aa0a3b4138cdec983927d07b8cf5100f06d08154416e3a27ece9d9b19cff5d16f8e977ec30cb3bcd5784e47ca9e4576c424de805e9d5bfe845ddef4e6ce6508849026f543315b2a00f3909e328109c95542a6caadeba7dad4acec0a15f8d3dfc4a74c36886dc9533ee453e8d46436f44067a319fbea10d2b14a281e24dd49f94ad0dda7e0d84a88880c68ed6ade273ed256118d4c57e3425ec558809c7756c85ec44c, 0x03c157754ebfa084bbee9d94, 0x595b68d58ba4ebbe8629c4821314aace, 'resolved', '2026-04-07 09:39:21', '2026-04-07 10:08:58');

-- --------------------------------------------------------

--
-- Table structure for table `complaint_responses`
--

CREATE TABLE `complaint_responses` (
  `response_id` varchar(36) NOT NULL,
  `complaint_id` varchar(36) NOT NULL,
  `admin_id` varchar(36) NOT NULL,
  `response_ciphertext` varbinary(500) NOT NULL,
  `response_iv` varbinary(12) NOT NULL,
  `response_tag` varbinary(16) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint_responses`
--

INSERT INTO `complaint_responses` (`response_id`, `complaint_id`, `admin_id`, `response_ciphertext`, `response_iv`, `response_tag`, `created_at`) VALUES
('RES-1775555822-672028e7', 'CMP-1775554761-af3bb689', 'USR-1775198835-23099', 0x66bf4d0d2f94be8245eac86f51a95d594ab7e628212688b890a2eb689dee03e287fd038ead6737f5531fec034b0382c4f295c40df69829da13a947cac5390c4bdf9895445fa86cb86b5d874171f948aa482cc7830d116d2a3c69f8e5ea31393660cf363c819f731675311d147dfd1d2a69a345e913daf8be8f96129a12a9bcaa586882a6750ea021a8b00079fbb5d8334bedc15531ec26c4538bca1f6bc41a37c4bf9a4db6de1b620efb97c74a36a489f86ce0a339b63961b1a85518957c3ae0ed7cc94904d18822155cc986b055865ed186af93da53887f4eab96099b928e4997bdcb70e86b1d3606d0e789a6fd7079e371e6b6dc68c83114eea3e5951a9ca8c8a0c3bbf99390bb2427e48d2f46dc9ec667b7fa520eba1737365c3b149af5b729b449640678851fbae3854b47dce708f76cfbd05aa918ab19443b2241917c1c5b8bea177b0abb7a97416aeaf31f0f6cb2ab9f27de4668f683cf8f2de50d20a0cf71bd129b01eab33174f868d29db5dcec70583f17b8c09a93227c3fed27741abf4f844706f4bb30ba69192fc014da18825030cbd56e6cd95a28940548007af7fe81c393b47d75655689a561465f84629f37d581c04a5bae58b3ddc5b033df49500f22850b54947a4a9848bff7ec6276f109105c9d151321366585486e978115f23247c1df6be80ac6226ddc08b1be6327bed50c, 0xc421822fe17abb51409241dd, 0xff653186f018be7d2c896905dd6cdad8, '2026-04-07 09:57:02');

-- --------------------------------------------------------

--
-- Table structure for table `complaint_status_logs`
--

CREATE TABLE `complaint_status_logs` (
  `log_id` int(11) NOT NULL,
  `complaint_id` varchar(36) NOT NULL,
  `changed_by` varchar(36) NOT NULL,
  `old_status` enum('pending','in_progress','resolved','rejected') DEFAULT NULL,
  `new_status` enum('pending','in_progress','resolved','rejected') DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint_status_logs`
--

INSERT INTO `complaint_status_logs` (`log_id`, `complaint_id`, `changed_by`, `old_status`, `new_status`, `changed_at`) VALUES
(1, 'CMP-1775554761-af3bb689', 'USR-1775198835-23099', 'pending', 'in_progress', '2026-04-07 09:54:36'),
(2, 'CMP-1775554761-af3bb689', 'USR-1775198835-23099', 'in_progress', 'resolved', '2026-04-07 10:08:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `usr_id` varchar(20) NOT NULL,
  `usr_name` varchar(100) NOT NULL,
  `email_hash` varchar(64) NOT NULL,
  `email_ciphertext` varbinary(255) NOT NULL,
  `email_iv` varbinary(16) NOT NULL,
  `email_tag` varbinary(16) NOT NULL,
  `phone_ciphertext` varbinary(255) NOT NULL,
  `phone_iv` varbinary(16) NOT NULL,
  `phone_tag` varbinary(16) NOT NULL,
  `usr_password` varchar(60) NOT NULL,
  `usr_role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`usr_id`, `usr_name`, `email_hash`, `email_ciphertext`, `email_iv`, `email_tag`, `phone_ciphertext`, `phone_iv`, `phone_tag`, `usr_password`, `usr_role`, `created_at`, `updated_at`) VALUES
('USR-1775198835-23099', 'Alex Benson', 'd5f9125006de5655fe06a95d7b275e49c4958dc31b8d28c7d6d9af55bec5de1c', 0x68e5b256a29a0dd8b303116579f6aa296e3ead833b, 0xe01189d23e343d0485c73739, 0xa361b7742a8975ef6c9e17723f5029e4, 0x21a654255d1b0b6e99c9b1, 0x7a054d1c61d180660eddf94a, 0x37c4787c5a4f5ad02f649050162b2812, '$2y$10$8jTyY3WECTIp3DacpMmap.kWmjjPn9VVZ0k4Fhl8XeBE.2DKcA5We', 'admin', '2026-04-03 06:47:15', '2026-04-07 09:53:24'),
('USR-1775555522-0db4f', 'John Doe', 'cc3d8ad23fd86bb20859a75fb441a523f5a899e4434f1fb390eece7f544d8ff2', 0x34471c64f6208b4dbc7c40a15142cfd7d039, 0xa337e811a9f2f60bffa1a987, 0xed3d384a9b55f8cf38da3f9a29a8a246, 0x1117d52c8b2f3cb997b0e8, 0x45b57ce9ab9baae3bc94c9a6, 0x5930c1fa8c97d2fbae45cdf3caf37fce, '$2y$10$6Xs6lA5iGZxqaukkc.fD8.vhdacl0YdhyvcrWtP0aKlPRCsPuCRxm', 'user', '2026-04-07 09:52:02', '2026-04-09 07:55:07'),
('USR-1775715605-80f75', 'Jane Smith', '74a0b260cd744c4a194f3b3261175836000aa7c7707faaa280ddd02aff6e6959', 0x4462767c8832dc50f4d68c4496e19ed448324865, 0x1f50226155ba781c8eaaffae, 0xa103970f89c81c40a6a3ac0cfc29b783, '', '', '', '$2y$10$H8e4jXO5VCLfl8KQkrwfWedO3ZWnWfbInz4cTWalWVeeP9l6zFW6e', 'user', '2026-04-09 06:20:05', '2026-04-09 06:20:05'),
('USR-1775716362-ee5f4', 'Alice Chan', 'e6bc65eb3e8473c2683968d4035dc7bf426d8784df32f27fc0627af8f916199a', 0x8e2dd97d56576fef13aafca8ea73c45bdc37d17d, 0x62ee38036893727c4ce43ef3, 0x640b686d325cb85211274a494fb8fb96, '', '', '', '$2y$10$uIXCygTRFE7KhTN3wYpTi.pLLHtJQTDm5smRGmdGwVJDZIqvbqXw.', 'user', '2026-04-09 06:32:42', '2026-04-09 06:32:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`complaint_id`),
  ADD KEY `idx_complaints_user` (`usr_id`),
  ADD KEY `idx_complaints_status` (`status`),
  ADD KEY `idx_complaints_category` (`category_id`);

--
-- Indexes for table `complaint_responses`
--
ALTER TABLE `complaint_responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `complaint_id` (`complaint_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `complaint_status_logs`
--
ALTER TABLE `complaint_status_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `complaint_id` (`complaint_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`usr_id`),
  ADD UNIQUE KEY `email_hash` (`email_hash`),
  ADD KEY `idx_users_email_hash` (`email_hash`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `complaint_status_logs`
--
ALTER TABLE `complaint_status_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`usr_id`) REFERENCES `users` (`usr_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `complaint_responses`
--
ALTER TABLE `complaint_responses`
  ADD CONSTRAINT `complaint_responses_ibfk_1` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `complaint_responses_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`usr_id`);

--
-- Constraints for table `complaint_status_logs`
--
ALTER TABLE `complaint_status_logs`
  ADD CONSTRAINT `complaint_status_logs_ibfk_1` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`complaint_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `complaint_status_logs_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`usr_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
