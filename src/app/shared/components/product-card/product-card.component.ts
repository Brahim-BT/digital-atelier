import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, RatingModule, RippleModule, FormsModule],
  template: `
    <article class="product-card" pRipple [routerLink]="['/products', product.id]">
      <div class="product-image-container">
        <img [src]="product.images[0]" [alt]="product.name" class="product-image" />
        <div class="product-overlay">
          <button class="quick-view-btn">Quick View</button>
        </div>
        @if (product.originalPrice) {
          <span class="sale-badge">Sale</span>
        }
      </div>
      
      <div class="product-info">
        <span class="product-category">{{ product.category }}</span>
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="product-meta">
          <p-rating [(ngModel)]="product.rating" [readonly]="true"></p-rating>
          <span class="review-count">({{ product.reviewCount }})</span>
        </div>
        <div class="product-pricing">
          <span class="current-price">{{ formatCurrency(product.price) }}</span>
          @if (product.originalPrice) {
            <span class="original-price">{{ formatCurrency(product.originalPrice) }}</span>
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .product-card {
      background: var(--surface-card);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        
        .product-overlay {
          opacity: 1;
        }
        
        .product-image {
          transform: scale(1.05);
        }
      }
    }
    
    .product-image-container {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    
    .product-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-normal);
    }
    
    .quick-view-btn {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.95);
      color: #0e0e0e;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transform: translateY(10px);
      transition: transform var(--transition-normal);
      
      &:hover {
        background: #ffffff;
      }
    }
    
    .product-card:hover .quick-view-btn {
      transform: translateY(0);
    }
    
    .sale-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 0.375rem 0.75rem;
      background: var(--accent-error);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 4px;
    }
    
    .product-info {
      padding: 1.25rem;
    }
    
    .product-category {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary-color);
      font-weight: 500;
    }
    
    .product-name {
      font-family: 'Manrope', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0.5rem 0;
      line-height: 1.4;
    }
    
    .product-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .review-count {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    .product-pricing {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .current-price {
      font-family: 'Manrope', sans-serif;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .original-price {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }
    
    :host ::ng-deep .p-rating {
      .p-rating-icon {
        color: var(--text-disabled);
        font-size: 0.75rem;
        
        &.p-rating-icon-active {
          color: var(--primary-color);
        }
      }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
}
