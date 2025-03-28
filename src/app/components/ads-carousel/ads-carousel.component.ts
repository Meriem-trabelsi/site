import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ads-carousel',
  standalone: true, // Ensures it's a standalone component
  imports: [CommonModule],
  templateUrl: './ads-carousel.component.html',
  styleUrl: './ads-carousel.component.css'
})
export class AdsCarouselComponent {
  slides = [
    {
      image: 'client/src/assets/image1.jpeg',
      title: 'Computers up to -15% off',
      description: 'The biggest risk is a missed opportunity.',
      button: 'Shop Now',
      link: '#'
    },
    {
      image: 'https://source.unsplash.com/1200x500/?smartphone,gadgets',
      title: 'Latest Smartphones Available',
      description: 'Get the newest devices at unbeatable prices!',
      button: 'Browse Phones',
      link: '#'
    },
    {
      image: 'https://source.unsplash.com/1200x500/?gaming,console',
      title: 'Gaming Gear on Discount',
      description: 'Upgrade your setup with the best gaming accessories.',
      button: 'Explore Now',
      link: '#'
    },
    {
      image: 'https://source.unsplash.com/1200x500/?headphones,audio',
      title: 'Premium Headphones & Audio',
      description: 'Experience sound like never before.',
      button: 'Check Deals',
      link: '#'
    }
  ];
}
