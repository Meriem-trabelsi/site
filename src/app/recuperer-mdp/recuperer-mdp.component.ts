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
  // Variable to track the current stage of password recovery
  currentStage: 'request' | 'reset' = 'request';
  
  // Form data
  email: string = ''; 
  verificationCode: string = ''; 
  newPassword: string = ''; 
  confirmPassword: string = ''; 
  
  serverCode: string = ''; 
  
  constructor(private http: HttpClient, private router: Router) {} // Injecting HttpClient and Router services in the constructor
  
  // Method to send the verification code
  sendCode(): void {    
    // Validate the email address
    if (!this.email || !this.validateEmail(this.email)) {
      alert('Please enter a valid email address.');
      return; // Return if the email address is invalid
    }

    // Call API to send the verification code
    this.http.post<any>('http://localhost:5000/Client/forgotpassword', { email: this.email }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Response received:', response); // Log the server response
          this.serverCode = response.code; // Store the server's verification code
          this.currentStage = 'reset'; // Move to the reset password stage
        },
        error: (error) => {
          console.error('Error sending verification code:', error); // Log error if it occurs
          if (error.status === 404) {
            alert('Email address not found.'); // Error message if email is not found
          } else {
            alert('An error occurred. Please try again.'); // General error message
          }
        }
      });
  }
  
  // Method to reset the password
  resetPassword(): void {
    console.log('resetPassword called'); // Log message to verify the method is called
    
    // Validate the verification code
    if (!this.verificationCode) {
      alert('Please enter the verification code.');
      return; // Return if the verification code is empty
    }
    
    // Check if the code matches the one received from the server
    if (this.serverCode && String(this.verificationCode) !== String(this.serverCode)) {
      alert('Incorrect verification code.'+ this.serverCode + ' ' + this.verificationCode);
      return; // Return if the codes do not match
    }
    
    // Validate the new password
    if (!this.newPassword) {
      alert('Please enter a new password.');
      return; // Return if the password is empty
    }
    
    // Check if the password and confirmation match
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return; // Return if the passwords do not match
    }
    
    // Call API to change the password
    this.http.post<any>('http://localhost:5000/Client/changepass', { 
      email: this.email, // The user's email address
      newPassword: this.newPassword // The new password
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Password changed successfully:', response); // Log success message
        alert('Your password has been successfully changed!'); // Success message
        this.router.navigate(['/login']); // Redirect to the login page
      },
      error: (error) => {
        console.error('Error changing password:', error); // Log error if it occurs
        alert('An error occurred while changing the password.'); // Error message if the change fails
      }
    });
  }
  
  // Method to validate the email address format
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression to validate email format
    return emailRegex.test(email); // Return true if the email is valid, otherwise false
  }
}
