import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lostdetails',
  templateUrl: './lostdetails.component.html',
  styleUrls: ['./lostdetails.component.css'],
  standalone: true,
  imports: [CommonModule] 
})
export class LostDetailsComponent {
  @Input() pet: any;
  @Output() closeModal = new EventEmitter<void>(); // Emit event to close modal

  close() {
    this.closeModal.emit(); // Emit the closeModal event to the parent
  }
}
