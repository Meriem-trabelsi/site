import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  taxRate: number = 0.05; // 5%
  shippingRate: number = 15.0; // $15
  fadeTime: number = 300; // 300ms

  ngOnInit() {
    this.assignActions();
    this.recalculateCart();
  }

  // Assign Actions
  assignActions() {
    const quantityInputs = document.querySelectorAll(
      '.product-quantity input'
    ) as NodeListOf<HTMLInputElement>;

    quantityInputs.forEach((input) => {
      input.addEventListener('change', (event) => {
        this.updateQuantity(event.target as HTMLInputElement);
      });
    });

    const removeButtons = document.querySelectorAll('.remove-product');

    removeButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        this.removeItem(event.target);
      });
    });
  }

  // Recalculate Cart
  recalculateCart() {
    let subtotal = 0;

    document.querySelectorAll('.product').forEach((product: Element) => {
      const linePrice = parseFloat(
        (product.querySelector('.product-line-price') as HTMLElement).innerText
      );
      subtotal += linePrice;
    });

    let tax = subtotal * this.taxRate;
    let shipping = subtotal > 0 ? this.shippingRate : 0;
    let total = subtotal + tax + shipping;

    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout');

    if (cartSubtotal && cartTax && cartShipping && cartTotal) {
      setTimeout(() => {
        cartSubtotal.innerHTML = subtotal.toFixed(2);
        cartTax.innerHTML = tax.toFixed(2);
        cartShipping.innerHTML = shipping.toFixed(2);
        cartTotal.innerHTML = total.toFixed(2);
      }, this.fadeTime);
    }

    if (total == 0 && checkoutBtn) {
      checkoutBtn.classList.add('hide');
    } else if (checkoutBtn) {
      checkoutBtn.classList.remove('hide');
    }
  }

  // Update Quantity
  updateQuantity(input: HTMLInputElement) {
    const productRow = input.closest('.product');
    const price = parseFloat(
      (productRow?.querySelector('.product-price') as HTMLElement).innerText
    );
    const quantity = parseInt(input.value);
    const linePrice = price * quantity;

    if (productRow) {
      const linePriceElement = productRow.querySelector(
        '.product-line-price'
      ) as HTMLElement;
      setTimeout(() => {
        linePriceElement.innerText = linePrice.toFixed(2);
        this.recalculateCart();
      }, this.fadeTime);
    }
  }

  // Remove Item
  removeItem(btn: any) {
    const productRow = btn.closest('.product') as HTMLElement;

    productRow.classList.add('removed'); // For Animation

    setTimeout(() => {
      productRow.remove();
      this.recalculateCart();
    }, this.fadeTime);
  }
}
