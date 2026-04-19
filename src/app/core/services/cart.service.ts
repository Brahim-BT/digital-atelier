import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product, ProductColor } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  
  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => 
    this._items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  readonly shipping = computed(() => this.subtotal() > 500 ? 0 : 25);
  readonly tax = computed(() => this.subtotal() * 0.08);
  readonly discount = signal(0);
  readonly total = computed(() => this.subtotal() + this.shipping() + this.tax() - this.discount());

  addItem(product: Product, color: ProductColor, size: string, quantity: number = 1): void {
    const existingIndex = this._items().findIndex(
      item => item.product.id === product.id && 
              item.selectedColor.name === color.name && 
              item.selectedSize === size
    );

    if (existingIndex >= 0) {
      const items = [...this._items()];
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + quantity
      };
      this._items.set(items);
    } else {
      this._items.update(items => [...items, { product, quantity, selectedColor: color, selectedSize: size }]);
    }
  }

  updateQuantity(productId: string, colorName: string, size: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId, colorName, size);
      return;
    }

    this._items.update(items => 
      items.map(item => 
        item.product.id === productId && 
        item.selectedColor.name === colorName && 
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  }

  removeItem(productId: string, colorName: string, size: string): void {
    this._items.update(items => 
      items.filter(item => 
        !(item.product.id === productId && 
          item.selectedColor.name === colorName && 
          item.selectedSize === size)
      )
    );
  }

  applyDiscount(code: string): boolean {
    if (code === 'ATELIER20') {
      this.discount.set(this.subtotal() * 0.20);
      return true;
    }
    return false;
  }

  clearCart(): void {
    this._items.set([]);
    this.discount.set(0);
  }
}
