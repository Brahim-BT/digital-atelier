import { Injectable, signal } from '@angular/core';
import { Product, Category } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly products: Product[] = [
    {
      id: '1',
      name: 'Vanguard Shell 01',
      slug: 'vanguard-shell-01',
      category: 'Outerwear',
      price: 850,
      shortDescription: 'Technical outerwear engineered for urban environments',
      description: 'The Vanguard Shell 01 represents the pinnacle of technical outerwear design. Crafted from premium materials with a focus on durability and weather resistance, this jacket is built to withstand the rigors of daily wear while maintaining a sleek, modern aesthetic.',
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'
      ],
      colors: [
        { name: 'Obsidian', hex: '#1a1a1a', available: true },
        { name: 'Arctic', hex: '#e8e8e8', available: true },
        { name: 'Forest', hex: '#2d4a3e', available: false }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      isFeatured: true,
      specifications: {
        'Material': '100% Technical Nylon',
        'Water Resistance': '10,000mm',
        'Breathability': '8,000g/m²/24h',
        'Weight': '450g'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 3-5 business days.'
    },
    {
      id: '2',
      name: 'Chrono Matrix',
      slug: 'chrono-matrix',
      category: 'Technical Watch',
      price: 1200,
      shortDescription: 'Precision engineering meets contemporary design',
      description: 'The Chrono Matrix combines Swiss precision with cutting-edge design. Featuring a titanium case and sapphire crystal, this timepiece delivers exceptional accuracy and durability for the modern professional.',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'
      ],
      colors: [
        { name: 'Matte Black', hex: '#0d0d0d', available: true },
        { name: 'Silver', hex: '#c0c0c0', available: true }
      ],
      sizes: ['One Size'],
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      isFeatured: true,
      specifications: {
        'Case Material': 'Grade 5 Titanium',
        'Crystal': 'Sapphire',
        'Movement': 'Swiss Automatic',
        'Water Resistance': '100m'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 5-7 business days.'
    },
    {
      id: '3',
      name: 'Apex Transporter',
      slug: 'apex-transporter',
      category: 'Bags',
      price: 450,
      shortDescription: 'Versatile carrying solution for daily essentials',
      description: 'The Apex Transporter is designed for those who demand both style and functionality. With a modular interior system and premium materials, it adapts to your daily carrying needs.',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'
      ],
      colors: [
        { name: 'Charcoal', hex: '#36454f', available: true },
        { name: 'Navy', hex: '#1a2a4a', available: true },
        { name: 'Olive', hex: '#4a5d23', available: true }
      ],
      sizes: ['20L', '30L', '40L'],
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      isFeatured: true,
      specifications: {
        'Material': 'Ballistic Nylon',
        'Laptop Compartment': 'Up to 16"',
        'Weight': '1.2kg',
        'Warranty': '5 Years'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 3-5 business days.'
    },
    {
      id: '4',
      name: 'Core Heavy Tee',
      slug: 'core-heavy-tee',
      category: 'Essentials',
      price: 120,
      shortDescription: 'Premium basics for everyday wear',
      description: 'The Core Heavy Tee is crafted from 100% organic cotton with a substantial 280gsm weight. Its relaxed fit and reinforced seams ensure lasting comfort and durability.',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
      ],
      colors: [
        { name: 'White', hex: '#ffffff', available: true },
        { name: 'Black', hex: '#0a0a0a', available: true },
        { name: 'Grey', hex: '#808080', available: true }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      rating: 4.6,
      reviewCount: 456,
      inStock: true,
      isFeatured: true,
      specifications: {
        'Material': '100% Organic Cotton',
        'Weight': '280gsm',
        'Fit': 'Relaxed',
        'Care': 'Machine Washable'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 2-4 business days.'
    },
    {
      id: '5',
      name: 'Nexus Runner X',
      slug: 'nexus-runner-x',
      category: 'Footwear',
      price: 320,
      shortDescription: 'Performance footwear with understated aesthetics',
      description: 'The Nexus Runner X combines advanced cushioning technology with a minimalist design philosophy. Ideal for both athletic performance and casual wear.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
      ],
      colors: [
        { name: 'White/Grey', hex: '#f5f5f5', available: true },
        { name: 'All Black', hex: '#0f0f0f', available: true }
      ],
      sizes: ['40', '41', '42', '43', '44', '45'],
      rating: 4.5,
      reviewCount: 312,
      inStock: true,
      isFeatured: false,
      specifications: {
        'Upper': 'Breathable Mesh',
        'Sole': 'EVA Foam',
        'Drop': '8mm',
        'Weight': '280g'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 3-5 business days.'
    },
    {
      id: '6',
      name: 'Ocular Shade 02',
      slug: 'ocular-shade-02',
      category: 'Accessories',
      price: 280,
      shortDescription: 'Premium eyewear for discerning individuals',
      description: 'The Ocular Shade 02 features polarized lenses with UV400 protection, housed in a lightweight titanium frame. A perfect blend of form and function.',
      images: [
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'
      ],
      colors: [
        { name: 'Black', hex: '#000000', available: true },
        { name: 'Tortoise', hex: '#8b4513', available: true }
      ],
      sizes: ['One Size'],
      rating: 4.8,
      reviewCount: 167,
      inStock: true,
      isFeatured: false,
      specifications: {
        'Frame': 'Titanium',
        'Lens': 'Polarized',
        'UV Protection': 'UV400',
        'Weight': '25g'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 2-4 business days.'
    },
    {
      id: '7',
      name: 'Atelier Shell-01',
      slug: 'atelier-shell-01',
      category: 'Outerwear',
      price: 840,
      originalPrice: 1050,
      shortDescription: 'Signature piece from the Digital Atelier collection',
      description: 'The Atelier Shell-01 is the signature piece of our collection. Featuring proprietary weather-resistant technology and a contemporary silhouette, it embodies the ethos of modern luxury.',
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'
      ],
      colors: [
        { name: 'Midnight', hex: '#191970', available: true },
        { name: 'Slate', hex: '#708090', available: true }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      rating: 4.9,
      reviewCount: 78,
      inStock: true,
      isFeatured: false,
      specifications: {
        'Material': 'Proprietary Shell Fabric',
        'Lining': 'Merino Wool Blend',
        'Water Resistance': '15,000mm',
        'Breathability': '12,000g/m²/24h'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 3-5 business days.'
    },
    {
      id: '8',
      name: 'Ether No. 4 Essence',
      slug: 'ether-no-4-essence',
      category: 'Fragrance',
      price: 220,
      shortDescription: 'Subtle fragrance for the modern individual',
      description: 'Ether No. 4 is a carefully crafted fragrance with notes of bergamot, cedarwood, and white musk. Long-lasting and sophisticated.',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'
      ],
      colors: [{ name: 'Default', hex: '#d4af37', available: true }],
      sizes: ['50ml', '100ml'],
      rating: 4.4,
      reviewCount: 234,
      inStock: true,
      isFeatured: false,
      specifications: {
        'Top Notes': 'Bergamot, Lemon',
        'Heart Notes': 'Cedarwood, Violet',
        'Base Notes': 'White Musk, Amber',
        'Longevity': '8-10 hours'
      },
      shippingInfo: 'Free shipping on orders over $500. Delivery in 2-4 business days.'
    }
  ];

  private readonly categories: Category[] = [
    { id: '1', name: 'Outerwear', slug: 'outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', productCount: 24 },
    { id: '2', name: 'Technical Watch', slug: 'technical-watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', productCount: 12 },
    { id: '3', name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', productCount: 18 },
    { id: '4', name: 'Essentials', slug: 'essentials', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', productCount: 45 }
  ];

  async getProducts(): Promise<Product[]> {
    this._loading.set(true);
    await this.delay(300);
    this._loading.set(false);
    return this.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    this._loading.set(true);
    await this.delay(200);
    this._loading.set(false);
    return this.products.find(p => p.id === id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    this._loading.set(true);
    await this.delay(200);
    this._loading.set(false);
    return this.products.find(p => p.slug === slug);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    this._loading.set(true);
    await this.delay(300);
    this._loading.set(false);
    return this.products.filter(p => p.isFeatured);
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    this._loading.set(true);
    await this.delay(300);
    this._loading.set(false);
    return this.products.filter(p => p.category.toLowerCase() === categorySlug.toLowerCase());
  }

  async searchProducts(query: string): Promise<Product[]> {
    this._loading.set(true);
    await this.delay(300);
    this._loading.set(false);
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
