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
    const registerForm = document.querySelector('.sign-up-container form') as HTMLFormElement;
    const loginForm = document.querySelector('.sign-in-container form') as HTMLFormElement;
    const loginButton = document.getElementById('loginBtn') as HTMLButtonElement; // ✅ Target login button directly

    
    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleRegistration();
      });
    }

    if (loginButton) {
      loginButton.addEventListener('click', (event) => {
          event.preventDefault(); // Prevents form from submitting normally
          this.handleLogin();
      });
  }
  }

  handleRegistration(): void {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('r-email') as HTMLInputElement;
    const passwordInput = document.getElementById('r-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const telInput = document.getElementById('tel') as HTMLInputElement;
    const addressInput = document.getElementById('adresse') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const termsCheckbox = document.getElementById('termes') as HTMLInputElement;

    if (!nameInput.value || !emailInput.value || !passwordInput.value || 
        !confirmPasswordInput.value || !telInput.value || !addressInput.value || 
        !regionSelect.value || !termsCheckbox.checked) {
      alert('Veuillez remplir tous les champs et accepter les termes et conditions.');
      return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      address: addressInput.value,
      tel: telInput.value,
      region: regionSelect.value
    };

    this.http.post('http://localhost:5000/Client/registerClient', formData).subscribe({
      next: (response: any) => {
        alert('Inscription réussie! Votre compte a été créé.');
        this.http.post('http://localhost:5000/Client/loginClient', formData).subscribe({
          next: (response: any) => {
            alert('Connexion réussie!');
            localStorage.setItem('token', response.token);
          },
          error: (error) => {
            alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
          }
        });
        (document.querySelector('form') as HTMLFormElement).reset();
      },
      error: (error) => {
        alert('Erreur lors de l\'inscription: ' + (error.error?.error || 'Une erreur est survenue.'));
      }
    });
  }

  handleLogin(): void {
    const emailInput = document.getElementById('l-email') as HTMLInputElement;
    const passwordInput = document.getElementById('l-password') as HTMLInputElement;
    const rememberMeCheckbox = document.getElementById('remember') as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value) {
      alert('Veuillez saisir votre email et votre mot de passe.');
      return;
    }

    const loginData = {
      email: emailInput.value,
      password: passwordInput.value,
      rememberme: rememberMeCheckbox.checked
    };

    this.http.post('http://localhost:5000/Client/loginClient', loginData).subscribe({
      next: (response: any) => {
        alert('Connexion réussie!');
        localStorage.setItem('token', response.token);
      },
      error: (error) => {
        alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
      }
    });
}
}