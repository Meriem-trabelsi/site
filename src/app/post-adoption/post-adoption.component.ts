import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

interface PostAdoptionForm {
  petName: string;
  breed: string;
  age: string;
  gender: string;
  type: string;
  image: File | null;
  location: string;
  shelter: string;
  description: string;
  goodWithKids: boolean;
  goodWithOtherPets: boolean;
  houseTrained: boolean;
  specialNeeds: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  [key: string]: string | File | boolean | null;}


@Component({
  selector: 'app-post-adoption',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './post-adoption.component.html',
  styleUrls: ['./post-adoption.component.css']
})
export class PostAdoptionComponent implements OnInit {
  
  formData: PostAdoptionForm = {
    petName: '',
    breed: '',
    age: '',
    gender: '',
    type: '',
    image: null,
    location: '',
    shelter: '',
    description: '',
    goodWithKids: false,
    goodWithOtherPets: false,
    houseTrained: false,
    specialNeeds: false,
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  };
  

  imagePreview: string | null = null;
  isSubmitting: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchClient();
  }
  

  fetchClient(): void {
    this.http.get<any>('http://localhost:5000/Client/getClientInfo', { withCredentials: true }).subscribe(
      (response) => {
        // Fill in the form with client information
        this.formData.contactName = response.nom;
        this.formData.contactPhone = response.tel;
        this.formData.contactEmail = response.email;
      },
      (error) => {
        console.error('Error fetching client info:', error);
      }
    );
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.image = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.formData.image = null;
  }

  triggerFileInput(): void {
    document.getElementById('image')?.click();
  }

  handleSelectChange(field: string, event: any): void {
    this.formData[field] = event.target.value;
  }

  handleSubmit(): void {
    this.isSubmitting = true;
  
    // Step 1: Fetch full client info first
    this.http.get<any>('http://localhost:5000/Client/getClientInfo', { withCredentials: true }).subscribe({
      next: (existingClientInfo) => {
        // Step 2: Merge with updated fields
        const updatedClientInfo = {
          ...existingClientInfo,
          nom: this.formData.contactName,
          tel: this.formData.contactPhone,
          email: this.formData.contactEmail
        };
  
        // Step 3: Send full updated client info
        this.http.put('http://localhost:5000/Client/updateClientInfo', updatedClientInfo, { withCredentials: true }).subscribe({
          next: () => {
            // Step 4: Build FormData for adoption
            const formData = new FormData();
            for (const key in this.formData) {
              if (this.formData[key] !== undefined && this.formData[key] !== null) {
                if (typeof this.formData[key] === 'boolean') {
                  formData.append(key, this.formData[key].toString());
                } else {
                  formData.append(key, this.formData[key] as string | Blob);
                }
              }
            }
  
            // Step 5: Post adoption data
            this.http.post('http://localhost:5000/adoptPet/add', formData, { withCredentials: true }).subscribe({
              next: () => {
                alert('Pet adoption posted successfully!');
                this.router.navigate(['/adoption']);
                this.isSubmitting = false;
              },
              error: (error) => {
                console.error('Error posting adoption:', error);
                alert('Error posting adoption: ' + (error.error?.error || error.message));
                this.isSubmitting = false;
              }
            });
          },
          error: (error) => {
            console.error('Error updating client info:', error);
            alert('Error updating contact info: ' + (error.error?.error || error.message));
            this.isSubmitting = false;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching client info before update:', error);
        alert('Failed to fetch your full profile. Try again.');
        this.isSubmitting = false;
      }
    });
  }
  
  
  

  navigateToAdopt(): void {
    this.router.navigate(['/adopt']);
  }
}
