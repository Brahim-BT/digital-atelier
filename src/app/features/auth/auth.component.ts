import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    CheckboxModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    
    <div class="auth-page">
      <div class="auth-visual">
        <div class="visual-overlay"></div>
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" alt="Atelier" class="visual-image" />
        <div class="visual-content">
          <h2>Digital Atelier</h2>
          <p>Curated Modernity. Join our community of design enthusiasts.</p>
        </div>
      </div>
      
      <div class="auth-form-section">
        <div class="auth-container">
          <div class="auth-header">
            <a routerLink="/home" class="logo">Digital Atelier</a>
            <h1>Welcome back</h1>
            <p>Sign in to access your account</p>
          </div>
          
          <div class="social-login">
            <button pButton class="social-btn google-btn" (click)="loginWithGoogle()">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button pButton class="social-btn github-btn" (click)="loginWithGithub()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
          
          <div class="divider">
            <span>or sign in with email</span>
          </div>
          
          <form [formGroup]="loginForm" class="login-form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Email</label>
              <input pInputText id="email" type="email" formControlName="email" placeholder="Enter your email" />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <small class="error">Please enter a valid email</small>
              }
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input-wrapper">
                <input 
                  pInputText 
                  id="password" 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password" 
                  placeholder="Enter your password"
                />
                <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())">
                  <span class="material-symbols-outlined">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <small class="error">Password is required</small>
              }
            </div>
            
            <div class="form-options">
              <div class="remember-me">
                <p-checkbox formControlName="rememberMe" [binary]="true" inputId="rememberMe"></p-checkbox>
                <label for="rememberMe">Remember me</label>
              </div>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>
            
            <button pButton type="submit" label="Authenticate Account" class="submit-btn" [loading]="loading()" [disabled]="loginForm.invalid"></button>
          </form>
          
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Create one</a></p>
          </div>
          
          <div class="demo-hint">
            <i class="pi pi-info-circle"></i>
            <span>Demo: demo&#64;atelire.co / demo123</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    
    .auth-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .visual-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(14, 14, 14, 0.8) 0%, rgba(14, 14, 14, 0.6) 100%);
        z-index: 1;
      }
      
      .visual-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .visual-content {
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 2rem;
        
        h2 {
          font-family: 'Manrope', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 1rem;
        }
        
        p {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
      }
    }
    
    .auth-form-section {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--bg-primary);
    }
    
    .auth-container {
      width: 100%;
      max-width: 400px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      
      .logo {
        font-family: 'Manrope', sans-serif;
        font-weight: 700;
        font-size: 1.25rem;
        color: var(--primary-color);
        text-decoration: none;
        display: inline-block;
        margin-bottom: 2rem;
      }
      
      h1 {
        font-family: 'Manrope', sans-serif;
        font-size: 1.75rem;
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
    
    .social-login {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .social-btn {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      
      &.google-btn {
        background: #ffffff;
        color: #333;
        border: none;
        
        &:hover {
          background: #f5f5f5;
        }
      }
      
      &.github-btn {
        background: #24292e;
        color: #ffffff;
        border: none;
        
        &:hover {
          background: #2f363d;
        }
      }
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      
      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--surface-border);
      }
      
      span {
        padding: 0 1rem;
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary);
      }
      
      input {
        width: 100%;
        background: var(--surface-input-bg);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        color: var(--text-primary);
        padding: 0.875rem 1rem;
        font-size: 1rem;
        
        &::placeholder {
          color: var(--text-muted);
        }
        
        &:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px var(--primary-color-bg);
          outline: none;
        }
      }
      
      .error {
        color: var(--accent-error);
        font-size: 0.75rem;
      }
    }
    
    .password-input-wrapper {
      position: relative;
      
      input {
        width: 100%;
        padding-right: 3rem;
      }
      
      .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: var(--primary-color);
        }
        
        .material-symbols-outlined {
          font-size: 1.25rem;
        }
      }
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .remember-me {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          cursor: pointer;
        }
      }
      
      .forgot-link {
        font-size: 0.875rem;
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .submit-btn {
      width: 100%;
      height: 52px;
      margin-top: 0.5rem;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      
      p {
        font-size: 0.875rem;
        color: var(--text-muted);
        margin: 0;
        
        a {
          color: var(--primary-color);
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .demo-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
      padding: 0.75rem;
      background: var(--primary-color-bg);
      border: 1px solid var(--primary-color-border);
      border-radius: 8px;
      
      i {
        color: var(--primary-color);
      }
      
      span {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }
    
    @media (max-width: 1024px) {
      .auth-page {
        grid-template-columns: 1fr;
      }
      
      .auth-visual {
        display: none;
      }
    }
  `]
})
export class AuthComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  
  loading = signal(false);
  showPassword = signal(false);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  
  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    
    this.loading.set(true);
    const { email, password } = this.loginForm.value;
    const result = await this.authService.login({ email, password });
    this.loading.set(false);
    
    if (result.success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Welcome Back',
        detail: 'You have successfully signed in'
      });
      this.router.navigate(['/home']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: result.error
      });
    }
  }
  
  async loginWithGoogle(): Promise<void> {
    const result = await this.authService.loginWithGoogle();
    if (!result.success) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: result.error });
    }
  }
  
  async loginWithGithub(): Promise<void> {
    const result = await this.authService.loginWithGithub();
    if (!result.success) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: result.error });
    }
  }
}
