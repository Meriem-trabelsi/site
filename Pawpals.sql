CREATE Schema pawpals;
use  pawpals;

CREATE TABLE `adoptionpet` (
  `adoptionPetID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  `petName` varchar(100) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `shelter` varchar(100) DEFAULT NULL,
  `description` text,
  `goodWithKids` tinyint(1) DEFAULT '0',
  `goodWithOtherPets` tinyint(1) DEFAULT '0',
  `houseTrained` tinyint(1) DEFAULT '0',
  `specialNeeds` tinyint(1) DEFAULT '0',
  `datePosted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`adoptionPetID`),
  KEY `clientID` (`clientID`),
  CONSTRAINT `adoptionpet_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE
) 

CREATE TABLE `categorie` (
  `categorieID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`categorieID`)
) 

CREATE TABLE `client` (
  `clientID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motdepasse` varchar(100) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `tel` int DEFAULT NULL,
  `region` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`clientID`),
  UNIQUE KEY `email` (`email`)
) 

CREATE TABLE `commande` (
  `commandeID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  `dateCommande` date NOT NULL,
  `statut` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`commandeID`),
  KEY `clientID` (`clientID`),
  CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE,
  CONSTRAINT `commande_chk_1` CHECK ((`total` >= 0))
) 

CREATE TABLE `commande_produit` (
  `commandeID` int NOT NULL,
  `produitID` int NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`commandeID`,`produitID`),
  KEY `produitID` (`produitID`),
  CONSTRAINT `commande_produit_ibfk_1` FOREIGN KEY (`commandeID`) REFERENCES `commande` (`commandeID`) ON DELETE CASCADE,
  CONSTRAINT `commande_produit_ibfk_2` FOREIGN KEY (`produitID`) REFERENCES `produit` (`produitID`) ON DELETE CASCADE,
  CONSTRAINT `commande_produit_chk_1` CHECK ((`quantite` > 0))
) 

CREATE TABLE `lostpet` (
  `lostPetID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  `petName` varchar(100) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `dateLost` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `datePosted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `categorieID` int DEFAULT NULL,
  PRIMARY KEY (`lostPetID`),
  KEY `clientID` (`clientID`),
  KEY `categorieID` (`categorieID`),
  CONSTRAINT `lostpet_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE,
  CONSTRAINT `lostpet_ibfk_2` FOREIGN KEY (`categorieID`) REFERENCES `categorie` (`categorieID`) ON DELETE SET NULL
) 

CREATE TABLE `panier` (
  `panierID` int NOT NULL AUTO_INCREMENT,
  `clientID` int NOT NULL,
  PRIMARY KEY (`panierID`),
  KEY `clientID` (`clientID`),
  CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`clientID`) REFERENCES `client` (`clientID`) ON DELETE CASCADE
)

CREATE TABLE `panier_produit` (
  `panierID` int NOT NULL,
  `produitID` int NOT NULL,
  `quantite` int NOT NULL,
  PRIMARY KEY (`panierID`,`produitID`),
  KEY `produitID` (`produitID`),
  CONSTRAINT `panier_produit_ibfk_1` FOREIGN KEY (`panierID`) REFERENCES `panier` (`panierID`) ON DELETE CASCADE,
  CONSTRAINT `panier_produit_ibfk_2` FOREIGN KEY (`produitID`) REFERENCES `produit` (`produitID`) ON DELETE CASCADE,
  CONSTRAINT `panier_produit_chk_1` CHECK ((`quantite` > 0))
)

CREATE TABLE `produit` (
  `produitID` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text,
  `prix` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `categorieID` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  PRIMARY KEY (`produitID`),
  KEY `categorieID` (`categorieID`),
  CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`categorieID`) REFERENCES `categorie` (`categorieID`) ON DELETE SET NULL,
  CONSTRAINT `produit_chk_1` CHECK ((`prix` >= 0)),
  CONSTRAINT `produit_chk_2` CHECK ((`stock` >= 0))
)

-- Insertion des catégories et des produits
INSERT INTO categorie (categorieID, nom, description) VALUES
(1, 'Chien', 'Tout pour l’alimentation, la santé et le bien-être de votre chien.'),
(2, 'Chat', 'Large choix de nourritures et accessoires pour chats heureux.'),
(3, 'Oiseau', 'Alimentation adaptée pour oiseaux domestiques et exotiques.');

