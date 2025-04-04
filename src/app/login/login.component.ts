import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login', // Defines the component selector
  imports: [], // No additional module imports
  templateUrl: './login.component.html', // Template file for the component
  styleUrl: './login.component.css' // Styles for the component
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {} // Injects HttpClient and Router for API calls and navigation
  
  ngOnInit(): void {
    // Get references to the sign-up and sign-in buttons
    this.checkAuthStatus();
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;
    const registerForm = document.querySelector('.sign-up-container form') as HTMLFormElement;
    const loginForm = document.querySelector('.sign-in-container form') as HTMLFormElement;
    const loginButton = document.getElementById('loginBtn') as HTMLButtonElement; // ✅ Target login button directly

    // Add event listener for "Sign Up" button click - activates right panel
    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      // Add event listener for "Sign In" button click - deactivates right panel
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }
    // Attach event listener for form submission
    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        this.handleRegistration(); // Call registration function
      });
    }

    if (loginButton) {
      loginButton.addEventListener('click', (event) => {
          event.preventDefault(); // Prevents form from submitting normally
          this.handleLogin();
      });
  }
  }

  /* Handles the registration process by collecting form data and sending it to the backend.*/
  handleRegistration(): void {
    // Retrieve form input fields by their IDs
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('r-email') as HTMLInputElement;
    const passwordInput = document.getElementById('r-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const telInput = document.getElementById('tel') as HTMLInputElement;
    const addressInput = document.getElementById('adresse') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const termsCheckbox = document.getElementById('termes') as HTMLInputElement;
    // Perform basic validation to ensure all fields are filled
    if (!nameInput.value || !emailInput.value || !passwordInput.value || 
        !confirmPasswordInput.value || !telInput.value || !addressInput.value || 
        !regionSelect.value || !termsCheckbox.checked) {
      alert('Veuillez remplir tous les champs et accepter les termes et conditions.');
      return;
    }
    // Validate that password and confirm password match
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    // Prepare form data object for backend submission
    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      address: addressInput.value,
      tel: telInput.value,
      region: regionSelect.value
    };
    // Send the form data to the backend API
    this.http.post('http://localhost:5000/Client/registerClient', formData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Inscription réussie! Votre compte a été créé.');
        this.http.post('http://localhost:5000/Client/loginClient', formData, { withCredentials: true }).subscribe({
          next: (response: any) => {
            alert('Connexion réussie!');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
          }
        });
        // Reset the form after successful registration
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

    this.http.post('http://localhost:5000/Client/loginClient', loginData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Connexion réussie!');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        alert('Erreur de connexion: ' + (error.error?.error || 'Identifiants invalides.'));
      }
    });
}

checkAuthStatus(): void {
  this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).subscribe(
    (response) => {
      console.log('Already logged in:', response);
      this.router.navigate(['/home']);  // Redirect to home if authenticated
    },
    (error) => {
      console.log('Not logged in:', error);
    }
  );
}
}