// Importation des modules nécessaires
import { Component, OnInit } from '@angular/core'; // Pour définir le composant Angular
import { CommonModule } from '@angular/common'; // Fournit les directives Angular communes comme ngIf, ngFor
import { HttpClient } from '@angular/common/http'; // Permet de faire des requêtes HTTP
import { FormsModule } from '@angular/forms'; // Permet de gérer les formulaires
import { Router } from '@angular/router'; // Permet de naviguer entre les pages
import { HeaderComponent } from '../components/header/header.component'; // Importation du composant d'en-tête
import { FooterComponent } from '../components/footer/footer.component'; // Importation du composant de pied de page

// Définition de l'interface représentant un article du panier
interface CartItem {
  produitID: number; // Identifiant du produit
  nom: string;       // Nom du produit
  quantite: number;  // Quantité de ce produit dans le panier
  prix: number;      // Prix unitaire du produit
}

// Interface pour le type de réponse lors de la récupération du panier
interface CommandeResponse {
  produits: CartItem[]; // Liste des produits dans le panier
  total: number;        // Prix total du panier
}

// Déclaration du composant Commander
@Component({
  selector: 'app-commander', // Sélecteur utilisé dans le HTML
  standalone: true, // Composant autonome
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent], // Modules et composants importés
  templateUrl: './commander.component.html', // Fichier HTML associé
  styleUrls: ['./commander.component.css'] // Fichier CSS associé
})
export class CommanderComponent implements OnInit {

  // Liste des articles dans le panier
  cartItems: CartItem[] = [];

  // Prix total du panier
  totalPrice: number = 0;

  // Indicateur de chargement pour afficher un spinner ou autre
  isLoading: boolean = false;

  // Objet représentant les données du formulaire de commande
  form = {
    lname: '',    // Nom du client
    region: '',   // Région du client
    houseadd: '', // Adresse de la maison
    phone: '',    // Numéro de téléphone
    payment: ''   // Méthode de paiement (non utilisée ici)
  };

  // Injection de HttpClient pour les requêtes HTTP et Router pour la navigation
  constructor(private http: HttpClient, private router: Router) {}

  // Méthode appelée automatiquement au chargement du composant
  ngOnInit(): void {
    this.fetchClient(); // Appel à la méthode pour récupérer les infos client et panier
  }

  // Méthode pour récupérer les informations du client et les articles du panier
  fetchClient(): void {
    this.isLoading = true; // Activation du chargement

    // Récupération des informations du client via une requête GET
    this.http.get<any>('http://localhost:5000/Client/getClientInfo', { withCredentials: true }).subscribe(
      (response) => {
        // Remplissage des champs du formulaire avec les données récupérées
        this.form.lname = response.nom;
        this.form.region = response.region;
        this.form.houseadd = response.adresse;
        this.form.phone = response.tel;
      },
      (error) => {
        // Affichage d'une erreur si la requête échoue
        console.error('Error fetching client info:', error);
        this.isLoading = false;
      }
    );

    // Récupération du contenu du panier
    this.http.get<CommandeResponse>('http://localhost:5000/Cart/fetch', { withCredentials: true }).subscribe(
      (response) => {
        // Mise à jour des articles du panier et du prix total
        this.cartItems = response.produits;
        this.totalPrice = response.total;
        this.isLoading = false;
      },
      (error) => {
        // Affichage d'une erreur en cas d'échec
        console.error('Erreur lors de la récupération du panier:', error);
        this.isLoading = false;
      }
    );
  }

  // Méthode pour calculer le prix total du panier à partir des articles
  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.prix * item.quantite), 0
    );
  }

  // Méthode appelée lorsqu'on passe la commande
  passerComm() {
    // Extraction des données du formulaire
    const nom = this.form.lname;
    const region = this.form.region;
    const adresse = this.form.houseadd; // Correction : on utilise houseadd, pas region
    const tel = this.form.phone;

    // Création de l'objet à envoyer pour mettre à jour les infos client
    var form2 = { nom, region, adresse, tel };

    // Requête PUT pour mettre à jour les infos du client
    this.http.put('http://localhost:5000/Client/updateClientInfo', form2, { withCredentials: true }).subscribe({
      next: () => {
        // Si la mise à jour réussit, on passe la commande
        this.http.post('http://localhost:5000/Cart/commander', {}, { withCredentials: true }).subscribe({
          next: () => {
            // Affichage d'une alerte si la commande a été passée avec succès
            alert('Commande passée avec succès');
          },
          error: (error) => {
            // Affichage d'une erreur en cas d'échec de la commande
            alert('Erreur lors du passage de la commande: ' + error.error?.error || error.message);
          }
        });
      },
      error: (error) => {
        // Affichage d'une erreur en cas d'échec de mise à jour des infos client
        alert('Erreur lors de la mise à jour des informations du client: ' + error.error?.error || error.message);
      }
    });

    // Redirection vers la page d'accueil
    this.router.navigate(['/home']);
  }

}
