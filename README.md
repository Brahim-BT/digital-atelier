# Digital Atelier - Angular eCommerce Application

A production-ready Angular 21 eCommerce application featuring a modern dark theme design system.

## Tech Stack

- **Angular 21** - Latest version with standalone components
- **PrimeNG 21** - UI component library
- **TypeScript** - Strict mode enabled
- **SCSS** - Custom theming with CSS variables

## Features

- **Product Catalog** - Browse, filter, and search products
- **Product Details** - Image gallery, color/size selection, specifications
- **Shopping Cart** - Signal-based state management, quantity controls, promo codes
- **Checkout Flow** - Multi-step form with validation
- **Authentication** - Login with email/password + social providers
- **Responsive Design** - Mobile-first approach

## Architecture

```
src/
├── app/
│   ├── core/                    # Singleton services
│   │   └── services/
│   │       ├── cart.service.ts      # Signal-based cart state
│   │       ├── product.service.ts   # Product data service
│   │       └── auth.service.ts      # Authentication service
│   ├── shared/                  # Reusable components
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── product-card/
│   │   └── models/
│   ├── features/                # Lazy-loaded features
│   │   ├── home/
│   │   ├── products/
│   │   │   ├── product-list/
│   │   │   └── product-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── auth/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
└── styles.scss
```

## Design System

- **Theme**: Dark mode with cyan accent (#81ecff)
- **Typography**: Manrope (display), Inter (body)
- **Icons**: Material Symbols Outlined
- **Effects**: Glassmorphism, subtle gradients

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
cd digital-atelier
npm install
```

### Development

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Production Build

```bash
npm run build
# or
ng build
```

Build artifacts stored in `dist/digital-atelier/`

## Demo Credentials

- **Email**: demo@atelire.co
- **Password**: demo123

## Promo Code

- **ATELIER20** - 20% discount

## Routes

| Route | Description |
|-------|-------------|
| `/home` | Homepage with hero, categories, featured products |
| `/products` | Product listing with filters |
| `/products/:id` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/auth` | Login/Authentication |

## State Management

Uses Angular Signals for reactive state:

```typescript
// Example: Cart service
readonly items = signal<CartItem[]>([]);
readonly itemCount = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));
readonly subtotal = computed(() => this._items().reduce((sum, item) => sum + (item.product.price * item.quantity), 0));
```

## Components

All components use standalone architecture with:
- OnPush change detection
- Lazy loading
- Smart + dumb component pattern

## License

MIT
