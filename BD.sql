CREATE Schema techshop;
use  techshop;

-- Table Client (relation 1:1 avec Utilisateur)
CREATE TABLE Client (
  `clientID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motdepasse` varchar(100) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `tel` int DEFAULT NULL,
  `region` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`clientID`),
  UNIQUE KEY `email` (`email`)
);

-- Table Categorie
CREATE TABLE Categorie (
  `categorieID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`categorieID`)
);

-- Table Produit
CREATE TABLE Produit (
  `produitID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `prix` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `categorieID` int DEFAULT NULL,
  `fournisseurID` int DEFAULT NULL,
  `oldPrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`produitID`),
  KEY `categorieID` (`categorieID`),
  CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`categorieID`) REFERENCES `categorie` (`categorieID`) ON DELETE SET NULL,
  CONSTRAINT `produit_chk_1` CHECK ((`prix` >= 0)),
  CONSTRAINT `produit_chk_2` CHECK ((`stock` >= 0)),
  CONSTRAINT `produit_chk_3` CHECK ((`oldPrice` >= 0))
);

-- Table Panier
CREATE TABLE Panier (
  `panierID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  PRIMARY KEY (`panierID`),
  KEY `clientID` (`clientID`),
  CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE
);

-- Table d’association Panier_Produit (pour gérer les quantités)
CREATE TABLE Panier_Produit (
  `panierID` int NOT NULL,
  `produitID` int NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`panierID`,`produitID`),
  KEY `produitID` (`produitID`),
  CONSTRAINT `panier_produit_ibfk_1` FOREIGN KEY (`panierID`) REFERENCES `panier` (`panierID`) ON DELETE CASCADE,
  CONSTRAINT `panier_produit_ibfk_2` FOREIGN KEY (`produitID`) REFERENCES `produit` (`produitID`) ON DELETE CASCADE,
  CONSTRAINT `panier_produit_chk_1` CHECK ((`quantite` > 0))
);

