UPDATE produit
SET imageURL = CASE
    WHEN produitID = 73 THEN '/assets/images/Mémoire Vive.jpeg'
END
WHERE imageURL IS NULL;