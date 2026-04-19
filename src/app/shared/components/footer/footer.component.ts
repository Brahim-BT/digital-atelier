import { Component } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [InputTextModule, ButtonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-main">
          <div class="footer-brand">
            <span class="footer-logo">Digital Atelier</span>
            <p class="footer-tagline">Curated Modernity</p>
            <p class="footer-description">
              A digital-first approach to modern luxury. We curate products that blend 
              cutting-edge technology with timeless design.
            </p>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4>Connect</h4>
              <ul>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Pinterest</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Personal Styling</a></li>
                <li><a href="#">Gift Cards</a></li>
                <li><a href="#">Corporate Orders</a></li>
                <li><a href="#">Size Guide</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-newsletter">
            <h4>Stay Connected</h4>
            <p>Subscribe for exclusive releases and updates.</p>
            <div class="newsletter-form">
              <input 
                type="email" 
                pInputText 
                placeholder="Enter your email"
                class="newsletter-input"
              />
              <button pButton class="newsletter-btn">
                <i class="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 Digital Atelier. All rights reserved.</p>
          <div class="payment-icons">
            <i class="pi pi-credit-card"></i>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--footer-bg);
      border-top: 1px solid var(--surface-border);
      margin-top: 4rem;
    }
    
    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem 2rem;
    }
    
    .footer-main {
      display: grid;
      grid-template-columns: 1.5fr 3fr 1.5fr;
      gap: 4rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid var(--surface-border);
    }
    
    .footer-brand {
      .footer-logo {
        font-family: 'Manrope', sans-serif;
        font-weight: 700;
        font-size: 1.25rem;
        color: var(--text-primary);
      }
      
      .footer-tagline {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--primary-color);
        margin: 0.25rem 0 1rem;
      }
      
      .footer-description {
        font-size: 0.875rem;
        color: var(--text-muted);
        line-height: 1.6;
        margin: 0;
      }
    }
    
    .footer-links {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
    
    .footer-column {
      h4 {
        font-family: 'Manrope', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-primary);
        margin: 0 0 1.25rem;
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: 0.75rem;
        }
        
        a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-fast);
          
          &:hover {
            color: var(--primary-color);
          }
        }
      }
    }
    
    .footer-newsletter {
      h4 {
        font-family: 'Manrope', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-primary);
        margin: 0 0 0.5rem;
      }
      
      p {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin: 0 0 1.25rem;
      }
    }
    
    .newsletter-form {
      display: flex;
      gap: 0.5rem;
    }
    
    .newsletter-input {
      flex: 1;
      background: var(--surface-input-bg);
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      color: var(--text-primary);
      padding: 0.75rem 1rem;
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
    
    .newsletter-btn {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: var(--primary-color);
      border: none;
      color: var(--primary-color-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      
      &:hover {
        background: var(--primary-color-hover);
        transform: translateX(2px);
      }
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      
      p {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin: 0;
      }
    }
    
    .payment-icons {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      
      i {
        font-size: 1.25rem;
      }
    }
    
    @media (max-width: 1024px) {
      .footer-main {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .footer-links {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 640px) {
      .footer-links {
        grid-template-columns: 1fr;
      }
      
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