-- Table Commande
CREATE TABLE Commande (
  `commandeID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  `dateCommande` date NOT NULL,
  `statut` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`commandeID`),
  KEY `clientID` (`clientID`),
  CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE,
  CONSTRAINT `commande_chk_1` CHECK ((`total` >= 0))
);

-- Table d’association Commande_Produit (pour gérer les quantités)
CREATE TABLE Commande_Produit (
  `commandeID` int NOT NULL,
  `produitID` int NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`commandeID`,`produitID`),
  KEY `produitID` (`produitID`),
  CONSTRAINT `commande_produit_ibfk_1` FOREIGN KEY (`commandeID`) REFERENCES `commande` (`commandeID`) ON DELETE CASCADE,
  CONSTRAINT `commande_produit_ibfk_2` FOREIGN KEY (`produitID`) REFERENCES `produit` (`produitID`) ON DELETE CASCADE,
  CONSTRAINT `commande_produit_chk_1` CHECK ((`quantite` > 0))
);

CREATE TABLE fiche_technique (
    specID INT PRIMARY KEY,
    produitID INT,
    specKey VARCHAR(255),
    specValue TEXT,
    FOREIGN KEY (produitID) REFERENCES produit(produitID) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);


INSERT INTO `categorie` VALUES (22,'Smartphone','Téléphones intelligents avec fonctionnalités avancées.'),(23,'Composants','Composants pour le rendu graphique dans les ordinateurs.'),(24,'Ordinateur Portable','Ordinateurs personnels portables.'),(25,'Ordinateur Gaming','Ordinateurs personnels portables.'),(26,'Écran PC','Périphérique d\'affichage pour ordinateurs.'),(27,'Clavier PC','Périphérique d\'entrée textuel pour ordinateurs.'),(28,'Souris PC','Périphérique de pointage pour ordinateurs.'),(29,'Casque PC','Casque audio conçu pour une utilisation avec un ordinateur.'),(30,'Tablette','Ordinateurs portables à écran tactile.'),(31,'Montres','Montres avec fonctionnalités informatiques avancées.'),(32,'Speakers','Écouteurs fonctionnant sans fil.');
INSERT INTO `produit` VALUES (69,'iPhone 15 Pro Max','Le dernier smartphone haut de gamme d\'Apple avec puce A17 Bionic et triple caméra avancée.',1299.00,97,'/assets/images/iphone15PM produit 1.webp',22,0,1399.00),(70,'Samsung Galaxy S24 Ultra','Smartphone Android phare avec écran Dynamic AMOLED 2X, Snapdragon 8 Gen 3 et quadruple caméra 200MP.',1199.99,103,'/assets/images/promoooo1.png',22,0,1399.00),(71,'Carte Graphique NVIDIA GeForce RTX 4080','Carte graphique haute performance pour le gaming 4K et le ray tracing.',1100.00,201,'/assets/images/NVIDIA GeForce RTX 4080 produit 4.png',23,0,1199.00),(72,'Processeur Intel Core i9-14900K','Processeur de bureau haut de gamme avec 24 cœurs pour des performances extrêmes.',600.00,202,'/assets/images/Processeur Intel Core i9-14900K produit 5.webp',23,0,700.00),(73,'Mémoire Vive Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz','Kit de mémoire RAM haute vitesse pour les systèmes de jeu et les stations de travail.',150.00,203,'/assets/images/Mémoire Vive.jpeg',23,0,75.00),(74,'SSD Samsung 990 Pro 2TB NVMe','Disque SSD ultra-rapide pour des temps de chargement réduits et des transferts de fichiers rapides.',180.00,204,'/assets/images/SSD Samsung 990 Pro 2TB NVMe produit 7.avif',23,0,55.00),(75,'Carte Mère ASUS ROG Strix Z790-E Gaming WiFi','Carte mère haut de gamme pour processeurs Intel de 12ème, 13ème et 14ème génération.',400.00,205,'/assets/images/Carte Mère ASUS ROG Strix Z790-E produit 8.png',23,0,490.00),(76,'Ordinateur Portable Dell XPS 15','Ordinateur portable haut de gamme avec écran OLED, processeur Intel Core i7 et carte graphique NVIDIA GeForce RTX.',1999.00,301,'/assets/images/Ordinateur Portable Dell XPS 15 produit 9.avif',24,0,2099.00),(77,'Ordinateur Portable Apple MacBook Air M3','Ordinateur portable ultra-léger et puissant avec la puce Apple M3.',1199.00,302,'/assets/images/Ordinateur Portable Apple MacBook Air M3 produit 10.jpeg',24,0,1249.00),(78,'Écran PC Gaming ASUS ROG Swift PG27AQDM OLED','Écran gaming 27 pouces OLED avec résolution QHD et taux de rafraîchissement de 240Hz.',900.00,205,'/assets/images/Écran PC Gaming ASUS ROG Swift PG27AQDM OLED produit 11.webp',26,0,900.00),(79,'Clavier Mécanique Corsair K70 RGB PRO','Clavier mécanique gaming avec rétroéclairage RGB personnalisable et commutateurs Cherry MX.',160.00,203,'/assets/images/Clavier Mécanique Corsair K70 RGB PRO produit 12.webp',27,0,160.00),(80,'Souris Gaming Logitech G Pro X SUPERLIGHT 2','Souris gaming sans fil ultra-légère pour les joueurs professionnels.',150.00,206,'/assets/images/Souris Gaming Logitech G Pro X SUPERLIGHT 2 produit 13.png',28,0,150.00),(81,'Casque Gaming HyperX Cloud III Wireless','Casque gaming sans fil confortable avec un son de haute qualité.',120.00,207,'/assets/images/Casque Gaming HyperX Cloud III Wireless produit 14.png',32,0,120.00),(82,'Tablette Apple iPad Pro 12.9 pouces (M2)','Tablette haut de gamme avec écran Liquid Retina XDR et puce Apple M2.',1099.00,302,'/assets/images/Tablette Apple iPad Pro 12.9 pouces (M2) produit 15.png',30,0,1099.00),(83,'Tablette Samsung Galaxy Tab S9 Ultra','Tablette Android haut de gamme avec grand écran Dynamic AMOLED 2X et S Pen inclus.',1199.00,102,'/assets/images/Tablette Samsung Galaxy Tab S9 Ultra produit 16.avif',30,0,1299.00),(84,'Montre Connectée Apple Watch Series 9','Montre connectée avec fonctionnalités avancées de santé et de fitness.',399.00,302,'/assets/images/Montre Connectée Apple Watch Series 9 produit 17.webp',31,0,550.00),(85,'Montre Connectée Samsung Galaxy Watch 6 Classic','Montre connectée élégante avec suivi de la santé et du fitness.',349.00,102,'/assets/images/watches.png',31,0,400.00),(86,'Enceinte Bluetooth Bose SoundLink Revolve+ II','Enceinte Bluetooth portable avec un son à 360 degrés et une longue autonomie.',299.00,401,'/assets/images/Écouteurs sans fil Sony WF-1000XM5 produit 19.png',32,0,400.00),(87,'Écouteurs sans fil Sony WF-1000XM5','Écouteurs sans fil à réduction de bruit de haute qualité.',279.00,402,'/assets/images/Écouteurs sans fil Sony WF-1000XM5 produit 19.png',32,0,60.00);

INSERT INTO specifications (specID, produitID, specKey, specValue) VALUES
(1, 69, 'Processeur', 'Apple A17 Bionic'),
(2, 69, 'Écran', '6.7 pouces Super Retina XDR'),
(3, 69, 'Résolution', '2796 x 1290 pixels'),
(4, 69, 'RAM', '8 Go'),
(5, 69, 'Stockage', '128 Go / 256 Go / 512 Go / 1 To'),
(6, 69, 'Appareil Photo Principal', '48 MP + 12 MP + 12 MP'),
(7, 69, 'Batterie', '4352 mAh'),
(8, 69, 'Système d\'exploitation', 'iOS 17'),
(9, 69, 'Connectivité', '5G, WiFi 6E, Bluetooth 5.3, NFC'),
(10, 69, 'Poids', '221 g'),
(11, 70, 'Processeur', 'Snapdragon 8 Gen 3'),
(12, 70, 'Écran', '6.8 pouces Dynamic AMOLED 2X'),
(13, 70, 'Résolution', '3088 x 1440 pixels'),
(14, 70, 'RAM', '12 Go / 16 Go'),
(15, 70, 'Stockage', '256 Go / 512 Go / 1 To'),
(16, 70, 'Appareil Photo Principal', '200 MP + 10 MP + 10 MP + 12 MP'),
(17, 70, 'Batterie', '5000 mAh'),
(18, 70, 'Système d\'exploitation', 'Android 14 One UI'),
(19, 70, 'Connectivité', '5G, WiFi 7, Bluetooth 5.3, NFC'),
(20, 70, 'Poids', '233 g'),
(21, 71, 'Architecture', 'Ada Lovelace'),
(22, 71, 'Mémoire Vidéo', '16 Go GDDR6X'),
(23, 71, 'Fréquence Boost', '2505 MHz'),
(24, 71, 'Cœurs CUDA', '9728'),
(25, 71, 'Interface Mémoire', '256-bit'),
(26, 71, 'TDP', '320 W'),
(27, 71, 'Connecteurs', '3x DisplayPort 1.4a, 1x HDMI 2.1'),
(28, 71, 'Refroidissement', 'Triple ventilateur'),
(29, 71, 'Technologies', 'DLSS 3, Ray Tracing, Reflex'),
(30, 72, 'Architecture', 'Raptor Lake'),
(31, 72, 'Cœurs', '24 (8 P-Cores + 16 E-Cores)'),
(32, 72, 'Threads', '32'),
(33, 72, 'Fréquence de Base', '3.2 GHz'),
(34, 72, 'Fréquence Max Turbo', '6.0 GHz'),
(35, 72, 'Cache', '36 Mo L3'),
(36, 72, 'TDP', '125 W'),
(37, 72, 'Socket', 'LGA 1700'),
(38, 72, 'Compatibilité', 'Carte mère Z690 / Z790'),
(39, 73, 'Capacité', '32 Go (2 x 16 Go)'),
(40, 73, 'Type', 'DDR5'),
(41, 73, 'Fréquence', '6000 MHz'),
(42, 73, 'Latence', 'CL36'),
(43, 73, 'Voltage', '1.35V'),
(44, 73, 'Compatibilité', 'Intel XMP 3.0, AMD EXPO'),
(45, 73, 'Dissipateur Thermique', 'Aluminium'),
(46, 74, 'Capacité', '2 To'),
(47, 74, 'Type', 'NVMe M.2 2280'),
(48, 74, 'Interface', 'PCIe 4.0 x4'),
(49, 74, 'Vitesse Lecture', '7450 Mo/s'),
(50, 74, 'Vitesse Écriture', '6900 Mo/s'),
(51, 74, 'Durabilité', '1200 TBW'),
(52, 74, 'Technologie', 'Samsung V-NAND 3-bit MLC'),
(53, 75, 'Chipset', 'Intel Z790'),
(54, 75, 'Socket', 'LGA 1700'),
(55, 75, 'Mémoire', 'DDR5 jusqu\'à 192 Go'),
(56, 75, 'Stockage', '4x M.2, 6x SATA 6Gb/s'),
(57, 75, 'Connectique', 'USB 3.2, USB-C, Ethernet 2.5G'),
(58, 75, 'WiFi', 'WiFi 6E'),
(59, 76, 'Processeur', 'Intel Core i7-13700H'),
(60, 76, 'Écran', '15.6 pouces OLED 3.5K'),
(61, 76, 'RAM', '16 Go LPDDR5'),
(62, 76, 'Stockage', '1 To SSD NVMe'),
(63, 76, 'Carte Graphique', 'NVIDIA GeForce RTX 4060'),
(64, 76, 'Batterie', '86 Wh'),
(65, 76, 'Poids', '1.8 kg'),
(66, 79, 'Type', 'Clavier Mécanique'),
(67, 79, 'Switches', 'Cherry MX Red'),
(68, 79, 'Rétroéclairage', 'RGB Personnalisable'),
(69, 79, 'Connectivité', 'USB-C'),
(70, 79, 'Format', 'Full-Size 104 touches'),
(71, 80, 'Capteur', 'HERO 25K'),
(72, 80, 'DPI', '100 - 25,600'),
(73, 80, 'Poids', '63 g'),
(74, 80, 'Boutons', '5'),
(75, 80, 'Autonomie', '70 heures'),
(76, 81, 'Type', 'Sans Fil'),
(77, 81, 'Autonomie', '120 heures'),
(78, 81, 'Surround', 'DTS Headphone:X 2.0'),
(79, 81, 'Microphone', 'Amovible avec suppression de bruit'),
(80, 82, 'Processeur', 'Apple M2'),
(81, 82, 'Écran', 'Liquid Retina XDR 12.9 pouces'),
(82, 82, 'Stockage', '128 Go / 256 Go / 512 Go / 1 To / 2 To'),
(83, 82, 'Batterie', '10 heures d\'autonomie'),
(84, 82, 'Système d\'exploitation', 'iPadOS'),
(85, 84, 'Écran', 'LTPO OLED 1.9 pouces'),
(86, 84, 'Processeur', 'Apple S9'),
(87, 84, 'Autonomie', '18 heures'),
(88, 84, 'Connectivité', 'Bluetooth 5.3, WiFi 6, NFC'),
(89, 86, 'Type', 'Enceinte Bluetooth'),
(90, 86, 'Autonomie', '17 heures'),
(91, 86, 'Connectivité', 'Bluetooth, Aux-in, Micro-USB'),
(92, 86, 'Étanchéité', 'IP55'),
(93, 87, 'Type', 'Écouteurs intra-auriculaires sans fil'),
(94, 87, 'Réduction de bruit', 'Oui, ANC adaptatif'),
(95, 87, 'Autonomie', '8 heures + 24 heures avec boîtier'),
(96, 87, 'Connectivité', 'Bluetooth 5.3, Multipoint');