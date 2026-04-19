import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, CartService } from '@core/services';
import { Product, ProductColor } from '@shared/models';
import { ProductCardComponent } from '@shared/components';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink, 
    FormsModule, 
    NgClass,
    RatingModule, 
    ButtonModule, 
    InputNumberModule,
    ToastModule,
    ProductCardComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    
    @if (loading()) {
      <div class="loading-state">
        <div class="loader"></div>
      </div>
    } @else if (product()) {
      <div class="product-detail-page">
        <nav class="breadcrumb">
          <a routerLink="/home">Home</a>
          <i class="pi pi-chevron-right"></i>
          <a routerLink="/products">Collections</a>
          <i class="pi pi-chevron-right"></i>
          <span>{{ product()!.name }}</span>
        </nav>
        
        <div class="product-content">
          <div class="gallery-section">
            <div class="main-image">
              <img [src]="selectedImage()" [alt]="product()!.name" />
            </div>
            <div class="thumbnails">
              @for (img of product()!.images; track img; let i = $index) {
                <button class="thumbnail" [class.active]="selectedImage() === img" (click)="selectImage(img)">
                  <img [src]="img" [alt]="'Thumbnail ' + (i + 1)" />
                </button>
              }
            </div>
          </div>
          
          <div class="info-section">
            <span class="product-category">{{ product()!.category }}</span>
            <h1 class="product-name">{{ product()!.name }}</h1>
            
            <div class="product-rating">
              <p-rating [(ngModel)]="product()!.rating" [readonly]="true"></p-rating>
              <span class="review-text">{{ product()!.rating }} ({{ product()!.reviewCount }} reviews)</span>
            </div>
            
            <div class="product-price">
              <span class="current-price">{{ formatCurrency(product()!.price) }}</span>
              @if (product()!.originalPrice) {
                <span class="original-price">{{ formatCurrency(product()!.originalPrice || 0) }}</span>
                <span class="discount">{{ getDiscount() }}% OFF</span>
              }
            </div>
            
            <p class="product-description">{{ product()!.shortDescription }}</p>
            
            <div class="option-group">
              <label>Color: <strong>{{ selectedColor()?.name }}</strong></label>
              <div class="color-options">
                @for (color of product()!.colors; track color.name) {
                  <button 
                    class="color-btn" 
                    [class.selected]="selectedColor()?.name === color.name"
                    [style.backgroundColor]="color.hex"
                    [disabled]="!color.available"
                    (click)="selectColor(color)"
                  ></button>
                }
              </div>
            </div>
            
            <div class="option-group">
              <label>Size: <strong>{{ selectedSize() }}</strong></label>
              <div class="size-options">
                @for (size of product()!.sizes; track size) {
                  <button class="size-btn" [class.selected]="selectedSize() === size" (click)="selectSize(size)">
                    {{ size }}
                  </button>
                }
              </div>
            </div>
            
            <div class="option-group">
              <label>Quantity</label>
              <p-inputNumber [(ngModel)]="quantity" [min]="1" [max]="10" [showButtons]="true" buttonLayout="horizontal" inputId="quantity"></p-inputNumber>
            </div>
            
            <div class="action-buttons">
              <button pButton label="Add to Bag" class="add-to-cart-btn" (click)="addToCart()">
                <i class="pi pi-shopping-bag"></i>
              </button>
              <button pButton [outlined]="true" class="wishlist-btn">
                <i class="pi pi-heart"></i>
              </button>
            </div>
            
            <div class="product-details-accordion">
              <div class="detail-section">
                <button class="detail-header" (click)="toggleSection('description')">
                  <span>Description</span>
                  <i class="pi" [ngClass]="openSections['description'] ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                </button>
                @if (openSections['description']) {
                  <div class="detail-content">
                    <p>{{ product()!.description }}</p>
                  </div>
                }
              </div>
              
              <div class="detail-section">
                <button class="detail-header" (click)="toggleSection('specs')">
                  <span>Specifications</span>
                  <i class="pi" [ngClass]="openSections['specs'] ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                </button>
                @if (openSections['specs'] && product()!.specifications) {
                  <div class="detail-content">
                    <table class="specs-table">
                      @for (spec of toEntries(product()!.specifications!); track spec[0]) {
                        <tr>
                          <td class="spec-key">{{ spec[0] }}</td>
                          <td class="spec-value">{{ spec[1] }}</td>
                        </tr>
                      }
                    </table>
                  </div>
                }
              </div>
              
              <div class="detail-section">
                <button class="detail-header" (click)="toggleSection('shipping')">
                  <span>Shipping</span>
                  <i class="pi" [ngClass]="openSections['shipping'] ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                </button>
                @if (openSections['shipping']) {
                  <div class="detail-content">
                    <p>{{ product()!.shippingInfo }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        
        <section class="related-products">
          <h2>Complete the Ensemble</h2>
          <div class="related-grid">
            @for (p of relatedProducts(); track p.id) {
              <app-product-card [product]="p"></app-product-card>
            }
          </div>
        </section>
      </div>
    } @else {
      <div class="not-found">
        <i class="pi pi-exclamation-triangle"></i>
        <h2>Product not found</h2>
        <button pButton label="Back to Collections" routerLink="/products"></button>
      </div>
    }
  `,
  styles: [`
    .loading-state { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding-top: 72px; }
    .loader { width: 48px; height: 48px; border: 3px solid var(--primary-color-bg); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .product-detail-page { padding-top: 72px; padding-bottom: 4rem; background: var(--bg-primary); }
    
    .breadcrumb { max-width: 1400px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
    .breadcrumb a { color: var(--text-muted); text-decoration: none; }
    .breadcrumb a:hover { color: var(--primary-color); }
    .breadcrumb i { font-size: 0.625rem; color: var(--text-disabled); }
    .breadcrumb span { color: var(--text-primary); }
    
    .product-content { max-width: 1400px; margin: 0 auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
    
    .gallery-section { position: sticky; top: 100px; height: fit-content; }
    .main-image { aspect-ratio: 1; border-radius: 16px; overflow: hidden; background: var(--surface-card); margin-bottom: 1rem; }
    .main-image img { width: 100%; height: 100%; object-fit: cover; }
    
    .thumbnails { display: flex; gap: 0.75rem; }
    .thumbnail { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; padding: 0; cursor: pointer; transition: border-color 0.2s; background: none; }
    .thumbnail.active, .thumbnail:hover { border-color: var(--primary-color); }
    .thumbnail img { width: 100%; height: 100%; object-fit: cover; }
    
    .info-section { padding-top: 1rem; }
    .product-category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary-color); font-weight: 500; }
    .product-name { font-family: 'Manrope', sans-serif; font-size: 2.5rem; font-weight: 700; color: var(--text-primary); margin: 0.5rem 0 1rem; line-height: 1.2; }
    .product-rating { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .review-text { font-size: 0.875rem; color: var(--text-muted); }
    
    .product-price { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .current-price { font-family: 'Manrope', sans-serif; font-size: 2rem; font-weight: 700; color: var(--text-primary); }
    .original-price { font-size: 1.25rem; color: var(--text-muted); text-decoration: line-through; }
    .discount { padding: 0.25rem 0.5rem; background: var(--accent-error); color: #ffffff; font-size: 0.75rem; font-weight: 700; border-radius: 4px; }
    
    .product-description { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
    
    .option-group { margin-bottom: 1.5rem; }
    .option-group label { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
    .option-group label strong { color: var(--text-primary); }
    
    .color-options { display: flex; gap: 0.75rem; }
    .color-btn { width: 40px; height: 40px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; }
    .color-btn.selected { border-color: var(--primary-color); box-shadow: 0 0 0 2px var(--primary-color-bg); }
    .color-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    
    .size-options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .size-btn { min-width: 48px; height: 48px; padding: 0 1rem; background: var(--surface-input-bg); border: 1px solid var(--surface-border); border-radius: 8px; color: var(--text-primary); font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .size-btn.selected, .size-btn:hover { background: var(--primary-color-bg); border-color: var(--primary-color); color: var(--primary-color); }
    
    :host ::ng-deep .p-inputnumber { width: 140px; }
    :host ::ng-deep .p-inputnumber .p-inputnumber-input { background: var(--surface-input-bg); border-color: var(--surface-border); color: var(--text-primary); text-align: center; }
    :host ::ng-deep .p-inputnumber .p-inputnumber-button { background: var(--surface-hover); border-color: var(--surface-border); color: var(--text-primary); }
    
    .action-buttons { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .add-to-cart-btn { flex: 1; height: 56px; }
    .add-to-cart-btn i { font-size: 1.25rem; }
    .wishlist-btn { width: 56px; height: 56px; }
    
    .product-details-accordion { border-top: 1px solid var(--surface-border); }
    .detail-section { border-bottom: 1px solid var(--surface-border); }
    .detail-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; background: none; border: none; color: var(--text-primary); font-size: 0.875rem; font-weight: 500; cursor: pointer; }
    .detail-header:hover { color: var(--primary-color); }
    .detail-header i { font-size: 0.75rem; color: var(--text-muted); }
    .detail-content { padding: 0 0 1rem; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; }
    .detail-content p { margin: 0; }
    
    .specs-table { width: 100%; }
    .specs-table tr { border-bottom: 1px solid var(--surface-border); }
    .specs-table tr:last-child { border-bottom: none; }
    .specs-table td { padding: 0.75rem 0; font-size: 0.875rem; }
    .spec-key { color: var(--text-muted); width: 40%; }
    .spec-value { color: var(--text-primary); }
    
    .related-products { max-width: 1400px; margin: 4rem auto 0; padding: 0 2rem; }
    .related-products h2 { font-family: 'Manrope', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 2rem; }
    .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    
    .not-found { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 72px; text-align: center; }
    .not-found i { font-size: 4rem; color: var(--text-disabled); margin-bottom: 1rem; }
    .not-found h2 { font-family: 'Manrope', sans-serif; font-size: 1.5rem; color: var(--text-primary); margin: 0 0 1.5rem; }
    
    @media (max-width: 1024px) {
      .product-content { grid-template-columns: 1fr; gap: 2rem; }
      .gallery-section { position: static; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .product-name { font-size: 1.75rem; }
      .related-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  
  loading = signal(true);
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedImage = signal('');
  selectedColor = signal<ProductColor | null>(null);
  selectedSize = signal('');
  quantity = 1;
  openSections: Record<string, boolean> = { description: true, specs: false, shipping: false };
  
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadProduct(id);
    }
  }
  
  private async loadProduct(id: string): Promise<void> {
    this.loading.set(true);
    const product = await this.productService.getProductById(id);
    if (product) {
      this.product.set(product);
      this.selectedImage.set(product.images[0]);
      this.selectedColor.set(product.colors.find(c => c.available) || product.colors[0]);
      this.selectedSize.set(product.sizes[0]);
      const allProducts = await this.productService.getProducts();
      const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
      this.relatedProducts.set(related.length > 0 ? related : allProducts.filter(p => p.id !== product.id).slice(0, 4));
    }
    this.loading.set(false);
  }
  
  selectImage(image: string): void { this.selectedImage.set(image); }
  selectColor(color: ProductColor): void { if (color.available) this.selectedColor.set(color); }
  selectSize(size: string): void { this.selectedSize.set(size); }
  toggleSection(section: string): void { this.openSections[section] = !this.openSections[section]; }
  
  getDiscount(): number {
    const p = this.product();
    if (p?.originalPrice) return Math.round((1 - p.price / p.originalPrice) * 100);
    return 0;
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  
  toEntries(obj: Record<string, string>): [string, string][] { return Object.entries(obj); }
  
  addToCart(): void {
    const p = this.product();
    const color = this.selectedColor();
    if (p && color) {
      this.cartService.addItem(p, color, this.selectedSize(), this.quantity);
      this.messageService.add({ severity: 'success', summary: 'Added to Bag', detail: `${p.name} has been added to your bag` });
    }
  }
}
