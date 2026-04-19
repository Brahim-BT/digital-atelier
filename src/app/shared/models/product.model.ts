export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  shippingInfo?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedSize: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'digital_wallet';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  summary: CartSummary;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
