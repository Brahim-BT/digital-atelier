import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, AuthService, ThemeService } from '@core/services';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BadgeModule, InputTextModule, RippleModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <a routerLink="/home" class="logo">
            <span class="logo-text">Digital Atelier</span>
          </a>
          <nav class="nav-menu">
            <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/products" routerLinkActive="active">Collections</a>
            <a href="#" class="nav-link-disabled">About</a>
            <a href="#" class="nav-link-disabled">Journal</a>
          </nav>
        </div>
        
        <div class="header-center">
          <div class="search-container">
            <span class="material-symbols-outlined search-icon">search</span>
            <input 
              type="text" 
              pInputText 
              placeholder="Search products..." 
              class="search-input"
              [(ngModel)]="searchQuery"
            />
          </div>
        </div>
        
        <div class="header-right">
          <button 
            pRipple 
            class="icon-btn theme-toggle" 
            (click)="toggleTheme()"
          >
            @if (themeService.isDarkMode()) {
              <span class="material-symbols-outlined">light_mode</span>
            } @else {
              <span class="material-symbols-outlined">dark_mode</span>
            }
          </button>
          
          <button pRipple class="icon-btn" routerLink="/wishlist">
            <span class="material-symbols-outlined">favorite_border</span>
          </button>
          
          <button pRipple class="icon-btn cart-btn" routerLink="/cart">
            <span class="material-symbols-outlined">shopping_bag</span>
            @if (cartService.itemCount() > 0) {
              <span class="cart-badge">{{ cartService.itemCount() }}</span>
            }
          </button>
          
          <button pRipple class="icon-btn" [routerLink]="authService.isLoggedIn() ? '/profile' : '/auth'">
            @if (authService.isLoggedIn() && authService.user()?.avatar) {
              <img [src]="authService.user()!.avatar" alt="Profile" class="avatar-img" />
            } @else {
              <span class="material-symbols-outlined">person</span>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--header-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--surface-border);
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 3rem;
    }
    
    .logo {
      text-decoration: none;
    }
    
    .logo-text {
      font-family: 'Manrope', sans-serif;
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    
    .nav-menu {
      display: flex;
      gap: 2rem;
      
      a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color var(--transition-fast);
        
        &:hover, &.active {
          color: var(--text-primary);
        }
        
        &.nav-link-disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }
    
    .header-center {
      flex: 1;
      max-width: 400px;
    }
    
    .search-container {
      width: 100%;
      position: relative;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.125rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    
    .search-input {
      width: 100%;
      background: var(--surface-input-bg);
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      color: var(--text-primary);
      padding: 0.625rem 1rem 0.625rem 2.75rem;
      font-size: 0.875rem;
      
      &::placeholder {
        color: var(--text-muted);
      }
      
      &:focus {
        background: var(--surface-hover);
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px var(--primary-color-bg);
        outline: none;
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      
      .material-symbols-outlined {
        font-size: 1.25rem;
      }
      
      &:hover {
        background: var(--surface-hover);
        color: var(--text-primary);
      }
    }
    
    .theme-toggle:hover {
      color: var(--primary-color);
    }
    
    .cart-btn {
      position: relative;
    }
    
    .cart-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      color: var(--primary-color-text);
      font-size: 0.625rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .avatar-img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    @media (max-width: 1024px) {
      .nav-menu {
        display: none;
      }
      
      .header-center {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  searchQuery = '';
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
