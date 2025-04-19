import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopTitleComponent } from "../../components/shop-title/shop-title.component";
import { FilterComponent } from "../../components/filter/filter.component";
import { ShopGridComponent } from "../../components/shop-grid/shop-grid.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Router } from '@angular/router'; 
import { CategoryService } from '../../services/categorie.service'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ShopTitleComponent, ShopGridComponent, HeaderComponent, FooterComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent { 
  // Déclaration d'un tableau pour stocker les catégories
  categories: any[] = [];

  // Variable pour suivre l'état de connexion de l'utilisateur
  isLoggedIn = false;

  // Injection des services nécessaires via le constructeur
  constructor(
    private categoryService: CategoryService, 
    private router: Router,                   
    private http: HttpClient                  
  ) {}

  ngOnInit(): void {
    // Appel au service pour récupérer les catégories depuis l'API
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data.slice(0, 7);
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    );

    // Vérifie si l'utilisateur est connecté
    this.checkAuthStatus();
  }

  // Fonction pour naviguer vers une catégorie spécifique
  goToCategory(categoryId: number): void {
    // Redirige vers la page 'shop' avec un paramètre de requête (categoryID)
    this.router.navigate(['/shop'], {
      queryParams: { categoryID: categoryId }
    });
  }

  // Vérifie si le client est connecté en appelant l'API côté backend
  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', {
      withCredentials: true // Inclut les cookies dans la requête (pour les sessions)
    }).subscribe(
      (response) => {
        // Si le client est connecté, on affiche une confirmation et on met à jour isLoggedIn
        console.log('Déjà connecté :', response);
        this.isLoggedIn = true;
      },
      (error) => {
        // Sinon, on indique que l'utilisateur n'est pas connecté
        console.log('Non connecté :', error);
        this.isLoggedIn = false;
      }
    );
  }

  // Redirige l'utilisateur selon son état de connexion
  goToPage(): void {
    if (this.isLoggedIn) {
      // Si connecté, déconnecte l'utilisateur
      this.logout();
    } else {
      // Sinon, redirige vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

  // Fonction pour déconnecter l'utilisateur
  logout(): void {
    this.http.post('http://localhost:5000/Client/logout', {}, {
      withCredentials: true // Envoie aussi les cookies de session
    }).subscribe(
      () => {
        // Si la déconnexion réussit, on affiche un message, on met à jour l'état et on redirige vers l'accueil
        alert('Déconnexion réussie');
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      (error) => {
        // En cas d'échec de la déconnexion, on affiche l'erreur
        console.log('Échec de la déconnexion :', error);
      }
    );
  }
}
