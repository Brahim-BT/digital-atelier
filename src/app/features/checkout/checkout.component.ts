import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@core/services';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    SelectModule,
    RadioButtonModule,
    StepsModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    
    <div class="checkout-page">
      <div class="page-header">
        <a routerLink="/cart" class="back-link">
          <i class="pi pi-arrow-left"></i>
          Back to Cart
        </a>
        <h1>Checkout</h1>
      </div>
      
      <div class="checkout-content">
        <div class="checkout-main">
          <p-steps [model]="steps" [activeIndex]="currentStep()" [readonly]="false" (activeIndexChange)="onStepChange($event)"></p-steps>
          
          @if (currentStep() === 0) {
            <div class="step-content">
              <h2>Shipping Information</h2>
              
              <form [formGroup]="shippingForm" class="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input pInputText id="firstName" formControlName="firstName" />
                  </div>
                  <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input pInputText id="lastName" formControlName="lastName" />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input pInputText id="email" type="email" formControlName="email" />
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone</label>
                    <p-inputMask mask="(999) 999-9999" id="phone" formControlName="phone" placeholder="(555) 123-4567"></p-inputMask>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="address">Street Address</label>
                  <input pInputText id="address" formControlName="address" />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City</label>
                    <input pInputText id="city" formControlName="city" />
                  </div>
                  <div class="form-group">
                    <label for="postalCode">Postal Code</label>
                    <p-inputMask mask="99999" id="postalCode" formControlName="postalCode" placeholder="12345"></p-inputMask>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="country">Country</label>
                  <p-select 
                    [options]="countries" 
                    formControlName="country" 
                    optionLabel="name" 
                    optionValue="code"
                    placeholder="Select country"
                  ></p-select>
                </div>
                
                <div class="form-actions">
                  <button pButton label="Continue to Payment" icon="pi pi-arrow-right" iconPos="right" (click)="goToPayment()" [disabled]="shippingForm.invalid"></button>
                </div>
              </form>
            </div>
          }
          
          @if (currentStep() === 1) {
            <div class="step-content">
              <h2>Payment Method</h2>
              
              <div class="payment-methods">
                <div class="payment-option" [class.selected]="paymentType() === 'credit_card'" (click)="paymentType.set('credit_card')">
                  <p-radioButton name="paymentType" value="credit_card" [(ngModel)]="paymentType" inputId="credit_card"></p-radioButton>
                  <label for="credit_card">
                    <i class="pi pi-credit-card"></i>
                    Credit Card
                  </label>
                </div>
                <div class="payment-option" [class.selected]="paymentType() === 'digital_wallet'" (click)="paymentType.set('digital_wallet')">
                  <p-radioButton name="paymentType" value="digital_wallet" [(ngModel)]="paymentType" inputId="digital_wallet"></p-radioButton>
                  <label for="digital_wallet">
                    <i class="pi pi-mobile"></i>
                    Digital Wallet
                  </label>
                </div>
              </div>
              
              @if (paymentType() === 'credit_card') {
                <form [formGroup]="paymentForm" class="checkout-form">
                  <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <p-inputMask mask="9999 9999 9999 9999" id="cardNumber" formControlName="cardNumber" placeholder="1234 5678 9012 3456"></p-inputMask>
                  </div>
                  
                  <div class="form-group">
                    <label for="cardHolder">Cardholder Name</label>
                    <input pInputText id="cardHolder" formControlName="cardHolder" placeholder="John Doe" />
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group">
                      <label for="expiry">Expiry Date</label>
                      <p-inputMask mask="99/99" id="expiry" formControlName="expiry" placeholder="MM/YY"></p-inputMask>
                    </div>
                    <div class="form-group">
                      <label for="cvv">CVV</label>
                      <p-inputMask mask="999" id="cvv" formControlName="cvv" placeholder="123"></p-inputMask>
                    </div>
                  </div>
                </form>
              } @else {
                <div class="digital-wallet-placeholder">
                  <i class="pi pi-wallet"></i>
                  <p>Apple Pay, Google Pay, and PayPal available at checkout</p>
                </div>
              }
              
              <div class="form-actions">
                <button pButton label="Back" [outlined]="true" (click)="currentStep.set(0)"></button>
                <button pButton label="Place Order" icon="pi pi-check" iconPos="right" (click)="placeOrder()" [loading]="processing()"></button>
              </div>
            </div>
          }
          
          @if (currentStep() === 2) {
            <div class="step-content confirmation">
              <div class="success-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <h2>Order Confirmed!</h2>
              <p class="order-number">Order #{{ orderNumber() }}</p>
              <p class="confirmation-text">
                Thank you for your purchase. We've sent a confirmation email to 
                <strong>{{ shippingForm.get('email')?.value }}</strong>.
              </p>
              
              <div class="confirmation-details">
                <h3>Order Summary</h3>
                <div class="confirmation-items">
                  @for (item of cartService.items(); track item.product.id) {
                    <div class="confirmation-item">
                      <img [src]="item.product.images[0]" [alt]="item.product.name" />
                      <div class="item-info">
                        <span class="name">{{ item.product.name }}</span>
                        <span class="details">Qty: {{ item.quantity }} | {{ item.selectedColor.name }} | {{ item.selectedSize }}</span>
                      </div>
                      <span class="price">{{ formatCurrency(item.product.price * item.quantity) }}</span>
                    </div>
                  }
                </div>
                <div class="confirmation-total">
                  <span>Total</span>
                  <span>{{ formatCurrency(cartService.total()) }}</span>
                </div>
              </div>
              
              <div class="confirmation-actions">
                <button pButton label="Continue Shopping" routerLink="/products"></button>
                <button pButton label="View Order" [outlined]="true"></button>
              </div>
            </div>
          }
        </div>
        
        <aside class="order-summary">
          <h3>Order Summary</h3>
          
          <div class="summary-items">
            @for (item of cartService.items(); track item.product.id) {
              <div class="summary-item">
                <div class="item-image">
                  <img [src]="item.product.images[0]" [alt]="item.product.name" />
                  <span class="item-qty">{{ item.quantity }}</span>
                </div>
                <div class="item-details">
                  <span class="item-name">{{ item.product.name }}</span>
                  <span class="item-variant">{{ item.selectedColor.name }} / {{ item.selectedSize }}</span>
                </div>
                <span class="item-price">{{ formatCurrency(item.product.price * item.quantity) }}</span>
              </div>
            }
          </div>
          
          <div class="summary-totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>{{ formatCurrency(cartService.subtotal()) }}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>{{ cartService.shipping() === 0 ? 'Free' : formatCurrency(cartService.shipping()) }}</span>
            </div>
            <div class="total-row">
              <span>Tax</span>
              <span>{{ formatCurrency(cartService.tax()) }}</span>
            </div>
            @if (cartService.discount() > 0) {
              <div class="total-row discount">
                <span>Discount</span>
                <span>-{{ formatCurrency(cartService.discount()) }}</span>
              </div>
            }
            <div class="total-row grand-total">
              <span>Total</span>
              <span>{{ formatCurrency(cartService.total()) }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page {
      padding-top: 72px;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header {
      background: var(--bg-secondary);
      padding: 2rem;
      border-bottom: 1px solid var(--surface-border);
      
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      h1 {
        font-family: 'Manrope', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }
    }
    
    .checkout-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
    }
    
    .checkout-main {
      :host ::ng-deep .p-steps {
        margin-bottom: 2rem;
        
        .p-steps-item .p-menuitem-link {
          background: transparent;
          
          .p-steps-number {
            background: var(--surface-input-bg);
            color: var(--text-muted);
            border-color: var(--surface-border);
          }
          
          .p-steps-title {
            color: var(--text-muted);
          }
        }
        
        .p-steps-item.p-highlight .p-menuitem-link {
          .p-steps-number {
            background: var(--primary-color);
            color: var(--primary-color-text);
            border-color: var(--primary-color);
          }
          
          .p-steps-title {
            color: var(--text-primary);
          }
        }
      }
    }
    
    .step-content {
      background: var(--surface-card);
      border-radius: 16px;
      padding: 2rem;
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1.5rem;
      }
    }
    
    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border);
    }
    
    .payment-methods {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .payment-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      background: var(--surface-hover);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
      
      &.selected {
        background: var(--primary-color-bg);
        border-color: var(--primary-color);
      }
      
      label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        color: var(--text-primary);
        font-weight: 500;
        
        i {
          font-size: 1.25rem;
          color: var(--primary-color);
        }
      }
    }
    
    .digital-wallet-placeholder {
      text-align: center;
      padding: 3rem;
      background: var(--surface-hover);
      border-radius: 12px;
      
      i {
        font-size: 3rem;
        color: var(--text-disabled);
        margin-bottom: 1rem;
      }
      
      p {
        color: var(--text-muted);
        margin: 0;
      }
    }
    
    .confirmation {
      text-align: center;
      
      .success-icon {
        margin-bottom: 1.5rem;
        
        i {
          font-size: 4rem;
          color: var(--accent-success);
        }
      }
      
      .order-number {
        color: var(--primary-color);
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .confirmation-text {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }
    }
    
    .confirmation-details {
      background: var(--surface-hover);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
      
      h3 {
        font-family: 'Manrope', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem;
      }
    }
    
    .confirmation-items {
      margin-bottom: 1rem;
    }
    
    .confirmation-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--surface-border);
      
      img {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
      }
      
      .item-info {
        flex: 1;
        
        .name {
          display: block;
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .details {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      }
      
      .price {
        font-weight: 600;
        color: var(--text-primary);
      }
    }
    
    .confirmation-total {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    .order-summary {
      background: var(--surface-card);
      border-radius: 16px;
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 100px;
      
      h3 {
        font-family: 'Manrope', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1.5rem;
      }
    }
    
    .summary-items {
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .item-image {
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 6px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .item-qty {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 18px;
        height: 18px;
        background: var(--primary-color);
        color: var(--primary-color-text);
        border-radius: 50%;
        font-size: 0.625rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .item-details {
      flex: 1;
      
      .item-name {
        display: block;
        font-size: 0.875rem;
        color: var(--text-primary);
        font-weight: 500;
      }
      
      .item-variant {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    }
    
    .item-price {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .summary-totals {
      padding-top: 0.5rem;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      
      &.discount {
        color: var(--accent-success);
      }
      
      &.grand-total {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--surface-border);
        font-family: 'Manrope', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }
    
    @media (max-width: 1024px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }
      
      .order-summary {
        position: static;
        order: -1;
      }
    }
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .payment-methods {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  
  currentStep = signal(0);
  processing = signal(false);
  orderNumber = signal('');
  paymentType = signal<'credit_card' | 'digital_wallet'>('credit_card');
  
  steps: MenuItem[] = [
    { label: 'Shipping' },
    { label: 'Payment' },
    { label: 'Confirmation' }
  ];
  
  countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Australia', code: 'AU' }
  ];
  
  shippingForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['US', Validators.required]
  });
  
  paymentForm: FormGroup = this.fb.group({
    cardNumber: ['', Validators.required],
    cardHolder: ['', Validators.required],
    expiry: ['', Validators.required],
    cvv: ['', Validators.required]
  });
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  
  onStepChange(index: number): void {
    this.currentStep.set(index);
  }
  
  goToPayment(): void {
    if (this.shippingForm.valid) {
      this.currentStep.set(1);
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }
  
  async placeOrder(): Promise<void> {
    if (this.paymentType() === 'credit_card' && this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    
    this.processing.set(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.orderNumber.set('DA-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    this.cartService.clearCart();
    this.processing.set(false);
    this.currentStep.set(2);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Order Placed',
      detail: 'Your order has been successfully placed!'
    });
  }
}
