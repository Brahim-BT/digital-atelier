import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink, 
    ButtonModule, 
    InputNumberModule, 
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast position="top-center"></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="cart-page">
      <div class="page-header">
        <h1>Your Bag</h1>
        <p>{{ cartService.itemCount() }} {{ cartService.itemCount() === 1 ? 'item' : 'items' }}</p>
      </div>
      
      @if (cartService.items().length === 0) {
        <div class="empty-cart">
          <i class="pi pi-shopping-bag"></i>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added any items yet.</p>
          <button pButton label="Continue Shopping" routerLink="/products"></button>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            @for (item of cartService.items(); track item.product.id + item.selectedColor.name + item.selectedSize) {
              <article class="cart-item">
                <div class="item-image">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" />
                </div>
                
                <div class="item-details">
                  <div class="item-info">
                    <span class="item-category">{{ item.product.category }}</span>
                    <h3 class="item-name">{{ item.product.name }}</h3>
                    <div class="item-options">
                      <span>Color: {{ item.selectedColor.name }}</span>
                      <span>Size: {{ item.selectedSize }}</span>
                    </div>
                  </div>
                  
                  <div class="item-quantity">
                    <p-inputNumber 
                      [ngModel]="item.quantity" 
                      [min]="1" 
                      [max]="10"
                      [showButtons]="true"
                      buttonLayout="horizontal"
                      (ngModelChange)="updateQuantity(item, $event)"
                    ></p-inputNumber>
                  </div>
                  
                  <div class="item-price">
                    <span class="price">{{ formatCurrency(item.product.price * item.quantity) }}</span>
                  </div>
                  
                  <button class="remove-btn" (click)="removeItem(item)">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </article>
            }
          </div>
          
          <aside class="order-summary">
            <h2>Order Summary</h2>
            
            <div class="summary-rows">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ formatCurrency(cartService.subtotal()) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>
                  @if (cartService.shipping() === 0) {
                    <span class="free-shipping">Free</span>
                  } @else {
                    {{ formatCurrency(cartService.shipping()) }}
                  }
                </span>
              </div>
              <div class="summary-row">
                <span>Tax (8%)</span>
                <span>{{ formatCurrency(cartService.tax()) }}</span>
              </div>
              @if (cartService.discount() > 0) {
                <div class="summary-row discount">
                  <span>Discount</span>
                  <span>-{{ formatCurrency(cartService.discount()) }}</span>
                </div>
              }
            </div>
            
            <div class="promo-code">
              <label for="promo">Promo Code</label>
              <div class="promo-input">
                <input 
                  pInputText 
                  id="promo"
                  [(ngModel)]="promoCode"
                  placeholder="Enter code"
                  [disabled]="cartService.discount() > 0"
                />
                <button 
                  pButton 
                  [outlined]="true"
                  [disabled]="!promoCode || cartService.discount() > 0"
                  (click)="applyPromo()"
                >
                  Apply
                </button>
              </div>
              @if (promoError()) {
                <span class="promo-error">{{ promoError() }}</span>
              }
              @if (cartService.discount() > 0) {
                <span class="promo-success">ATELIER20 applied - 20% off!</span>
              }
            </div>
            
            <div class="summary-total">
              <span>Total</span>
              <span>{{ formatCurrency(cartService.total()) }}</span>
            </div>
            
            <button pButton label="Proceed to Checkout" class="checkout-btn" routerLink="/checkout"></button>
            
            <button pButton label="Continue Shopping" [outlined]="true" class="continue-btn" routerLink="/products"></button>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-page {
      padding-top: 72px;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header {
      background: var(--bg-secondary);
      padding: 3rem 2rem;
      border-bottom: 1px solid var(--surface-border);
      
      h1 {
        font-family: 'Manrope', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 0.5rem;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin: 0;
      }
    }
    
    .empty-cart {
      text-align: center;
      padding: 6rem 2rem;
      
      i {
        font-size: 4rem;
        color: var(--text-disabled);
        margin-bottom: 1.5rem;
      }
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.5rem;
        color: var(--text-primary);
        margin: 0 0 0.5rem;
      }
      
      p {
        font-size: 1rem;
        color: var(--text-muted);
        margin: 0 0 2rem;
      }
    }
    
    .cart-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
    }
    
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .cart-item {
      display: flex;
      gap: 1.5rem;
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .item-image {
      width: 140px;
      height: 140px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .item-details {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 1.5rem;
      align-items: center;
    }
    
    .item-category {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary-color);
    }
    
    .item-name {
      font-family: 'Manrope', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0.25rem 0 0.5rem;
    }
    
    .item-options {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    
    .item-price .price {
      font-family: 'Manrope', sans-serif;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .remove-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all var(--transition-fast);
      
      &:hover {
        background: rgba(255, 107, 107, 0.15);
        color: var(--accent-error);
      }
    }
    
    .order-summary {
      background: var(--surface-card);
      border-radius: 16px;
      padding: 2rem;
      height: fit-content;
      position: sticky;
      top: 100px;
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1.5rem;
      }
    }
    
    .summary-rows {
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      
      &.discount {
        color: var(--accent-success);
      }
      
      .free-shipping {
        color: var(--accent-success);
        font-weight: 500;
      }
    }
    
    .promo-code {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
    }
    
    .promo-input {
      display: flex;
      gap: 0.5rem;
      
      input {
        flex: 1;
        background: var(--surface-input-bg);
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        color: var(--text-primary);
        padding: 0.625rem 0.875rem;
        font-size: 0.875rem;
        
        &::placeholder {
          color: var(--text-muted);
        }
        
        &:focus {
          border-color: var(--primary-color);
          outline: none;
        }
      }
    }
    
    .promo-error {
      display: block;
      font-size: 0.75rem;
      color: var(--accent-error);
      margin-top: 0.5rem;
    }
    
    .promo-success {
      display: block;
      font-size: 0.75rem;
      color: var(--accent-success);
      margin-top: 0.5rem;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: 1.5rem 0;
      border-top: 1px solid var(--surface-border);
      margin-bottom: 1.5rem;
      
      span {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }
    
    .checkout-btn {
      width: 100%;
      margin-bottom: 0.75rem;
    }
    
    .continue-btn {
      width: 100%;
    }
    
    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
      
      .order-summary {
        position: static;
      }
    }
    
    @media (max-width: 640px) {
      .cart-item {
        flex-direction: column;
      }
      
      .item-image {
        width: 100%;
        height: 200px;
      }
      
      .item-details {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  
  promoCode = '';
  promoError = signal('');
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  
  updateQuantity(item: any, quantity: number): void {
    this.cartService.updateQuantity(
      item.product.id,
      item.selectedColor.name,
      item.selectedSize,
      quantity
    );
  }
  
  removeItem(item: any): void {
    this.confirmationService.confirm({
      message: `Remove ${item.product.name} from your bag?`,
      header: 'Remove Item',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => {
        this.cartService.removeItem(
          item.product.id,
          item.selectedColor.name,
          item.selectedSize
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Item Removed',
          detail: `${item.product.name} has been removed from your bag`
        });
      }
    });
  }
  
  applyPromo(): void {
    this.promoError.set('');
    
    if (!this.cartService.applyDiscount(this.promoCode)) {
      this.promoError.set('Invalid promo code');
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Promo Applied',
        detail: '20% discount has been applied!'
      });
    }
  }
}
