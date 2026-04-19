import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@shared/models';

const STORAGE_KEY = 'digital_atelier_favorites';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly _favoriteIds = signal<Set<string>>(this.loadFromStorage());
  
  readonly favoriteIds = this._favoriteIds.asReadonly();
  readonly favoriteCount = computed(() => this._favoriteIds().size);

  private loadFromStorage(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this._favoriteIds()]));
    } catch {
      console.warn('Could not save favorites to localStorage');
    }
  }

  isFavorite(productId: string): boolean {
    return this._favoriteIds().has(productId);
  }

  addFavorite(product: Product): void {
    this._favoriteIds.update(ids => {
      const newIds = new Set(ids);
      newIds.add(product.id);
      return newIds;
    });
    this.saveToStorage();
  }

  removeFavorite(productId: string): void {
    this._favoriteIds.update(ids => {
      const newIds = new Set(ids);
      newIds.delete(productId);
      return newIds;
    });
    this.saveToStorage();
  }

  toggleFavorite(product: Product): void {
    if (this.isFavorite(product.id)) {
      this.removeFavorite(product.id);
    } else {
      this.addFavorite(product);
    }
  }

  clearFavorites(): void {
    this._favoriteIds.set(new Set());
    this.saveToStorage();
  }
}