INSERT INTO produit (produitID,categorieID, nom, description,prix, stock,imageURL,rating) VALUES
(1, 1, 'POULET, COURGE, MYRTILLE', 'Voilà la recette mono-protéine idéale pour les chiens stérilisés qui veulent retrouver la ligne ! Elle contient 70% de poulet, une viande maigre, peu calorique et riche en protéines pour avoir la pêche, des fruits et des légumes pour faire le plein de vitamines et de fibres, des minéraux et des prébiotiques pour renforcer la santé intestinale. Et roule ma poule !', 49.99, 11, 'chien1.webp',4),
(2, 1, 'Croquettes Sans Céréales Chien Digestion Sensible Toutes Tailles', 'Nos croquettes fabriquées sans céréales pour chien Digestion Sensible contiennent de l agneau qui est une excellente source de protéines. Elles sont adaptées à tous les chiens, notamment ceux présentant des sensibilités digestives.', 12.50, 150,'chien2.webp',3),
(3, 1, 'DINDE, CANARD, COURGE', 'Une délicieuse recette sans céréales avec 50% de canard et de dinde, accompagnée de super-aliments comme l’huile de saumon ou les graines de lin riches en nutriments : des antioxydants pour l’immunité, des prébiotiques pour la digestion et des oméga-3 pour la peau et le pelage. De quoi régaler votre chien et prendre soin de lui au quotidien !', 39.99, 80, 'chien3.webp',4),
(4, 1, 'POULET, FRAMBOISE, ORIGAN', 'Plutôt laile ou la cuisse ? Peu importe ! Notre pâtée mono-protéine contient 70% de poulet pour faire plaisir aux fans de volailles ! Formulée avec des prébiotiques et de l origan, une herbe aromatique qui facilite le transit et lutte contre la constipation, elle conviendra aussi aux estomacs sensibles. ', 9.99, 120, 'chien4.webp',3),
(5, 1, 'GUMMIES ARTICULATIONS', 'Soulagez les douleurs articulaires de votre chien et aidez le à retrouver sa mobilité avec nos gummies Articulations ! Formulés par des vétérinaires et experts en nutrition, ils contiennent 12 principes actifs comme la glucosamine, le MSM et le sulfate de chondroïtine pour combattre l inflammation et renforcer le cartilage. Idéal pour les chiens âgés ou souffrant d arthrose ! ', 31.50, 75, 'chien6.webp',3),
(6, 1, 'STICKS MENTHE, SAUGE', 'Marre des léchouilles puantes de votre chien ? Découvrez nos sticks dentaires pour laider à retrouver une haleine à bisous ! La menthe est une plante riche en vitamines qui favorisent une meilleure haleine, tandis que la sauge améliore le confort digestif et atténue les remontées malodorantes. À dévorer sans modération pour dire bye bye au tartre et à la plaque dentaire !', 34.50, 75, 'chien5.webp',3),
(7, 1, 'GUMMIES PROBIOTIQUES', 'Améliorez la digestion de votre chien avec nos gummies aux 6 principes actifs parfaitement équilibrés entre probiotiques et prébiotiques ! Des délicieuses bouchées pour soutenir la flore intestinale et aider à une meilleure absorption des nutriments. Formulés par des experts en nutrition animale, ces compléments sont la solution gourmande idéale et efficace sur le long terme pour un système digestif en pleine forme, réduisant les selles molles et les flatulences, pour un chien heureux et en bonne santé au quotidien !', 30.50, 75, 'chien7.webp',4),
(8, 2, 'POULET, THON, SAUMON', 'Avis aux minets stérilisés ! Voilà la recette idéale pour les chats en quête d’équilibre. Elle contient 70% poulet et de poisson, une parfaite combinaison entre une viande maigre et complète pour garder la ligne et du poisson pour faire le plein d oméga-3, des vitamines et des minéraux pour booster leur système immunitaire. Mama miaou !', 35.50, 75, 'chat1.webp',3),
(9, 2, 'CANARD, VALÉRIANE', 'Avis aux fins gourmets ! Cette délicieuse pâtée mono-protéine a été préparée avec 65% de canard, une viande peu allergène, savoureuse et riche en goût. De quoi combler le palais de votre chat stérilisé. En plus d être plus appétente, la pâtée est aussi plus hydratante que les croquettes, elle permet de réduire les risques de troubles urinaires et rénaux, fréquents chez nos petits compagnons. Alors pas de temps à perdre, c est le moment d envoyer la pâtée dans sa gamelle !', 20.50, 75, 'chat2.webp',3),
(10, 2, 'CANARD, POULET, POMME', 'Voilà la recette idéale pour les amateurs de volaille en sauce ultra savoureuse ! Elle contient 85% de filets de poulet et de canard, pour varier les apports en protéines. De la pomme pour faire le plein de fibres et faciliter la digestion. Et de l argousier pour un shot de vitamine C et renforcer leur immunité ! Elle est pas belle la vie ?', 20.50, 75, 'chat3.webp',4),
(11, 2, 'HUILE DE CHANVRE BIO', 'Grâce à ses nombreux bienfaits, l huile de chanvre est le meilleur allié pour préserver la santé de votre chat. Elle permet de renforcer l immunité, de réduire les inflammations et de calmer son stress. Elle contribue également à la bonne santé de la peau et des articulations. Fabriquée en France, notre huile de chanvre est bio et pressée à froid pour conserver son efficacité. Facile à utiliser, il suffit d en ajouter directement sur les croquettes ! ', 25.50, 75, 'chat4.webp',4),
(12, 3, 'Mélange Pigeon « Élevage Spécial 102 » 25kg', 'Mélange élevage pour pigeons.', 25.50, 75, 'chat4.webp',3);
