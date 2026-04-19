import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@core/services/product.service';
import { Product, Category } from '@shared/models';
import { ProductCardComponent } from '@shared/components';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule, 
    CurrencyPipe,
    ProductCardComponent, 
    SkeletonModule, 
    SliderModule, 
    CheckboxModule, 
    SelectModule,
    ButtonModule,
    PaginatorModule
  ],
  template: `
    <div class="product-list-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Collections</h1>
          <p>{{ filteredProducts().length }} products</p>
        </div>
      </div>
      
      <div class="content-wrapper">
        <aside class="sidebar">
          <div class="filter-section">
            <h3>Categories</h3>
            <div class="filter-options">
              @for (cat of categories(); track cat.id) {
                <div class="filter-option">
                  <p-checkbox 
                    [(ngModel)]="selectedCategories" 
                    [value]="cat.slug" 
                    [inputId]="cat.slug"
                    (onChange)="applyFilters()"
                  ></p-checkbox>
                  <label [for]="cat.slug">{{ cat.name }}</label>
                </div>
              }
            </div>
          </div>
          
          <div class="filter-section">
            <h3>Price Range</h3>
            <div class="price-range">
              <p-slider 
                [(ngModel)]="priceRange" 
                [range]="true" 
                [min]="0" 
                [max]="2000"
                (onChange)="onPriceChange($event)"
                (onSlideEnd)="applyFilters()"
              ></p-slider>
              <div class="price-values">
                <span>{{ priceRange[0] | currency }}</span>
                <span>{{ priceRange[1] | currency }}</span>
              </div>
            </div>
          </div>
          
          <div class="filter-section">
            <h3>Sort By</h3>
            <p-select 
              [(ngModel)]="sortBy" 
              [options]="sortOptions" 
              optionLabel="label" 
              optionValue="value"
              (onChange)="applyFilters()"
              styleClass="sort-select"
            ></p-select>
          </div>
          
          <button 
            pButton 
            label="Clear Filters" 
            [outlined]="true" 
            class="clear-btn"
            (click)="clearFilters()"
          ></button>
        </aside>
        
        <main class="products-main">
          @if (loading()) {
            <div class="products-grid">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="skeleton-card">
                  <p-skeleton width="100%" height="300px"></p-skeleton>
                  <p-skeleton width="60%" height="1rem" styleClass="mt-3"></p-skeleton>
                  <p-skeleton width="80%" height="1.25rem" styleClass="mt-2"></p-skeleton>
                  <p-skeleton width="40%" height="1rem" styleClass="mt-2"></p-skeleton>
                </div>
              }
            </div>
          } @else {
            @if (filteredProducts().length === 0) {
              <div class="no-products">
                <i class="pi pi-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria.</p>
              </div>
            } @else {
              <div class="products-grid">
                @for (product of paginatedProducts(); track product.id) {
                  <app-product-card [product]="product"></app-product-card>
                }
              </div>
              
              <p-paginator 
                [rows]="itemsPerPage" 
                [totalRecords]="filteredProducts().length" 
                [first]="first()"
                (onPageChange)="onPageChange($event)"
                styleClass="custom-paginator"
              ></p-paginator>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .product-list-page {
      padding-top: 72px;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header {
      background: var(--bg-secondary);
      padding: 3rem 2rem;
      border-bottom: 1px solid var(--surface-border);
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      
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
    
    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
    }
    
    .sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    
    .filter-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--surface-border);
      
      h3 {
        font-family: 'Manrope', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-primary);
        margin: 0 0 1.25rem;
      }
    }
    
    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        cursor: pointer;
        
        &:hover {
          color: var(--text-primary);
        }
      }
    }
    
    .price-range {
      padding-top: 0.5rem;
      
      .price-values {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    
    .clear-btn {
      width: 100%;
      justify-content: center;
    }
    
    .products-main {
      min-height: 600px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .skeleton-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1rem;
    }
    
    .no-products {
      text-align: center;
      padding: 4rem 2rem;
      
      i {
        font-size: 3rem;
        color: var(--text-disabled);
        margin-bottom: 1rem;
      }
      
      h3 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.25rem;
        color: var(--text-primary);
        margin: 0 0 0.5rem;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin: 0;
      }
    }
    
    @media (max-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        
        .filter-section {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
      }
      
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .sidebar {
        grid-template-columns: 1fr;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  
  loading = signal(true);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
  selectedCategories: string[] = [];
  priceRange = [0, 2000];
  sortBy = 'featured';
  
  first = signal(0);
  itemsPerPage = 9;
  
  sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' }
  ];

  filteredProducts = computed(() => {
    let filtered = [...this.products()];
    
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        this.selectedCategories.some(cat => 
          p.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }
    
    filtered = filtered.filter(p => 
      p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
    );
    
    switch (this.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    
    return filtered;
  });

  paginatedProducts = computed(() => {
    const start = this.first();
    return this.filteredProducts().slice(start, start + this.itemsPerPage);
  });

  async ngOnInit(): Promise<void> {
    const categorySlug = this.route.snapshot.queryParamMap.get('category');
    if (categorySlug) {
      this.selectedCategories = [categorySlug];
    }
    
    const [products, cats] = await Promise.all([
      this.productService.getProducts(),
      this.productService.getCategories()
    ]);
    
    this.products.set(products);
    this.categories.set(cats);
    this.loading.set(false);
  }

  applyFilters(): void {
    this.first.set(0);
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.priceRange = [0, 2000];
    this.sortBy = 'featured';
    this.first.set(0);
  }

  onPageChange(event: any): void {
    this.first.set(event.first);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPriceChange(event: any): void {
    if (event.values && event.values.length === 2) {
      let [min, max] = event.values;
      
      if (min > max) {
        [min, max] = [max, min];
      }
      
      const minGap = 50;
      if (max - min < minGap) {
        if (min === event.values[0]) {
          min = max - minGap;
        } else {
          max = min + minGap;
        }
      }
      
      this.priceRange = [Math.max(0, min), Math.min(2000, max)];
    }
  }
}
