import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Ensure HttpClient is imported
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

type LostPetFormFields = {
  name: string;
  breed: string;
  age: string;
  petType: string;
  location: string;
  dateLost: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  image: File | null;
};

@Component({
  selector: 'app-post-lost',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './post-lost.component.html',
  styleUrls: ['./post-lost.component.css']
})
export class PostLostComponent implements OnInit {

  isSubmitting = false;
  imagePreview: string | null = null;

  formData: LostPetFormFields = {
    name: '',
    breed: '',
    age: '',
    petType: '',
    location: '',
    dateLost: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    image: null,
  };

  constructor(private http: HttpClient, private router: Router) {}

  updateField<K extends keyof LostPetFormFields>(key: K, value: LostPetFormFields[K]) {
    this.formData[key] = value;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.formData.image = file;
  }

  handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.formData.image = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handleSelectChange<K extends keyof LostPetFormFields>(field: K, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.formData[field] = selectElement.value as LostPetFormFields[K];
  }

  handleSubmit(form: NgForm) {
    this.isSubmitting = true;

    const requiredFields: (keyof LostPetFormFields)[] = ['name', 'breed', 'age', 'description', 'dateLost'];
    for (const field of requiredFields) {
      if (!this.formData[field]) {
        alert('Please fill all required fields.');
        this.isSubmitting = false;
        return;
      }
    }

    setTimeout(() => {
      console.log('Lost pet reported:', this.formData);
      alert('Lost pet posted successfully!');
      this.isSubmitting = false;
    }, 1500);
  }

  triggerFileInput() {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput?.click();
  }

  removeImage() {
    this.formData.image = null;
    this.imagePreview = null;
  }

  navigateToLost() {
    this.router.navigate(['/lost']);
  }

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
}
