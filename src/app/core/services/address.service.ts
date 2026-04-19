import { Injectable, signal, computed } from '@angular/core';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly _addresses = signal<Address[]>([
    {
      id: '1',
      label: 'Home',
      fullName: 'Alex Morgan',
      street: '123 Design Street',
      apt: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: '2',
      label: 'Office',
      fullName: 'Alex Morgan',
      street: '456 Innovation Ave',
      apt: 'Suite 200',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);

  readonly addresses = this._addresses.asReadonly();
  readonly addressCount = computed(() => this._addresses().length);
  readonly defaultAddress = computed(() => this._addresses().find(a => a.isDefault) || null);

  addAddress(address: Omit<Address, 'id' | 'isDefault'>): void {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
      isDefault: this._addresses().length === 0
    };
    this._addresses.update(addresses => [...addresses, newAddress]);
  }

  updateAddress(id: string, updates: Partial<Address>): void {
    this._addresses.update(addresses =>
      addresses.map(addr =>
        addr.id === id ? { ...addr, ...updates } : addr
      )
    );
  }

  deleteAddress(id: string): void {
    const addresses = this._addresses();
    const addressToDelete = addresses.find(a => a.id === id);
    
    this._addresses.update(addrs => {
      const filtered = addrs.filter(addr => addr.id !== id);
      if (addressToDelete?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }

  setDefaultAddress(id: string): void {
    this._addresses.update(addresses =>
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  }

  getAddressById(id: string): Address | undefined {
    return this._addresses().find(a => a.id === id);
  }
}
