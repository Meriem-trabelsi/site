import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-commander',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './commander.component.html',
  styleUrls: ['./commander.component.css']
})
export class CommanderComponent {
  formData = {
    prenom: '',
    nom: '',
    region: 'Tunis',
    adresse: '',
    telephone: '',
    email: '',
    paiement: 'Paypal'
  };

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:5000/commander', this.formData)
      .subscribe(
        (response: any) => {
          alert(response.message);
          this.resetForm();
        },
        (error) => {
          alert('Erreur lors de la commande');
          console.error(error);
        }
      );
  }

  resetForm() {
    this.formData = {
      prenom: '',
      nom: '',
      region: 'Tunis',
      adresse: '',
      telephone: '',
      email: '',
      paiement: 'Paypal'
    };
  }
}
