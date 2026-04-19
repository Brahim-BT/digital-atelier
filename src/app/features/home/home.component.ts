import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Product, Category } from '@shared/models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, SkeletonModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    
    <div class="home-page">
      <section class="hero">
        <div class="hero-content">
          <div class="hero-text">
            <span class="hero-tag">New Collection 2026</span>
            <h1 class="hero-title">Curated Modernity</h1>
            <p class="hero-description">
              Discover our latest collection of technical essentials, 
              where innovation meets understated elegance.
            </p>
            <div class="hero-actions">
              <button pButton label="Explore Collection" routerLink="/products" class="hero-btn-primary"></button>
              <button pButton label="Our Story" class="hero-btn-secondary" [outlined]="true"></button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-gradient"></div>
            <img 
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800" 
              alt="Hero" 
              class="hero-image"
            />
          </div>
        </div>
      </section>

      <section class="categories">
        <div class="section-header">
          <h2>Shop by Category</h2>
          <a routerLink="/products" class="view-all">View All</a>
        </div>
        <div class="category-grid">
          @for (category of categories(); track category.id) {
            <article class="category-card" [routerLink]="['/products']" [queryParams]="{category: category.slug}">
              <img [src]="category.image" [alt]="category.name" class="category-image" />
              <div class="category-overlay">
                <h3>{{ category.name }}</h3>
                <span>{{ category.productCount }} Products</span>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="featured">
        <div class="section-header">
          <h2>Featured Products</h2>
          <a routerLink="/products" class="view-all">View All</a>
        </div>
        
        @if (loading()) {
          <div class="products-grid">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton-card">
                <p-skeleton width="100%" height="300px"></p-skeleton>
                <p-skeleton width="60%" height="1rem" styleClass="mt-3"></p-skeleton>
                <p-skeleton width="80%" height="1.25rem" styleClass="mt-2"></p-skeleton>
                <p-skeleton width="40%" height="1rem" styleClass="mt-2"></p-skeleton>
              </div>
            }
          </div>
        } @else {
          <div class="products-grid">
            @for (product of featuredProducts(); track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>
        }
      </section>

      <section class="cta-banner">
        <div class="cta-content">
          <h2>Complimentary Shipping</h2>
          <p>On all orders over $500. Exclusively for members.</p>
          <button pButton label="Join the Atelier" routerLink="/auth" class="cta-btn"></button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-top: 72px;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }
      
      .view-all {
        font-size: 0.875rem;
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .hero {
      min-height: calc(100vh - 72px);
      display: flex;
      align-items: center;
      padding: 4rem 2rem;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    }
    
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .hero-tag {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--primary-color-bg);
      border: 1px solid var(--primary-color-border);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary-color);
      margin-bottom: 1.5rem;
    }
    
    .hero-title {
      font-family: 'Manrope', sans-serif;
      font-size: 4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 1.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    
    .hero-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 2rem;
      max-width: 480px;
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
    }
    
    .hero-btn-primary {
      background: var(--primary-color);
      color: var(--primary-color-text);
      border: none;
      padding: 1rem 2rem;
      font-weight: 600;
      border-radius: 8px;
      
      &:hover {
        background: var(--primary-color-hover);
      }
    }
    
    .hero-btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--surface-border);
      padding: 1rem 2rem;
      font-weight: 500;
      border-radius: 8px;
      
      &:hover {
        background: var(--surface-hover);
        border-color: var(--text-disabled);
      }
    }
    
    .hero-visual {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
    }
    
    .hero-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--primary-color-bg) 0%, transparent 50%);
      z-index: 1;
    }
    
    .hero-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }
    
    .categories {
      padding: 5rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    
    .category-card {
      position: relative;
      aspect-ratio: 3/4;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      
      &:hover {
        .category-image {
          transform: scale(1.05);
        }
        
        .category-overlay {
          background: rgba(0, 0, 0, 0.5);
        }
      }
    }
    
    .category-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    
    .category-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      transition: background 0.3s ease;
      
      h3 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 0.25rem;
      }
      
      span {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    
    .featured {
      padding: 0 2rem 5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    
    .skeleton-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1rem;
    }
    
    .cta-banner {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 5rem 2rem;
      text-align: center;
    }
    
    .cta-content {
      max-width: 600px;
      margin: 0 auto;
      
      h2 {
        font-family: 'Manrope', sans-serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 1rem;
      }
      
      p {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0 0 2rem;
      }
    }
    
    .cta-btn {
      background: var(--primary-color);
      color: var(--primary-color-text);
      border: none;
      padding: 1rem 2.5rem;
      font-weight: 600;
      border-radius: 8px;
      
      &:hover {
        background: var(--primary-color-hover);
      }
    }
    
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .hero-title {
        font-size: 3rem;
      }
      
      .hero-description {
        margin: 0 auto 2rem;
      }
      
      .hero-actions {
        justify-content: center;
      }
      
      .hero-visual {
        max-width: 500px;
        margin: 0 auto;
      }
      
      .category-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .hero {
        min-height: auto;
        padding: 2rem 1rem;
      }
      
      .hero-title {
        font-size: 2.25rem;
      }
      
      .hero-actions {
        flex-direction: column;
      }
      
      .category-grid {
        grid-template-columns: 1fr;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  
  loading = signal(true);
  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);

  async ngOnInit(): Promise<void> {
    const [products, cats] = await Promise.all([
      this.productService.getFeaturedProducts(),
      this.productService.getCategories()
    ]);
    
    this.featuredProducts.set(products);
    this.categories.set(cats);
    this.loading.set(false);
  }
}
