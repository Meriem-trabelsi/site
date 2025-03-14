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
  // Track the current stage of password recovery
  currentStage: 'request' | 'reset' = 'request';
  
  // Form data
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  serverCode: string = '';
  
  constructor(private http: HttpClient, private router: Router) {}
  
  // Send verification code
  sendCode(): void {    
    // Validate email
    if (!this.email || !this.validateEmail(this.email)) {
      alert('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    // Call API to send verification code
    this.http.post<any>('http://localhost:5000/Client/forgotpassword', { email: this.email }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Response received:', response);
          // Store the verification code from the server
          this.serverCode = response.code;
          // Move to reset stage
          this.currentStage = 'reset';
        },
        error: (error) => {
          console.error('Error sending verification code:', error);
          if (error.status === 404) {
            alert('Adresse e-mail non trouvée.');
          } else {
            alert('Une erreur s\'est produite. Veuillez réessayer.');
          }
        }
      });
  }
  
  // Reset password
  resetPassword(): void {
    console.log('resetPassword called');
    
    // Validate verification code
    if (!this.verificationCode) {
      alert('Veuillez saisir le code de vérification.');
      return;
    }
    
    // Verify the code matches
    if (this.serverCode && String(this.verificationCode) !== String(this.serverCode)) {
      alert('Code de vérification incorrect.'+ this.serverCode + ' ' + this.verificationCode);
      return;
    }
    
    // Validate password
    if (!this.newPassword) {
      alert('Veuillez saisir un nouveau mot de passe.');
      return;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    
    // Call API to change password
    this.http.post<any>('http://localhost:5000/Client/changepass', { 
      email: this.email,
      newPassword: this.newPassword
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Password changed successfully:', response);
        alert('Votre mot de passe a été modifié avec succès!');
        this.router.navigate(['/']);

      },
      error: (error) => {
        console.error('Error changing password:', error);
        alert('Une erreur s\'est produite lors de la modification du mot de passe.');
      }
    });
  }
  
  // Helper method to validate email format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}