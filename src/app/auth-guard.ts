import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Add HttpClient import
import { catchError, map } from 'rxjs/operators';  // For error handling and response manipulation

@Injectable({
  providedIn: 'root',
})
export class SimpleAuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.http.get<{client: any}>('http://localhost:5000/Client/checkAuth', { withCredentials: true }).pipe(
      map((response) => {
        console.log(response);
        return true; // If the API call is successful, the user is authenticated
      }),
      catchError((error) => {
        console.error('Error fetching authentication status:', error);
        this.router.navigate(['/login']);  // Redirect to login if there's an error
        return [false];  // Return an observable of false, meaning access is denied
      })
    );
  }
}
