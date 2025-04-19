import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-adoptdetails',
  standalone: true,
  imports: [],
  templateUrl: './adoptdetails.component.html',
  styleUrls: ['./adoptdetails.component.css']
})
export class AdoptdetailsComponent {
  @Input() pet: any;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
  adoptPet() {
    // Handle adoption logic here, such as showing a confirmation message or sending a request
    console.log(`Adopted pet: ${this.pet.name}`);
    this.close(); // Optionally close the modal after adoption
  }
}