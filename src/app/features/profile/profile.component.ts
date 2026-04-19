import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AddressService, Address } from '@core/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AddressFormComponent } from './components/address-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, ButtonModule, InputTextModule, ToastModule, AddressFormComponent],
  providers: [MessageService],
  template: `
    <p-toast position="top-right"></p-toast>
    
    @if (showAddressForm()) {
      <app-address-form
        [address]="editingAddress()"
        (close)="closeAddressForm()"
        (saved)="onAddressSaved()"
      ></app-address-form>
    }
    
    <div class="profile-page">
      <div class="profile-header">
        <div class="header-bg"></div>
        <div class="header-content">
          <div class="avatar-section">
            @if (user()?.avatar) {
              <img [src]="user()!.avatar" [alt]="user()!.firstName" class="avatar" />
            } @else {
              <div class="avatar-placeholder">
                {{ user()?.firstName?.charAt(0) }}{{ user()?.lastName?.charAt(0) }}
              </div>
            }
            <button class="edit-avatar-btn">
              <span class="material-symbols-outlined">camera_alt</span>
            </button>
          </div>
          <div class="user-info">
            <h1>{{ user()?.firstName }} {{ user()?.lastName }}</h1>
            <p>{{ user()?.email }}</p>
            <span class="member-badge">Member since 2024</span>
          </div>
        </div>
      </div>
      
      <div class="profile-content">
        <aside class="profile-sidebar">
          <nav class="sidebar-nav">
            <button class="nav-item" [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">
              <span class="material-symbols-outlined">home</span>
              <span>Overview</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">
              <span class="material-symbols-outlined">shopping_bag</span>
              <span>My Orders</span>
              <span class="badge">3</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'addresses'" (click)="activeTab.set('addresses')">
              <span class="material-symbols-outlined">location_on</span>
              <span>Addresses</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'wishlist'" (click)="activeTab.set('wishlist')">
              <span class="material-symbols-outlined">favorite</span>
              <span>Wishlist</span>
              <span class="badge">5</span>
            </button>
            <button class="nav-item" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')">
              <span class="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
          </nav>
          
          <div class="sidebar-footer">
            <button pButton class="logout-btn" (click)="logout()">
              <span class="material-symbols-outlined">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
        
        <main class="profile-main">
          @switch (activeTab()) {
            @case ('overview') {
              <section class="section">
                <h2>Welcome back, {{ user()?.firstName }}!</h2>
                <p class="section-subtitle">Here's a summary of your account activity</p>
                
                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-icon orders">
                      <span class="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <div class="stat-info">
                      <span class="stat-value">3</span>
                      <span class="stat-label">Active Orders</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon wishlist">
                      <span class="material-symbols-outlined">favorite</span>
                    </div>
                    <div class="stat-info">
                      <span class="stat-value">5</span>
                      <span class="stat-label">Wishlist Items</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon reviews">
                      <span class="material-symbols-outlined">star</span>
                    </div>
                    <div class="stat-info">
                      <span class="stat-value">2</span>
                      <span class="stat-label">Reviews</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon points">
                      <span class="material-symbols-outlined">card_membership</span>
                    </div>
                    <div class="stat-info">
                      <span class="stat-value">1,250</span>
                      <span class="stat-label">Reward Points</span>
                    </div>
                  </div>
                </div>
                
                <div class="quick-actions">
                  <h3>Quick Actions</h3>
                  <div class="actions-grid">
                    <a routerLink="/products" class="action-card">
                      <span class="material-symbols-outlined">storefront</span>
                      <span>Continue Shopping</span>
                    </a>
                    <a routerLink="/cart" class="action-card">
                      <span class="material-symbols-outlined">shopping_cart</span>
                      <span>View Cart</span>
                    </a>
                    <button class="action-card" (click)="activeTab.set('orders')">
                      <span class="material-symbols-outlined">receipt_long</span>
                      <span>Track Orders</span>
                    </button>
                    <button class="action-card" (click)="activeTab.set('wishlist')">
                      <span class="material-symbols-outlined">favorite</span>
                      <span>My Wishlist</span>
                    </button>
                  </div>
                </div>
              </section>
            }
            
            @case ('orders') {
              <section class="section">
                <div class="section-header">
                  <h2>My Orders</h2>
                  <button pButton class="p-button-outlined">Track Order</button>
                </div>
                
                <div class="orders-list">
                  <div class="order-card">
                    <div class="order-header">
                      <div class="order-info">
                        <span class="order-id">Order #DA-2024-001</span>
                        <span class="order-date">March 28, 2026</span>
                      </div>
                      <span class="order-status delivered">Delivered</span>
                    </div>
                    <div class="order-items">
                      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" alt="Product" class="order-item-img" />
                      <div class="order-item-details">
                        <h4>Premium Wireless Headphones</h4>
                        <p>Qty: 1 | $299.00</p>
                      </div>
                    </div>
                    <div class="order-footer">
                      <span class="order-total">Total: $299.00</span>
                      <div class="order-actions">
                        <button pButton class="p-button-text p-button-sm">View Details</button>
                        <button pButton class="p-button-text p-button-sm">Reorder</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="order-card">
                    <div class="order-header">
                      <div class="order-info">
                        <span class="order-id">Order #DA-2024-002</span>
                        <span class="order-date">April 1, 2026</span>
                      </div>
                      <span class="order-status processing">Processing</span>
                    </div>
                    <div class="order-items">
                      <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80" alt="Product" class="order-item-img" />
                      <div class="order-item-details">
                        <h4>Minimalist Camera</h4>
                        <p>Qty: 1 | $449.00</p>
                      </div>
                    </div>
                    <div class="order-footer">
                      <span class="order-total">Total: $449.00</span>
                      <div class="order-actions">
                        <button pButton class="p-button-text p-button-sm">Track Package</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="order-card">
                    <div class="order-header">
                      <div class="order-info">
                        <span class="order-id">Order #DA-2024-003</span>
                        <span class="order-date">April 4, 2026</span>
                      </div>
                      <span class="order-status shipped">Shipped</span>
                    </div>
                    <div class="order-items">
                      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80" alt="Product" class="order-item-img" />
                      <div class="order-item-details">
                        <h4>Running Shoes Elite</h4>
                        <p>Qty: 2 | $189.00</p>
                      </div>
                    </div>
                    <div class="order-footer">
                      <span class="order-total">Total: $378.00</span>
                      <div class="order-actions">
                        <button pButton class="p-button-text p-button-sm">Track Package</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            }
            
            @case ('addresses') {
              <section class="section">
                <div class="section-header">
                  <h2>Saved Addresses</h2>
                  <button pButton class="p-button-outlined" (click)="openAddAddressForm()">
                    <span class="material-symbols-outlined">add</span>
                    Add New
                  </button>
                </div>
                
                @if (addresses().length === 0) {
                  <div class="empty-state">
                    <span class="material-symbols-outlined">location_off</span>
                    <h3>No addresses saved</h3>
                    <p>Add an address to speed up your checkout process</p>
                    <button pButton label="Add Address" (click)="openAddAddressForm()"></button>
                  </div>
                } @else {
                  <div class="addresses-grid">
                    @for (addr of addresses(); track addr.id) {
                      <div class="address-card" [class.default]="addr.isDefault">
                        @if (addr.isDefault) {
                          <div class="address-badge">Default</div>
                        }
                        <h4>{{ addr.label }}</h4>
                        <p class="address-name">{{ addr.fullName }}</p>
                        <p class="address-text">
                          {{ addr.street }}<br />
                          @if (addr.apt) {
                            {{ addr.apt }}<br />
                          }
                          {{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}<br />
                          {{ addr.country }}
                        </p>
                        <p class="address-phone">{{ addr.phone }}</p>
                        <div class="address-actions">
                          @if (!addr.isDefault) {
                            <button pButton class="p-button-text p-button-sm" (click)="setDefaultAddress(addr.id)">Set Default</button>
                          }
                          <button pButton class="p-button-text p-button-sm" (click)="openEditAddressForm(addr)">Edit</button>
                          <button pButton class="p-button-text p-button-sm p-button-danger-text" (click)="deleteAddress(addr.id)">Delete</button>
                        </div>
                      </div>
                    }
                  </div>
                }
              </section>
            }
            
            @case ('wishlist') {
              <section class="section">
                <div class="section-header">
                  <h2>My Wishlist</h2>
                  <span class="item-count">5 items</span>
                </div>
                
                <div class="wishlist-grid">
                  <div class="wishlist-item">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="Product" />
                    <button class="remove-btn">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    <div class="item-details">
                      <h4>Premium Headphones</h4>
                      <p class="item-price">$349.00</p>
                      <button pButton class="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                  
                  <div class="wishlist-item">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" alt="Product" />
                    <button class="remove-btn">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    <div class="item-details">
                      <h4>Smart Watch Series X</h4>
                      <p class="item-price">$599.00</p>
                      <button pButton class="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                  
                  <div class="wishlist-item">
                    <img src="https://images.unsplash.com/photo-1491553895911-0055uj8d4a3e?w=200" alt="Product" />
                    <button class="remove-btn">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    <div class="item-details">
                      <h4>Leather Messenger Bag</h4>
                      <p class="item-price">$189.00</p>
                      <button pButton class="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                  
                  <div class="wishlist-item">
                    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200" alt="Product" />
                    <button class="remove-btn">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    <div class="item-details">
                      <h4>Designer Sunglasses</h4>
                      <p class="item-price">$259.00</p>
                      <button pButton class="add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </section>
            }
            
            @case ('settings') {
              <section class="section">
                <h2>Account Settings</h2>
                
                <div class="settings-group">
                  <h3>Personal Information</h3>
                  <div class="form-grid">
                    <div class="form-field">
                      <label>First Name</label>
                      <input pInputText [value]="user()?.firstName" />
                    </div>
                    <div class="form-field">
                      <label>Last Name</label>
                      <input pInputText [value]="user()?.lastName" />
                    </div>
                    <div class="form-field full-width">
                      <label>Email Address</label>
                      <input pInputText type="email" [value]="user()?.email" />
                    </div>
                    <div class="form-field">
                      <label>Phone Number</label>
                      <input pInputText value="+1 (555) 123-4567" />
                    </div>
                    <div class="form-field">
                      <label>Date of Birth</label>
                      <input pInputText value="Jan 15, 1990" />
                    </div>
                  </div>
                  <button pButton label="Save Changes" class="save-btn"></button>
                </div>
                
                <div class="settings-group">
                  <h3>Password</h3>
                  <div class="form-grid">
                    <div class="form-field">
                      <label>Current Password</label>
                      <input pInputText type="password" placeholder="Enter current password" />
                    </div>
                    <div class="form-field">
                      <label>New Password</label>
                      <input pInputText type="password" placeholder="Enter new password" />
                    </div>
                    <div class="form-field">
                      <label>Confirm New Password</label>
                      <input pInputText type="password" placeholder="Confirm new password" />
                    </div>
                  </div>
                  <button pButton label="Update Password" class="p-button-outlined"></button>
                </div>
                
                <div class="settings-group">
                  <h3>Notifications</h3>
                  <div class="toggle-options">
                    <div class="toggle-item">
                      <div class="toggle-info">
                        <span class="toggle-title">Email Notifications</span>
                        <span class="toggle-desc">Receive order updates and promotions via email</span>
                      </div>
                      <label class="toggle-switch">
                        <input type="checkbox" checked />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                    <div class="toggle-item">
                      <div class="toggle-info">
                        <span class="toggle-title">SMS Notifications</span>
                        <span class="toggle-desc">Receive shipping updates via SMS</span>
                      </div>
                      <label class="toggle-switch">
                        <input type="checkbox" />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                    <div class="toggle-item">
                      <div class="toggle-info">
                        <span class="toggle-title">Newsletter</span>
                        <span class="toggle-desc">Subscribe to our weekly newsletter</span>
                      </div>
                      <label class="toggle-switch">
                        <input type="checkbox" checked />
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="settings-group danger-zone">
                  <h3>Danger Zone</h3>
                  <p>Once you delete your account, there is no going back. Please be certain.</p>
                  <button pButton label="Delete Account" class="p-button-danger p-button-outlined"></button>
                </div>
              </section>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background: var(--bg-secondary);
    }
    
    .profile-header {
      position: relative;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--surface-border);
      
      .header-bg {
        height: 120px;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
      }
      
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        transform: translateY(-40px);
      }
      
      .avatar-section {
        position: relative;
        
        .avatar, .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid var(--bg-primary);
          object-fit: cover;
        }
        
        .avatar-placeholder {
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
        }
        
        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            background: var(--surface-hover);
          }
          
          .material-symbols-outlined {
            font-size: 1rem;
            color: var(--text-secondary);
          }
        }
      }
      
      .user-info {
        padding-bottom: 0.5rem;
        
        h1 {
          font-family: 'Manrope', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        
        p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0.25rem 0;
        }
        
        .member-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: var(--primary-color-bg);
          color: var(--primary-color);
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 20px;
        }
      }
    }
    
    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 2rem;
    }
    
    .profile-sidebar {
      background: var(--bg-primary);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 2rem;
      
      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        width: 100%;
        
        .material-symbols-outlined {
          font-size: 1.25rem;
        }
        
        .badge {
          margin-left: auto;
          padding: 0.125rem 0.5rem;
          background: var(--primary-color-bg);
          color: var(--primary-color);
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 10px;
        }
        
        &:hover {
          background: var(--surface-hover);
        }
        
        &.active {
          background: var(--primary-color-bg);
          color: var(--primary-color);
        }
      }
      
      .sidebar-footer {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--surface-border);
      }
      
      .logout-btn {
        width: 100%;
        justify-content: flex-start;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: transparent;
        border: 1px solid var(--accent-error);
        color: var(--accent-error);
        
        &:hover {
          background: var(--accent-error);
          color: white;
        }
      }
    }
    
    .profile-main {
      .section {
        background: var(--bg-primary);
        border-radius: 12px;
        border: 1px solid var(--surface-border);
        padding: 1.5rem;
        
        h2 {
          font-family: 'Manrope', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.25rem;
        }
        
        .section-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin: 0 0 1.5rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          
          h2 {
            margin: 0;
          }
        }
        
        .item-count {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
      }
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
      
      .stat-card {
        background: var(--surface-elevated);
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .material-symbols-outlined {
            font-size: 1.5rem;
          }
          
          &.orders {
            background: #e3f2fd;
            color: #1565c0;
          }
          
          &.wishlist {
            background: #fce4ec;
            color: #c2185b;
          }
          
          &.reviews {
            background: #fff3e0;
            color: #ef6c00;
          }
          
          &.points {
            background: #e8f5e9;
            color: #2e7d32;
          }
        }
        
        .stat-info {
          display: flex;
          flex-direction: column;
          
          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
          }
          
          .stat-label {
            font-size: 0.75rem;
            color: var(--text-muted);
          }
        }
      }
    }
    
    .quick-actions {
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem;
      }
      
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        
        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--surface-elevated);
          border: 1px solid var(--surface-border);
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          transition: all 0.2s;
          cursor: pointer;
          
          .material-symbols-outlined {
            font-size: 2rem;
            color: var(--primary-color);
          }
          
          span:last-child {
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          &:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
          }
        }
      }
    }
    
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .order-card {
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        padding: 1.25rem;
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          
          .order-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            
            .order-id {
              font-weight: 600;
              color: var(--text-primary);
            }
            
            .order-date {
              font-size: 0.75rem;
              color: var(--text-muted);
            }
          }
          
          .order-status {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            
            &.delivered {
              background: #e8f5e9;
              color: #2e7d32;
            }
            
            &.processing {
              background: #e3f2fd;
              color: #1565c0;
            }
            
            &.shipped {
              background: #fff3e0;
              color: #ef6c00;
            }
          }
        }
        
        .order-items {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--surface-elevated);
          border-radius: 8px;
          
          .order-item-img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
          }
          
          .order-item-details {
            h4 {
              font-size: 0.875rem;
              font-weight: 600;
              color: var(--text-primary);
              margin: 0 0 0.25rem;
            }
            
            p {
              font-size: 0.75rem;
              color: var(--text-muted);
              margin: 0;
            }
          }
        }
        
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border);
          
          .order-total {
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .order-actions {
            display: flex;
            gap: 0.5rem;
          }
        }
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      
      .material-symbols-outlined {
        font-size: 4rem;
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
        color: var(--text-muted);
        font-size: 0.875rem;
        margin: 0 0 1.5rem;
      }
    }
    
    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      
      .address-card {
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        padding: 1.25rem;
        position: relative;
        
        &.default {
          border-color: var(--primary-color);
        }
        
        .address-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.5rem;
          background: var(--primary-color-bg);
          color: var(--primary-color);
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          border-radius: 4px;
        }
        
        h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }
        
        .address-name {
          font-weight: 500;
          color: var(--text-primary);
          margin: 0 0 0.5rem;
        }
        
        .address-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 0.5rem;
          line-height: 1.5;
        }
        
        .address-phone {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin: 0;
        }
        
        .address-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--surface-border);
        }
      }
    }
    
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      
      .wishlist-item {
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        
        img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        
        .remove-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
          
          .material-symbols-outlined {
            font-size: 1rem;
            color: var(--text-secondary);
          }
        }
        
        &:hover .remove-btn {
          opacity: 1;
        }
        
        .item-details {
          padding: 1rem;
          
          h4 {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 0.5rem;
          }
          
          .item-price {
            font-size: 1rem;
            font-weight: 700;
            color: var(--primary-color);
            margin: 0 0 0.75rem;
          }
          
          .add-to-cart-btn {
            width: 100%;
            height: 36px;
            font-size: 0.75rem;
          }
        }
      }
    }
    
    .settings-group {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--surface-border);
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1rem;
      }
      
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1rem;
        
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          
          &.full-width {
            grid-column: span 2;
          }
          
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
          }
          
          input {
            padding: 0.75rem 1rem;
            border: 1px solid var(--surface-border);
            border-radius: 8px;
            background: var(--surface-input-bg);
            color: var(--text-primary);
            font-size: 0.875rem;
            
            &:focus {
              border-color: var(--primary-color);
              outline: none;
            }
          }
        }
      }
      
      .save-btn {
        margin-top: 1rem;
      }
      
      &.danger-zone {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 10px;
        padding: 1.5rem;
        
        h3 {
          color: #dc2626;
        }
        
        p {
          color: #991b1b;
          font-size: 0.875rem;
          margin: 0 0 1rem;
        }
      }
    }
    
    .toggle-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .toggle-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--surface-elevated);
        border-radius: 8px;
        
        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          
          .toggle-title {
            font-weight: 500;
            color: var(--text-primary);
          }
          
          .toggle-desc {
            font-size: 0.75rem;
            color: var(--text-muted);
          }
        }
      }
    }
    
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
      
      input {
        opacity: 0;
        width: 0;
        height: 0;
        
        &:checked + .toggle-slider {
          background: var(--primary-color);
          
          &::before {
            transform: translateX(22px);
          }
        }
      }
      
      .toggle-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background: var(--surface-border);
        border-radius: 26px;
        transition: 0.3s;
        
        &::before {
          content: '';
          position: absolute;
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }
      }
    }
    
    @media (max-width: 1024px) {
      .profile-content {
        grid-template-columns: 1fr;
      }
      
      .profile-sidebar {
        position: static;
        
        .sidebar-nav {
          flex-direction: row;
          flex-wrap: wrap;
        }
        
        .nav-item {
          flex: 1;
          min-width: 120px;
          justify-content: center;
          
          span:not(.material-symbols-outlined):not(.badge) {
            display: none;
          }
        }
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .quick-actions .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .wishlist-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .addresses-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 640px) {
      .profile-header .header-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .settings-group .form-grid {
        grid-template-columns: 1fr;
        
        .form-field.full-width {
          grid-column: span 1;
        }
      }
    }
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  
  user = this.authService.user;
  activeTab = signal<'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings'>('overview');
  addresses = this.addressService.addresses;
  
  showAddressForm = signal(false);
  editingAddress = signal<Address | null>(null);
  
  openAddAddressForm(): void {
    this.editingAddress.set(null);
    this.showAddressForm.set(true);
  }
  
  openEditAddressForm(address: Address): void {
    this.editingAddress.set(address);
    this.showAddressForm.set(true);
  }
  
  closeAddressForm(): void {
    this.showAddressForm.set(false);
    this.editingAddress.set(null);
  }
  
  onAddressSaved(): void {
    const isEdit = this.editingAddress() !== null;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: isEdit ? 'Address updated successfully' : 'Address added successfully'
    });
  }
  
  setDefaultAddress(id: string): void {
    this.addressService.setDefaultAddress(id);
    this.messageService.add({
      severity: 'success',
      summary: 'Default Updated',
      detail: 'This address is now your default'
    });
  }
  
  deleteAddress(id: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id);
      this.messageService.add({
        severity: 'info',
        summary: 'Deleted',
        detail: 'Address has been removed'
      });
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
