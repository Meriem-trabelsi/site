CREATE Schema techshop;
use  techshop;

-- Table Client (relation 1:1 avec Utilisateur)
CREATE TABLE Client (
    clientID INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    motdepasse VARCHAR(100) NOT NULL,
    adresse VARCHAR(255),
    tel INT,
    region VARCHAR(30)
);

-- Table Categorie
CREATE TABLE Categorie (
    categorieID INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table Produit
CREATE TABLE Produit (
    produitID INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix FLOAT NOT NULL CHECK (prix >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    imageURL VARCHAR(255),
    categorieID INT,
    fournisseurID INT, -- Note: Fournisseur n’est pas défini dans le diagramme, mais laissé pour cohérence
    FOREIGN KEY (categorieID) REFERENCES Categorie(categorieID) ON DELETE SET NULL
);

-- Table Panier
CREATE TABLE Panier (
    panierID INT PRIMARY KEY AUTO_INCREMENT,
    clientID INT NOT NULL,
    FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE
);

-- Table d’association Panier_Produit (pour gérer les quantités)
CREATE TABLE Panier_Produit (
    panierID INT,
    produitID INT,
    quantite INT NOT NULL CHECK (quantite > 0),
    PRIMARY KEY (panierID, produitID),
    FOREIGN KEY (panierID) REFERENCES Panier(panierID) ON DELETE CASCADE,
    FOREIGN KEY (produitID) REFERENCES Produit(produitID) ON DELETE CASCADE
);

-- Table Commande
CREATE TABLE Commande (
    commandeID INT PRIMARY KEY AUTO_INCREMENT,
    clientID INT NOT NULL,
    dateCommande DATE NOT NULL,
    statut VARCHAR(50) NOT NULL,
    total FLOAT NOT NULL CHECK (total >= 0),
    FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE
);

-- Table d’association Commande_Produit (pour gérer les quantités)
CREATE TABLE Commande_Produit (
    commandeID INT,
    produitID INT,
    quantite INT NOT NULL CHECK (quantite > 0),
    PRIMARY KEY (commandeID, produitID),
    FOREIGN KEY (commandeID) REFERENCES Commande(commandeID) ON DELETE CASCADE,
    FOREIGN KEY (produitID) REFERENCES Produit(produitID) ON DELETE CASCADE
);