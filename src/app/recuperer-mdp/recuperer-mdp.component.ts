import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-recuperer-mdp', 
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './recuperer-mdp.component.html', 
  styleUrls: ['./recuperer-mdp.component.css'] 
})
export class RecupererMdpComponent {
  // Variable pour suivre l'étape actuelle de la récupération de mot de passe 
  currentStage: 'request' | 'reset' = 'request';
  
  // Données du formulaire
  email: string = ''; 
  verificationCode: string = ''; 
  newPassword: string = ''; 
  confirmPassword: string = ''; 
  
  serverCode: string = ''; 
  
  constructor(private http: HttpClient, private router: Router) {} // Injection des services HttpClient et Router dans le constructeur
  
  // Méthode pour envoyer le code de vérification
  sendCode(): void {    
    // Validation de l'adresse e-mail
    if (!this.email || !this.validateEmail(this.email)) {
      alert('Veuillez saisir une adresse e-mail valide.');
      return; // Retourner si l'adresse e-mail est invalide
    }

    // Appel à l'API pour envoyer le code de vérification
    this.http.post<any>('http://localhost:5000/Client/forgotpassword', { email: this.email }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Response received:', response); // Affichage de la réponse du serveur dans la console
          this.serverCode = response.code; // Stockage du code de vérification du serveur
          this.currentStage = 'reset'; // Passage à l'étape de réinitialisation
        },
        error: (error) => {
          console.error('Error sending verification code:', error); // Affichage de l'erreur dans la console
          if (error.status === 404) {
            alert('Adresse e-mail non trouvée.'); // Message d'erreur si l'e-mail n'est pas trouvé
          } else {
            alert('Une erreur s\'est produite. Veuillez réessayer.'); // Message d'erreur générique
          }
        }
      });
  }
  
  // Méthode pour réinitialiser le mot de passe
  resetPassword(): void {
    console.log('resetPassword called'); // Affichage du message dans la console pour vérifier l'appel de la méthode
    
    // Validation du code de vérification
    if (!this.verificationCode) {
      alert('Veuillez saisir le code de vérification.');
      return; // Retourner si le code de vérification est vide
    }
    
    // Vérification si le code correspond à celui reçu du serveur
    if (this.serverCode && String(this.verificationCode) !== String(this.serverCode)) {
      alert('Code de vérification incorrect.'+ this.serverCode + ' ' + this.verificationCode);
      return; // Retourner si les codes ne correspondent pas
    }
    
    // Validation du nouveau mot de passe
    if (!this.newPassword) {
      alert('Veuillez saisir un nouveau mot de passe.');
      return; // Retourner si le mot de passe est vide
    }
    
    // Vérification si le mot de passe et sa confirmation correspondent
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return; // Retourner si les mots de passe ne correspondent pas
    }
    
    // Appel à l'API pour changer le mot de passe
    this.http.post<any>('http://localhost:5000/Client/changepass', { 
      email: this.email, // L'adresse e-mail de l'utilisateur
      newPassword: this.newPassword // Le nouveau mot de passe
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Password changed successfully:', response); // Affichage du message de succès dans la console
        alert('Votre mot de passe a été modifié avec succès!'); // Affichage du message de succès
        this.router.navigate(['/login']); // Redirection vers la page de connexion
      },
      error: (error) => {
        console.error('Error changing password:', error); // Affichage de l'erreur dans la console
        alert('Une erreur s\'est produite lors de la modification du mot de passe.'); // Message d'erreur si la modification échoue
      }
    });
  }
  
  // Méthode pour valider le format de l'adresse e-mail
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour valider le format de l'e-mail
    return emailRegex.test(email); // Retourne vrai si l'e-mail est valide, sinon faux
  }
}
