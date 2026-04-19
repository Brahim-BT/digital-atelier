import { Component, inject, signal, output, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Address, AddressService } from '@core/services';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  template: `
    <div class="address-form-overlay" (click)="onOverlayClick($event)">
      <div class="address-form-modal">
        <div class="modal-header">
          <h2>{{ isEdit() ? 'Edit Address' : 'Add New Address' }}</h2>
          <button class="close-btn" (click)="close.emit()">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-field">
              <label for="label">Address Label</label>
              <select id="label" formControlName="label" class="select-input">
                <option value="">Select label</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-field">
              <label for="fullName">Full Name</label>
              <input pInputText id="fullName" formControlName="fullName" placeholder="John Doe" />
            </div>
          </div>
          
          <div class="form-field">
            <label for="street">Street Address</label>
            <input pInputText id="street" formControlName="street" placeholder="123 Main Street" />
          </div>
          
          <div class="form-field">
            <label for="apt">Apartment, Suite, etc. (Optional)</label>
            <input pInputText id="apt" formControlName="apt" placeholder="Apt 4B" />
          </div>
          
          <div class="form-row three-col">
            <div class="form-field">
              <label for="city">City</label>
              <input pInputText id="city" formControlName="city" placeholder="San Francisco" />
            </div>
            <div class="form-field">
              <label for="state">State</label>
              <input pInputText id="state" formControlName="state" placeholder="CA" />
            </div>
            <div class="form-field">
              <label for="zipCode">ZIP Code</label>
              <input pInputText id="zipCode" formControlName="zipCode" placeholder="94102" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-field">
              <label for="country">Country</label>
              <select id="country" formControlName="country" class="select-input">
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </div>
            <div class="form-field">
              <label for="phone">Phone Number</label>
              <input pInputText id="phone" formControlName="phone" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          
          @if (isEdit() && !isDefault()) {
            <div class="form-field checkbox-field">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isDefault" />
                <span class="checkbox-custom"></span>
                Set as default address
              </label>
            </div>
          }
          
          <div class="form-actions">
            <button pButton type="button" label="Cancel" [outlined]="true" (click)="close.emit()"></button>
            <button pButton type="submit" [label]="isEdit() ? 'Save Changes' : 'Add Address'" [loading]="saving()" [disabled]="!addressForm.valid"></button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .address-form-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .address-form-modal {
      background: var(--bg-primary);
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }
      
      .close-btn {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background var(--transition-fast);
        
        &:hover {
          background: var(--surface-hover);
        }
        
        .material-symbols-outlined {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }
      }
    }
    
    form {
      padding: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      &.three-col {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .form-field {
      margin-bottom: 1rem;
      
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }
      
      input, .select-input {
        width: 100%;
        padding: 0.75rem 1rem;
        background: var(--surface-input-bg);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
        
        &::placeholder {
          color: var(--text-muted);
        }
        
        &:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 2px var(--primary-color-bg);
        }
      }
      
      .select-input {
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1rem;
        padding-right: 2.5rem;
      }
    }
    
    .checkbox-field {
      margin: 1.5rem 0;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-primary);
      
      input[type="checkbox"] {
        display: none;
      }
      
      .checkbox-custom {
        width: 20px;
        height: 20px;
        border: 2px solid var(--surface-border);
        border-radius: 4px;
        position: relative;
        transition: all var(--transition-fast);
        
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 6px;
          height: 10px;
          border: solid var(--primary-color-text);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
      }
      
      input:checked + .checkbox-custom {
        background: var(--primary-color);
        border-color: var(--primary-color);
        
        &::after {
          opacity: 1;
        }
      }
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--surface-border);
    }
    
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
        
        &.three-col {
          grid-template-columns: 1fr;
        }
      }
    }
    
    select option {
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
    }
  `]
})
export class AddressFormComponent {
  private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  
  address = input<Address | null>(null);
  close = output<void>();
  saved = output<Address>();
  
  saving = signal(false);
  isEdit = signal(false);
  isDefault = signal(false);
  
  addressForm: FormGroup = this.fb.group({
    label: ['', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    street: ['', Validators.required],
    apt: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', [Validators.required, Validators.minLength(3)]],
    country: ['United States', Validators.required],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    isDefault: [false]
  });
  
  ngOnInit(): void {
    const addr = this.address();
    if (addr) {
      this.isEdit.set(true);
      this.isDefault.set(addr.isDefault);
      this.addressForm.patchValue(addr);
    }
  }
  
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('address-form-overlay')) {
      this.close.emit();
    }
  }
  
  async onSubmit(): Promise<void> {
    if (this.addressForm.invalid) return;
    
    this.saving.set(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = this.addressForm.value;
    const addr: Address = {
      id: this.address()?.id || Date.now().toString(),
      ...formData,
      isDefault: this.address()?.isDefault || formData.isDefault
    };
    
    if (this.isEdit()) {
      this.addressService.updateAddress(addr.id, addr);
    } else {
      this.addressService.addAddress(addr);
    }
    
    this.saving.set(false);
    this.saved.emit(addr);
    this.close.emit();
  }
}
