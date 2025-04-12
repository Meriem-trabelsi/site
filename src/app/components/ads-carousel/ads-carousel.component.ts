import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap'; // ✅ Import correct

@Component({
  selector: 'app-ads-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ads-carousel.component.html',
  styleUrls: ['./ads-carousel.component.css']
})
export class AdsCarouselComponent implements AfterViewInit {

  slides = [
    {
      image: 'assets/images/promo11.jpg',
      title: '',
      description: '',
      link: '#',
      button: 'Voir Plus'
    },
    {
      image: 'assets/images/promo1.jpg',
      title: '',
      description: '',
      link: '#',
      button: 'Voir Plus'
    },
    {
      image: 'assets/images/promo111.jpg',
      title: '',
      description: '',
      link: '#',
      button: 'Voir Plus'
    },
    {
      image: 'assets/images/promo2.jpg',
      title: '',
      description: '',
      link: '#',
      button: 'Voir Plus'
    }
  ];
 

  ngAfterViewInit() {
    const carouselElement = document.querySelector('#promoCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement); 
    }
  }
}
