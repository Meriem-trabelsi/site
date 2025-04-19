
import { Component } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 


@Component({
  selector: 'app-login', 
  imports: [], 
  templateUrl: './login.component.html', 
  styleUrl: './login.component.css' 
})
export class LoginComponent {
  // Constructeur du composant : injection des services HttpClient et Router
  constructor(private http: HttpClient, private router: Router) {}

  // Méthode appelée au chargement du composant
  ngOnInit(): void {
    this.checkAuthStatus(); // Vérifie si l'utilisateur est déjà connecté

    // Récupération des éléments HTML 
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;
    const registerForm = document.querySelector('.sign-up-container form') as HTMLFormElement;
    const loginForm = document.querySelector('.sign-in-container form') as HTMLFormElement;
    const loginButton = document.getElementById('loginBtn') as HTMLButtonElement;

    // Gestion des clics sur les boutons "Sign Up" et "Sign In"
    if (signUpButton && signInButton && container) {
      // Ajoute une classe pour animer vers le panneau d'inscription
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      // Retire la classe pour revenir au panneau de connexion
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }

    // ecoute l'événement de soumission du formulaire d'inscription
    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        this.handleRegistration(); // Lance la méthode d'inscription
      });
    }

    // Écoute du clic sur le bouton de connexion
    if (loginButton) {
      loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du bouton
        this.handleLogin(); // Lance la méthode de connexion
      });
    }
  }

  // Méthode pour gérer l'inscription d'un utilisateur
  handleRegistration(): void {
    // Récupération des champs du formulaire d'inscription
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('r-email') as HTMLInputElement;
    const passwordInput = document.getElementById('r-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const telInput = document.getElementById('tel') as HTMLInputElement;
    const addressInput = document.getElementById('adresse') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const termsCheckbox = document.getElementById('termes') as HTMLInputElement;

    // Vérifie que tous les champs sont remplis et que les conditions sont acceptées
    if (!nameInput.value || !emailInput.value || !passwordInput.value || 
        !confirmPasswordInput.value || !telInput.value || !addressInput.value || 
        !regionSelect.value || !termsCheckbox.checked) {
      alert('Veuillez remplir tous les champs et accepter les termes et conditions.');
      return;
    }

    // Vérifie que le numéro de téléphone est bien composé de 8 chiffres
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(telInput.value)) {
      alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      return;
    }

    // Vérifie que le mot de passe et sa confirmation sont identiques
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Création d'un objet contenant les données du formulaire
    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      address: addressInput.value,
      tel: telInput.value,
      region: regionSelect.value
    };

    // Envoi des données au backend pour l'enregistrement du client
    this.http.post('http://localhost:5000/Client/registerClient', formData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Inscription réussie! Votre compte a été créé.');

        // Connexion automatique après inscription
        this.http.post('http://localhost:5000/Client/loginClient', formData, { withCredentials: true }).subscribe({
          next: (response: any) => {
            alert('Connexion réussie!');
            this.router.navigate(['/']); // Redirige vers la page d'accueil
          },
          error: (error) => {
            alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
          }
        });

        // Réinitialise le formulaire après l'inscription
        (document.querySelector('form') as HTMLFormElement).reset();
      },
      error: (error) => {
        alert('Erreur lors de l\'inscription: ' + (error.error?.error || 'Une erreur est survenue.'));
      }
    });
  }

  // Méthode pour gérer la connexion d'un utilisateur
  handleLogin(): void {
    // Récupération des champs email et mot de passe
    const emailInput = document.getElementById('l-email') as HTMLInputElement;
    const passwordInput = document.getElementById('l-password') as HTMLInputElement;
    const rememberMeCheckbox = document.getElementById('remember') as HTMLInputElement;

    // Vérifie que les champs ne sont pas vides
    if (!emailInput.value || !passwordInput.value) {
      alert('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    // Création d'un objet contenant les données de connexion
    const loginData = {
      email: emailInput.value,
      password: passwordInput.value,
      rememberme: rememberMeCheckbox.checked
    };

    // Envoi de la requête de connexion au backend
    this.http.post('http://localhost:5000/Client/loginClient', loginData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Connexion réussie!');
        this.router.navigate(['/']); // Redirige vers la page d'accueil
      },
      error: (error) => {
        alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
      }
    });
  }

  // Vérifie si un utilisateur est déjà connecté (session active côté serveur)
  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).subscribe(
      (response) => {
        console.log('Déjà connecté:', response); // Affiche les infos si l'utilisateur est authentifié
        this.router.navigate(['/']); // Redirige vers la page d'accueil si authentifié
      },
      (error) => {
        console.log('Non connecté:', error); // Affiche une erreur si l'utilisateur n'est pas connecté
      }
    );
  }
}
