import { Component } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; 
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-login', 
  imports: [HeaderComponent], 
  templateUrl: './login.component.html', 
  styleUrl: './login.component.css' 
})
export class LoginComponent {
  // Component constructor: inject HttpClient and Router services
  constructor(private http: HttpClient, private router: Router) {}

  // Method called when the component loads
  ngOnInit(): void {
    this.checkAuthStatus(); // Check if the user is already logged in

    // Get HTML elements
    const signUpButton = document.getElementById('signUp') as HTMLButtonElement;
    const signInButton = document.getElementById('signIn') as HTMLButtonElement;
    const container = document.getElementById('container') as HTMLElement;
    const registerForm = document.querySelector('.sign-up-container form') as HTMLFormElement;
    const loginForm = document.querySelector('.sign-in-container form') as HTMLFormElement;
    const loginButton = document.getElementById('loginBtn') as HTMLButtonElement;

    // Handle clicks on "Sign Up" and "Sign In" buttons
    if (signUpButton && signInButton && container) {
      // Add class to animate to sign-up panel
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      // Remove class to return to login panel
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }

    // Listen for submit event on registration form
    if (registerForm) {
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload
        this.handleRegistration(); // Call registration method
      });
    }

    // Listen for click on login button
    if (loginButton) {
      loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default button behavior
        this.handleLogin(); // Call login method
      });
    }
  }

  // Method to handle user registration
  handleRegistration(): void {
    // Get form input fields
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('r-email') as HTMLInputElement;
    const passwordInput = document.getElementById('r-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const telInput = document.getElementById('tel') as HTMLInputElement;
    const addressInput = document.getElementById('adresse') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const termsCheckbox = document.getElementById('termes') as HTMLInputElement;

    // Check all fields are filled and terms accepted
    if (!nameInput.value || !emailInput.value || !passwordInput.value || 
        !confirmPasswordInput.value || !telInput.value || !addressInput.value || 
        !regionSelect.value || !termsCheckbox.checked) {
      alert('Please fill out all fields and accept the terms and conditions.');
      return;
    }

    // Check that phone number has exactly 8 digits
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(telInput.value)) {
      alert('Phone number must contain exactly 8 digits.');
      return;
    }

    // Check that passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      alert('Passwords do not match.');
      return;
    }

    // Create an object with form data
    const formData = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      address: addressInput.value,
      tel: telInput.value,
      region: regionSelect.value
    };

    // Send data to backend to register client
    this.http.post('http://localhost:5000/Client/registerClient', formData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Registration successful! Your account has been created.');

        // Automatically log in after registration
        this.http.post('http://localhost:5000/Client/loginClient', formData, { withCredentials: true }).subscribe({
          next: (response: any) => {
            alert('Login successful!');
            this.router.navigate(['/']); // Redirect to home page
          },
          error: (error) => {
            alert('Login error: ' + (error.error?.error || 'Invalid credentials.'));
          }
        });

        // Reset the form after registration
        (document.querySelector('form') as HTMLFormElement).reset();
      },
      error: (error) => {
        alert('Registration error: ' + (error.error?.error || 'An error occurred.'));
      }
    });
  }

  // Method to handle user login
  handleLogin(): void {
    // Get email and password fields
    const emailInput = document.getElementById('l-email') as HTMLInputElement;
    const passwordInput = document.getElementById('l-password') as HTMLInputElement;
    const rememberMeCheckbox = document.getElementById('remember') as HTMLInputElement;

    // Check fields are not empty
    if (!emailInput.value || !passwordInput.value) {
      alert('Please enter your email and password.');
      return;
    }

    // Create object with login data
    const loginData = {
      email: emailInput.value,
      password: passwordInput.value,
      rememberme: rememberMeCheckbox.checked
    };

    // Send login request to backend
    this.http.post('http://localhost:5000/Client/loginClient', loginData, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Login successful!');
        this.router.navigate(['/']); // Redirect to home page
      },
      error: (error) => {
        alert('Login error: ' + (error.error?.error || 'Invalid credentials.'));
      }
    });
  }

  // Check if user is already logged in (active session on server side)
  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).subscribe(
      (response) => {
        console.log('Already logged in:', response); // Show info if user is authenticated
        this.router.navigate(['/']); // Redirect to home if authenticated
      },
      (error) => {
        console.log('Not logged in:', error); // Log error if not authenticated
      }
    );
  }
}
