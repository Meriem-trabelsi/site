import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false; // Track login status

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.http.get<{ client: any }>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).subscribe(
      (response) => {
        console.log('Already logged in:', response);
        this.isLoggedIn = true;  // User is logged in
      },
      (error) => {
        console.log('Not logged in:', error);
        this.isLoggedIn = false; // User is not logged in
      }
    );
  }

  goToPage(): void {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.http.post('http://localhost:5000/Client/logout', {}, { withCredentials: true }).subscribe(
      () => {
        alert('Logged out successfully');
        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      (error) => {
        console.log('Logout failed:', error);
      }
    );
  }
}
