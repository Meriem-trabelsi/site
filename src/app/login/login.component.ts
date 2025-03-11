import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;
    const form = document.querySelector('form') as HTMLFormElement;

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }

    // Add form submission handler
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleRegistration();
      });
    }
  }

  handleRegistration(): void {
    // Get all form elements by their IDs
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const telInput = document.getElementById('tel') as HTMLInputElement;
    const addressInput = document.getElementById('adresse') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const termsCheckbox = document.getElementById('termes') as HTMLInputElement;

    // Perform basic validation
    if (!nameInput.value || !emailInput.value || !passwordInput.value || 
        !confirmPasswordInput.value || !telInput.value || !addressInput.value || 
        !regionSelect.value || !termsCheckbox.checked) {
      alert('Veuillez remplir tous les champs et accepter les termes et conditions.');
      return;
    }

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Create data object to match your backend route's expected format
    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      address: addressInput.value,
      tel: telInput.value,
      region: regionSelect.value
    };

    // Send the data to your backend route
    this.http.post('http://localhost:5000/Client/registerClient', formData).subscribe({
      next: (response: any) => {
        alert('Inscription réussie! Votre compte a été créé.');
        // Reset the form
        (document.querySelector('form') as HTMLFormElement).reset();
      },
      error: (error) => {
        alert('Erreur lors de l\'inscription: ' + (error.error?.error || 'Une erreur est survenue.'));
      }
    });
  }
}