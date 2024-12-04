-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Dec 04. 09:10
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `video_portal`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `country`
--

CREATE TABLE `country` (
  `country_id` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `country`
--

INSERT INTO `country` (`country_id`, `country`) VALUES
('af', 'Afrikaans'),
('am', 'Amhara'),
('ar', 'Arab'),
('az', 'Azerbajdzsáni'),
('bg', 'Bolgár'),
('bn', 'Bengáli'),
('bs', 'Bosnyák'),
('ca', 'Katalán'),
('ceb', 'Cebuano'),
('cs', 'Cseh'),
('cy', 'Walesi'),
('da', 'Dán'),
('de', 'Német'),
('el', 'Görög'),
('en', 'Angol'),
('eo', 'Eszperantó'),
('es', 'Spanyol'),
('et', 'Észt'),
('eu', 'Baszk'),
('fa', 'Perzsa'),
('fi', 'Finn'),
('fr', 'Francia'),
('ga', 'Ír'),
('gl', 'Galíciai'),
('gu', 'Gujarati'),
('he', 'Héber'),
('hi', 'Hindi'),
('ht', 'Haiti kreol'),
('hu', 'Magyar'),
('id', 'Indonéz'),
('is', 'Izlandi'),
('it', 'Olasz'),
('ja', 'Japán'),
('jv', 'Jávai'),
('ka', 'Grúz'),
('ko', 'Koreai'),
('lo', 'Lao'),
('lt', 'Litván'),
('lv', 'Lett'),
('mk', 'Macedón'),
('ml', 'Malayalam'),
('mn', 'Mongol'),
('ms', 'Maláj'),
('mt', 'Máltai'),
('ne', 'Nepáli'),
('nl', 'Holland'),
('no', 'Norvég'),
('pa', 'Pandzsábi'),
('pl', 'Lengyel'),
('pt', 'Portugál'),
('ro', 'Román'),
('ru', 'Orosz'),
('sk', 'Szlovák'),
('sl', 'Szlovén'),
('sq', 'Albán'),
('sr', 'Szerb'),
('sv', 'Svéd'),
('ta', 'Tamil'),
('te', 'Telugu'),
('th', 'Thai'),
('tr', 'Török'),
('uk', 'Ukrán'),
('ur', 'Urdu'),
('vi', 'Vietnámi'),
('zu', 'Zulu');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `uploaded_files`
--

CREATE TABLE `uploaded_files` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `uploaded_files`
--

INSERT INTO `uploaded_files` (`id`, `user_id`, `file_name`, `file_path`, `uploaded_at`) VALUES
(1, 1, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-14 15:39:40'),
(2, 1, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-14 15:40:20'),
(3, 1, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-14 15:41:38'),
(4, 1, 'test.mp4', './uploaded_videos/test.mp4', '2024-11-14 15:51:01'),
(72, 2, 'and.then.we.danced.2019.internal.bdrip.x264-manic.mp4', './uploaded_videos/and.then.we.danced.2019.internal.bdrip.x264-manic.mp4', '2024-11-20 20:38:48'),
(73, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 20:39:51'),
(74, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 20:42:57'),
(75, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 20:46:21'),
(76, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 20:49:13'),
(77, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 20:56:49'),
(78, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-20 21:15:26'),
(79, 2, 'The.Big.Bang.Theory.S03E07.1080p.BluRay.DD5.1.x264.HUN.ENG-pcroland.mp4', './uploaded_videos/The.Big.Bang.Theory.S03E07.1080p.BluRay.DD5.1.x264.HUN.ENG-pcroland.mp4', '2024-11-20 21:16:56'),
(80, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:36:03'),
(81, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:37:36'),
(82, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:38:09'),
(83, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:44:45'),
(84, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:46:59'),
(85, 2, 'fulcrum-cruella.2021.bdrip-sample.mp4', './uploaded_videos/fulcrum-cruella.2021.bdrip-sample.mp4', '2024-11-21 09:48:59'),
(86, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 09:54:30'),
(87, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 09:59:56'),
(88, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 10:01:51'),
(89, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 10:07:29'),
(90, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 10:09:08'),
(91, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 10:14:18'),
(92, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 10:17:44'),
(93, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:23:21'),
(94, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:24:32'),
(95, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:28:25'),
(96, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:31:46'),
(97, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:34:12'),
(98, 2, 'hereditary.bdrip-no1.mp4', './uploaded_videos/hereditary.bdrip-no1.mp4', '2024-11-21 10:39:37'),
(99, 2, '_sample.mp4', 'http://localhost/video_to_text/uploaded_videos/./uploaded_videos/_sample.mp4', '2024-11-21 11:03:16'),
(100, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 11:07:21'),
(101, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 11:08:30'),
(102, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 11:12:29'),
(103, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 11:12:58'),
(104, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-21 11:15:34'),
(105, 2, 'sample.mp4', './uploaded_videos/sample.mp4', '2024-11-21 11:16:29'),
(106, 2, 'FND_3_4.mp4', './uploaded_videos/FND_3_4.mp4', '2024-11-23 18:40:57'),
(107, 2, 'Friday.Night.Dinner.S03E05.720p.HDTV.x264.HUN-YND.mp4', './uploaded_videos/Friday.Night.Dinner.S03E05.720p.HDTV.x264.HUN-YND.mp4', '2024-11-23 18:42:08'),
(108, 2, 'Friday.Night.Dinner.S03E04.720p.HDTV.x264.HUN-YND.mp4', './uploaded_videos/Friday.Night.Dinner.S03E04.720p.HDTV.x264.HUN-YND.mp4', '2024-11-25 07:29:30'),
(109, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-25 08:30:38'),
(110, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-25 08:38:20'),
(111, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-25 08:54:14'),
(112, 2, '_sample.mp4', './uploaded_videos/_sample.mp4', '2024-11-25 08:56:07'),
(113, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 08:56:50'),
(114, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:04:01'),
(115, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:06:10'),
(116, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:09:02'),
(117, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:12:20'),
(118, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:13:58'),
(119, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:30:36'),
(120, 2, 'Deutsch_A1.1_L4_Im_Restaurant.mp4', './uploaded_videos/Deutsch_A1.1_L4_Im_Restaurant.mp4', '2024-11-25 09:47:18'),
(121, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:49:44'),
(122, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:50:52'),
(123, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:55:31'),
(124, 2, 'video2.mp4', './uploaded_videos/video2.mp4', '2024-11-25 09:57:55'),
(125, 2, 'test.mp4', './uploaded_videos/test.mp4', '2024-11-26 09:31:23'),
(126, 2, 'Deutsch_A1.1_L4_Im_Restaurant.mp4', './uploaded_videos/Deutsch_A1.1_L4_Im_Restaurant.mp4', '2024-11-26 10:28:50'),
(127, 2, 'Deutsch_A1.1_L4_Im_Restaurant.mp4', './uploaded_videos/Deutsch_A1.1_L4_Im_Restaurant.mp4', '2024-11-27 15:47:21'),
(128, 2, 'Deutsch_A1.1_L4_Im_Restaurant.mp4', './uploaded_videos/Deutsch_A1.1_L4_Im_Restaurant.mp4', '2024-11-27 15:47:34'),
(129, 2, 'Deutsch_A1.1_L4_Im_Restaurant.mp4', './uploaded_videos/Deutsch_A1.1_L4_Im_Restaurant.mp4', '2024-11-27 17:39:21'),
(130, 2, 'the.lighthouse.bdrip-trinity.mp4', './uploaded_videos/the.lighthouse.bdrip-trinity.mp4', '2024-11-28 17:49:36'),
(131, 2, 'the.lighthouse.2019.bdrip.x264-geckos.mp4', './uploaded_videos/the.lighthouse.2019.bdrip.x264-geckos.mp4', '2024-12-03 18:36:09');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'ferbenab', '$2y$10$kYoRG0lpxlcA4rK57fRBX.duPXEbpWmmRAC8iUq/W1qcXkQ253mKe', '2024-11-14 15:39:08'),
(2, 'test_elek', '$2y$10$.OQRZKRk.Taf4e1txFPUmu8/xJexoIFfoea6Fquya7BhGCqBpof4u', '2024-11-15 13:39:06');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`country_id`);

--
-- A tábla indexei `uploaded_files`
--
ALTER TABLE `uploaded_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `uploaded_files`
--
ALTER TABLE `uploaded_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `uploaded_files`
--
ALTER TABLE `uploaded_files`
  ADD CONSTRAINT `uploaded_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
