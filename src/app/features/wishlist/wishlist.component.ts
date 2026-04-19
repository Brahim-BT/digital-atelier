import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models';
import { ProductService, FavoritesService, CartService } from '@core/services';
import { ProductCardComponent } from '@shared/components';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, ButtonModule],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
        <a routerLink="/home" class="back-link">
          <span class="material-symbols-outlined">arrow_back</span>
          Continue Shopping
        </a>
        <h1>My Wishlist</h1>
        @if (favoriteProducts().length > 0) {
          <span class="item-count">{{ favoriteProducts().length }} item{{ favoriteProducts().length === 1 ? '' : 's' }}</span>
        }
      </div>
      
      @if (favoriteProducts().length > 0) {
        <div class="wishlist-content">
          <div class="products-grid">
            @for (product of favoriteProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <div class="empty-icon">
            <span class="material-symbols-outlined">favorite</span>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite products to purchase them later</p>
          <button pButton label="Browse Products" routerLink="/products"></button>
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-page {
      padding-top: 72px;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header {
      background: var(--bg-secondary);
      padding: 2rem;
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      
      .material-symbols-outlined {
        font-size: 1.25rem;
      }
      
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
    
    .item-count {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    
    .wishlist-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .empty-state {
      max-width: 400px;
      margin: 0 auto;
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .empty-icon {
      margin-bottom: 1.5rem;
      
      .material-symbols-outlined {
        font-size: 4rem;
        color: var(--text-disabled);
      }
    }
    
    .empty-state h2 {
      font-family: 'Manrope', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem;
    }
    
    .empty-state p {
      color: var(--text-muted);
      margin: 0 0 2rem;
    }
  `]
})
export class WishlistComponent implements OnInit {
  private productService = inject(ProductService);
  favoritesService = inject(FavoritesService);
  cartService = inject(CartService);
  
  favoriteProducts = signal<Product[]>([]);
  
  async ngOnInit(): Promise<void> {
    const allProducts = await this.productService.getProducts();
    const favoriteIds = this.favoritesService.favoriteIds();
    const favorites = allProducts.filter(p => favoriteIds.has(p.id));
    this.favoriteProducts.set(favorites);
  }
}